/**
 * server.ts
 */
import { app } from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`Current Environment: ${config.env}`);
  console.log(`Running Express on Port ${config.port}, ${Date()}`);
});
