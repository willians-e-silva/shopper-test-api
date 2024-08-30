import 'reflect-metadata';
import { App } from './App';
import { config } from './config/index';

async function startServer() {
  const app = new App();

  try {
    await app.init();
    
    app.express.listen(config.port, () => {
      console.info(`Server is running on port: ${config.port}`);
    }).on('error', handleError);
  } catch (error) {
    throw error;
  }
}

function handleError(error: Error) {
  console.error('Could not run server due to error: ', error.message);
}

startServer();