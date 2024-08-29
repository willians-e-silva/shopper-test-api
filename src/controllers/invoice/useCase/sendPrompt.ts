import { GoogleGenerativeAI }  from "@google/generative-ai";

export class sendPrompt {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI("AIzaSyCdGNM-nk3Ia6QNsWR_BmNVXNwXoceenBY");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async sendPrompt(body: any, imagePath: string): Promise<any> {
    try {
      const prompt = `com base na imagem enviada, me diga oque você vê? ${imagePath}`;
      
      const result = await this.model.generateContent([prompt]);
      return result
    } catch (error) {
        throw error;
    }
  }

}