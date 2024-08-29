import { GoogleGenerativeAI }  from "@google/generative-ai";
import { injectable } from "tsyringe";
import dotenv from 'dotenv';
dotenv.config();
@injectable()
export class sendPrompt {

  constructor() {

  }

  async sendPrompt(imagePath: string, type: string): Promise<any> {
    
    let genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      let prompt = `voce consegue me dizer o numero registrado nesse relogio que contabiliza a conta de ${type == "WATER" ? "agua" : "gás"}?`;
      const result = await model.generateContent(prompt)
      ;
      return result
    } catch (error) {
        throw error;
    }
  }

}