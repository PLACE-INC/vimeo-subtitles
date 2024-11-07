import fs from 'fs';
import path from 'path';

const PROCESSED_LOG = 'processed_videos.json';

export function loadProcessedVideos() {
  try {
    if (fs.existsSync(PROCESSED_LOG)) {
      return JSON.parse(fs.readFileSync(PROCESSED_LOG, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading processed videos:', error);
  }
  return {};
}

export function markVideoAsProcessed(videoId, success) {
  try {
    const processed = loadProcessedVideos();
    processed[videoId] = {
      timestamp: new Date().toISOString(),
      success
    };
    fs.writeFileSync(PROCESSED_LOG, JSON.stringify(processed, null, 2));
  } catch (error) {
    console.error('Error saving processed video:', error);
  }
}

export function loadVideoIdsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Handle the array format from input_id.txt
    const parsed = JSON.parse(content.replace(/'/g, '"'));
    return parsed.filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
  } catch (error) {
    console.error('Error reading video IDs file:', error);
    return [];
  }
}

export function isVideoProcessed(videoId) {
  const processed = loadProcessedVideos();
  return processed[videoId]?.success === true;
}
