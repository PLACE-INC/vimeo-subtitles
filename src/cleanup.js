import { cleanupTempFiles } from './videoProcessor.js';

function handleExit(signal) {
  console.log(`\nReceived ${signal}. Cleaning up...`);
  cleanupTempFiles();
  process.exit(0);
}

process.on('SIGINT', () => handleExit('SIGINT'));
process.on('SIGTERM', () => handleExit('SIGTERM'));
