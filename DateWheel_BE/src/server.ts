import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  app.listen(config.port, () => {
    console.log(`Server is running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();
