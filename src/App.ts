import express from 'express';
import { router } from './routes/routes';
import { container } from "tsyringe";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Registre as dependências
container.register("GoogleGenerativeAI", { useClass: GoogleGenerativeAI });
container.register("GoogleAIFileManager", { useClass: GoogleAIFileManager });

export class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
  }

  public async init() {
    try {
      await this.start();
    } catch (error) {
      console.error(error);
    }
  }

  public async start(): Promise<void> {
    this.express.use("/public", express.static(__dirname + '/public'));

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    this.express.use(router);
  }
}
