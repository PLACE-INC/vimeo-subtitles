import { getAllVideos } from './vimeoClient.js';
import { processSingleVideo } from './videoProcessor.js';
import { validateVideoId } from './utils.js';
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

// Check if a video ID was provided as a command line argument
const videoId = process.argv[2];

if (videoId) {
  try {
    validateVideoId(videoId);
    console.log(`Testing with single video ID: ${videoId}`);
    await processSingleVideo(videoId);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
} else {
  console.log('No video ID provided, processing all videos...');
  processAllVideos();
}
