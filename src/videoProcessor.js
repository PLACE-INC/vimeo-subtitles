import fs from 'fs';
import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';
import { getVideo, getVideoFiles, client } from './vimeoClient.js';
import { retry, validateVideoId } from './utils.js';

const TEMP_DIR = './temp_videos';
const TIMEOUT = 60000; // Increased to 60 seconds
const UPLOAD_TIMEOUT = 300000; // 5 minutes for uploads

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

async function downloadVideo(downloadUrl, filename) {
  const response = await fetch(downloadUrl, {
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Vimeo-Caption-Generator/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const destination = `${TEMP_DIR}/${filename}`;
  await pipeline(response.body, fs.createWriteStream(destination));
  return destination;
}

async function replaceVideo(videoUri, filePath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timed out'));
    }, UPLOAD_TIMEOUT);

    client.upload(
      filePath,
      {
        uri: videoUri,
        timeout: UPLOAD_TIMEOUT
      },
      (error, body, statusCode) => {
        clearTimeout(timeout);
        if (error) {
          reject(new Error(`Upload failed (${statusCode}): ${error.message}`));
        } else {
          resolve(body);
        }
      }
    );
  });
}

function cleanupTempFiles(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
}

export async function processSingleVideo(videoId) {
  let filePath;
  try {
    console.log(`Fetching video ${videoId}...`);
    
    const video = await retry(async () => {
      const result = await getVideo(videoId);
      if (!result) throw new Error(`Video ${videoId} not found`);
      return result;
    });

    console.log(`Processing video: ${video.name}`);
    
    if (video.texttracks && video.texttracks.length > 0) {
      console.log(`Video ${video.name} already has captions, skipping...`);
      return false;
    }

    const files = await retry(async () => {
      const result = await getVideoFiles(video.uri);
      const downloadFile = result.find(file => file.quality === 'source');
      if (!downloadFile?.link) {
        throw new Error(`No download URL found for ${video.name}`);
      }
      return downloadFile;
    });

    const filename = `${videoId}_${Date.now()}.mp4`;
    console.log(`Downloading ${video.name}...`);
    
    filePath = await retry(async () => {
      return await downloadVideo(files.link, filename);
    });

    console.log(`Uploading ${video.name}...`);
    await retry(async () => {
      return await replaceVideo(video.uri, filePath);
    });

    console.log(`Successfully processed ${video.name}`);
    return true;

  } catch (error) {
    console.error(`Failed to process video ${videoId}:`, error.message);
    console.error('Stack trace:', error.stack);
    return false;
  } finally {
    cleanupTempFiles(filePath);
  }
}
