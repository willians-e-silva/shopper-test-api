import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MeasureUseCase {
    
    // VERIFY IF REPORT ALREADY EXISTS IN THIS MONTH, WITH THIS TYPE
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

    // SAVE NEW MEASURE
    async saveMeasure(id: number, datetime: string, measure_uuid:string, measure_type: string, measure_value: number, image_url: string) {
        let dateTime = new Date(datetime);
        try{
            const newMeasure = await prisma.measurements.create({
                data: {
                    measure_uuid: measure_uuid,
                    customer_id: id,
                    measure_type: measure_type,
                    measure_datetime: dateTime,
                    measure_value: measure_value,
                    image_url: image_url
                }
            })
            return newMeasure;
        }catch (error){
            throw error;
        }
    }

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
}