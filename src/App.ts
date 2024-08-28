import express from 'express';
import { router } from './routes/routes';

// import { errorHandler } from './middlewares/errorHandler';

export class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
  }

  public async init() {
    try {
      // Initialize database connections or other async tasks here
      await this.start();
    } catch (error) {
      console.error(error);
    }
  }

  public async start(): Promise<void> {
    this.express.use("/public", express.static(__dirname + '/public'));

    // Middleware para analisar o corpo da requisição
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    this.express.use(router);
    // this.express.use(errorHandler);
  }
}