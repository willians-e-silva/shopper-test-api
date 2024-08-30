import express from 'express';
import { router } from './routes/routes';

export class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
  }

  public async init() {
    try {
      await this.start();
    } catch (error) {
      throw error;
    }
  }

  public async start(): Promise<void> {
    this.express.use("/public", express.static(__dirname + '/public'));

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    this.express.use(router);
  }
}
