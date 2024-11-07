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

export async function retry(operation, maxAttempts = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed. Retrying in ${delay/1000} seconds...`);
      await setTimeout(delay);
    }
  }
  
  throw lastError;
}
