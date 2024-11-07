import { setTimeout } from 'timers/promises';

export function validateVideoId(videoId) {
  if (!videoId || typeof videoId !== 'string') {
    throw new Error('Invalid video ID');
  }
  if (!/^\d+$/.test(videoId)) {
    throw new Error('Video ID must contain only numbers');
  }
  return true;
}

export async function retry(operation, maxAttempts = 5, initialDelay = 5000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      
      // Handle rate limiting specifically
      let delay = initialDelay * Math.pow(2, attempt - 1);
      if (error.message.includes('429') || error.message.includes('too many API requests')) {
        delay = Math.max(delay, 60000); // At least 60 seconds for rate limits
        console.log('Rate limit hit. Waiting before retry...');
      }
      
      console.log(`Attempt ${attempt} failed. Retrying in ${delay/1000} seconds...`);
      await setTimeout(delay);
    }
  }
  
  throw lastError;
}
