import { getAllVideos } from './vimeoClient.js';
import { processSingleVideo } from './videoProcessor.js';
import { validateVideoId } from './utils.js';
import { loadVideoIdsFromFile, isVideoProcessed, markVideoAsProcessed } from './batchProcessor.js';
import './cleanup.js';

const TARGET_DATE = new Date('2022-05-20');

async function processAllVideos() {
  try {
    console.log('Fetching all videos...');
    const videos = await getAllVideos();
    
    const videosToProcess = videos.filter(video => {
      const videoDate = new Date(video.created_time);
      return videoDate < TARGET_DATE && 
             (!video.texttracks || video.texttracks.length === 0);
    });

    console.log(`Found ${videosToProcess.length} videos without captions before May 20, 2022`);

    for (const [index, video] of videosToProcess.entries()) {
      const videoId = video.uri.split('/').pop();
      console.log(`Processing video ${index + 1}/${videosToProcess.length}`);
      await processSingleVideo(videoId);
    }

    console.log('All videos processed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processBatchFromFile(filePath) {
  const videoIds = loadVideoIdsFromFile(filePath);
  console.log(`Loaded ${videoIds.length} video IDs from file`);

  for (const [index, videoId] of videoIds.entries()) {
    try {
      validateVideoId(videoId);
      
      if (isVideoProcessed(videoId)) {
        console.log(`Skipping already processed video ${videoId}`);
        continue;
      }

      console.log(`Processing video ${index + 1}/${videoIds.length}: ${videoId}`);
      const success = await processSingleVideo(videoId);
      markVideoAsProcessed(videoId, success);
      
    } catch (error) {
      console.error(`Error processing video ${videoId}:`, error.message);
      markVideoAsProcessed(videoId, false);
    }
  }
}

// Check command line arguments
const arg = process.argv[2];

if (arg) {
  try {
    if (arg.endsWith('.txt')) {
      console.log(`Processing videos from file: ${arg}`);
      await processBatchFromFile(arg);
    } else {
      validateVideoId(arg);
      console.log(`Processing single video ID: ${arg}`);
      const success = await processSingleVideo(arg);
      markVideoAsProcessed(arg, success);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
} else {
  console.log('No video ID or file provided, processing all videos...');
  processAllVideos();
}
