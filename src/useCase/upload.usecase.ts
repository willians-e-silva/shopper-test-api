import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UploadUseCase {
    
    async checkDoubleReport(customer: string, datetime: string, measure_type: string) {
        try {
            const date = new Date(datetime);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
    
            // VERIFY IF REPORT ALREADY EXISTS IN THIS MONTH, WITH THIS TYPE
            let measures = await prisma.customer_measurement.findFirst({
                where: {
                    customer_code: customer,
                    measure_type: measure_type,
                    AND: [
                        {
                            measure_datetime: {
                                gte: new Date(year, month - 1, 1),
                                lt: new Date(year, month, 1)
                            }
                        }
                    ]
                }
            });

            return (measures !== null)
        } catch (error) {
            throw error;
        }
    }

    async saveNewMeasure(customer: string, datetime: string, measure_type: string) {
        console.log(datetime)
        try {
            const date = new Date(datetime);
            let isUnique = await prisma.customer_measurement.findFirst({
                where: {
                    customer_code: customer,
                    measure_datetime: date,
                    measure_type: measure_type
                }
            });
            console.log(isUnique)
            return isUnique
        } catch (error) {
            throw error;
        }
    }
}