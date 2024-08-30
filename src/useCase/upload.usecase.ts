import { isBase64 } from '@utils/isBase64';

export class UploadUseCase {
    checkDoubleReport(customer: string, date: string, measure_type: string): boolean {
        return true
    }
}