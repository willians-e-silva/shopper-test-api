import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MeasureUseCase {
    
    /**
     * Check if a measure is already exists in this month.
     * @param customer - The customer code of the measure.
     * @param datetime - The datetime of the measure.
     * @returns {boolean} - Returns true if the measure exists, otherwise false.
     */
    async checkDoubleMeasure(customer: string, datetime: string, measure_type: string) {
        try {
            const date = new Date(datetime);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            let measures = await prisma.measurements.findFirst({
                where: {
                    measure_type: measure_type,
                    customer: {
                        customer_code: customer
                    },
                    AND: [
                        {
                            measure_datetime: {
                                gte: new Date(year, month - 1, 1),
                                lt: new Date(year, month, 1)
                            }
                        }
                    ]
                },
                include: {
                    customer: true
                }
            });
            return (measures !== null);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Save new measure in the database.
     * @param id - The customer id of the measure.
     * @param datetime - The datetime of the measure.
     * @param measure_uuid - The created uuid of the measure.
     * @param measure_type - The type of the measurement, GAS or WATER.
     * @param measure_value - The value of the measure send by gemini.
     * @param image_url - The url of the image send by vision.
     */
    async saveMeasure(id: number, datetime: string, measure_uuid:string, measure_type: string, measure_value: number, image_url: string) {
        let dateTime = new Date(datetime);
        try{
            await prisma.measurements.create({
                data: {
                    measure_uuid: measure_uuid,
                    customer_id: id,
                    measure_type: measure_type,
                    measure_datetime: dateTime,
                    measure_value: measure_value,
                    image_url: image_url
                }
            })
            return;
        }catch (error){
            throw error;
        }
    }

    /**
     * Checks if measure already exists in database.
     * @param measure_uuid - The created uuid of the measure.
     * @returns {boolean} - Returns true if the measure exists, otherwise false.
     */
    async checkMeasureExist(measure_uuid: string) {
        try {
            let measure = await prisma.measurements.findFirst({
                where: {
                    measure_uuid: measure_uuid,
                }
            });
            
            return (measure !== null);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if measure has already been confirmed.
     * @param measure_uuid - The created uuid of the measure.
     * @returns {boolean} - Returns true if the measure has already been confirmed.
     */
    async checkMeasurementConfirmation (measure_uuid: string) {
        try {
            let measure = await prisma.measurements.findFirst({
                where: {
                    measure_uuid: measure_uuid,
                }
            });
            
            return (measure?.has_confirmed);
        } catch (error) {
            throw error;
        }
    }

        /**
     * Save new measure in the database.
     * @param customer - The customer code of the measure.
     * @param datetime - The datetime of the measure.
     * @param measure_uuid - The created uuid of the measure.
     * @param type - The type of the measurement, GAS or WATER.
     * @param measure_value - The value of the measure send by gemini.
     * @param image_url - The url of the image send by vision.
     * @returns {boolean} - Returns true if the measure exists, otherwise false.
     */
    async saveMeasureConfirmation(measure_uuid: string, measure_value: number) {
        try {
            let measure = await prisma.measurements.findFirst({
                where: {
                    measure_uuid: measure_uuid,
                }
            });
    
            if (!measure) {
                throw new Error("Measure not found");
            }
    
            await prisma.measurements.update({
                where: {
                    id: measure.id
                },
                data: {
                    has_confirmed: true,
                    measure_value: measure_value
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all measures by the customer id.
     * @param customer - The customer code of the measure.
     * @param type - The type of the measurement, GAS or WATER.
     * @returns {Array} - Returns all measures realated to the customer.
     */
    async getAllMeasuresByCustomer(customer: number, type?: string) {
        try {
            let where: any = {
                customer_id: customer
            };

            if (type !== undefined) {
                where.measure_type = type;
            }

            let measures = await prisma.measurements.findMany({
                where: where
            });

            return measures;
        } catch (error) {
            throw error;
        }
    }
}