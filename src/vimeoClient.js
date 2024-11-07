import { Vimeo } from '@vimeo/vimeo';
import dotenv from 'dotenv';

dotenv.config();

const TIMEOUT = 60000; // Increased to 60 seconds

export const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN,
  { timeout: TIMEOUT }
);

export async function getVideo(videoId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, TIMEOUT);

    client.request({
      method: 'GET',
      path: `/videos/${videoId}`,
      query: {
        fields: 'uri,name,created_time,texttracks'
      }
    }, (error, body, statusCode) => {
      clearTimeout(timeout);
      if (error) {
        reject(new Error(`Failed to get video (${statusCode}): ${error.message}`));
      } else {
        resolve(body);
      }
    });
  });
}

export async function getVideoFiles(videoUri) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, TIMEOUT);

    // Extract video ID from URI and use proper endpoint
    const videoId = videoUri.split('/').pop();
    client.request({
      method: 'GET',
      path: `/videos/${videoId}/files`
    }, (error, body, statusCode) => {
      clearTimeout(timeout);
      if (error) {
        reject(new Error(`Failed to get video files (${statusCode}): ${error.message}`));
      } else {
        resolve(body);
      }
    });
  });
}

export async function getAllVideos() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, TIMEOUT);

    client.request({
      method: 'GET',
      path: '/me/videos',
      query: {
        fields: 'uri,name,created_time,texttracks',
        per_page: 100
      }
    }, (error, body, statusCode) => {
      clearTimeout(timeout);
      if (error) {
        reject(new Error(`Failed to get videos (${statusCode}): ${error.message}`));
      } else {
        resolve(body.data);
      }
    });
  });
}
