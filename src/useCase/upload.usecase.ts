import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UploadUseCase {
    async checkDoubleReport(customer: string, date: string, measure_type: string) {
        try {
            const dateObj = new Date(date);
            const test = {
                customer: customer,
                type: measure_type,
                date: new Date(),
                image: Buffer.from('dsadasdadasdsadadasdasdasdadadasdada'), // Assuming an empty buffer for the image
            };
            await prisma.customer_measurement.create({ data: test });
            return
        } catch (error) {
            throw error;
        }
    }
}