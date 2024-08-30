import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UploadUseCase {
    
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

    // VERIFY IF CUSTOMER EXISTS
    async checkCustomerExists(customer: string) {
        try {
            let customerExists = await prisma.customers.findFirst({
                where: {
                    customer_code: customer
                }
            });
            return (customerExists !== null? customerExists.id : null);
        } catch (error) {
            throw error;
        }
    }
    
    // SAVE NEW CUSTOMER
    async saveCustomer(customer: string) {
        try {
            const newCustomer = await prisma.customers.create({
                data: {
                    customer_code: customer
                }
            });
            return newCustomer.id; 
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
}