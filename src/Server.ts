import 'reflect-metadata';
import { App } from './App';
import { config } from './config/index';

const app = new App();

app.init().then(() => {
  app.express.listen(config.port, () => {
    console.info(`Server is running on port: ${config.port}`);
  }).on('error', (error) => {
    console.error('Could not run server due to error: ', error.message);
  });
});