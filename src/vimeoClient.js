import { Vimeo } from '@vimeo/vimeo';
import dotenv from 'dotenv';
import fs from 'fs';

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

export async function uploadVideoVersion(videoId, filePath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload request timed out'));
    }, TIMEOUT);

    // Get just the filename without the path
    const fileName = filePath.split('/').pop();

    client.request({
      method: 'POST',
      path: `/videos/${videoId}/versions`,
      query: {
        upload: {
          approach: 'tus',
          size: fs.statSync(filePath).size
        },
        name: fileName
      }
    }, (error, body, statusCode) => {
      clearTimeout(timeout);
      if (error) {
        reject(new Error(`Failed to initiate upload (${statusCode}): ${error.message}`));
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

    // Extract video ID from URI and use versions endpoint
    const videoId = videoUri.split('/').pop();
    client.request({
      method: 'GET',
      path: `/videos/${videoId}/versions`
    }, (error, body, statusCode) => {
      console.log('Versions response:', JSON.stringify(body, null, 2));
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
