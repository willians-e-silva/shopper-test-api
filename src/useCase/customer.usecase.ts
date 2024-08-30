import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerUseCase {
    
    /**
     * Check if customer is registered in the database.
     * @param customer - The customer code of the measure.
     * @returns {(number | null)} - Returns id if the costumer exists, otherwise null.
     */
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
    
    /**
     * Save new customer in the database.
     * @param customer - The customer code of the measure.
     * @returns {number} - Returns new customer id.
     */
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

}