# Vimeo Caption Generator

This script finds Vimeo videos without closed captions created before May 20, 2022, downloads them, and re-uploads them to trigger automatic caption generation.

## Setup

1. Create a Vimeo API app at https://developer.vimeo.com/apps
2. Copy your Client ID, Client Secret, and Access Token
3. Create a `.env` file with your credentials:
   ```
   VIMEO_CLIENT_ID=your_client_id
   VIMEO_CLIENT_SECRET=your_client_secret
   VIMEO_ACCESS_TOKEN=your_access_token
   ```

## Usage

To test with a single video:
```bash
npm start [video_id]
```

To process all videos:
```bash
npm start
```

Example testing a single video:
```bash
npm start 123456789
```

The script will:
1. If a video ID is provided, process only that video
2. Otherwise, fetch all your videos
3. Filter for videos without captions before May 20, 2022
4. Download each video
5. Re-upload it to trigger caption generation
6. Clean up temporary files

## Note

- Ensure you have sufficient storage space for temporary video downloads
- The process may take time depending on video sizes and quantity
- Vimeo API rate limits apply
- When testing, use a single video ID first to verify the process works as expected# Vimeo Auto-Caption Generator

A Node.js application that automatically processes and generates captions for Vimeo videos uploaded before May 2022, when auto-captioning wasn't available natively on the platform.

## Background

Prior to May 2022, Vimeo did not offer automatic caption generation for videos. This tool was created to retroactively add captions to videos uploaded before this date, ensuring better accessibility for older content.

## Features

- Process single videos by ID
- Batch process multiple videos from a text file
- Process all videos in your Vimeo library before a target date
- Track processing status and avoid reprocessing videos
- Handles API rate limiting with exponential backoff
- Automatic cleanup of temporary files
- Progress tracking and detailed logging

## Prerequisites

- Node.js (v14 or higher)
- Vimeo API credentials
- A Vimeo Pro or Business account

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Vimeo API credentials:
```
VIMEO_CLIENT_ID=your_client_id
VIMEO_CLIENT_SECRET=your_client_secret
VIMEO_ACCESS_TOKEN=your_access_token
```

## Usage

### Process a Single Video

```bash
node src/index.js VIDEO_ID
```

### Process Multiple Videos from a File

Create a text file (e.g., `input_id.txt`) with an array of video IDs:
```javascript
['123456789', '987654321']
```

Then run:
```bash
node src/index.js input_id.txt
```

### Process All Videos

To process all videos in your library uploaded before May 2022:
```bash
node src/index.js
```

## File Structure

- `src/index.js` - Main entry point
- `src/videoProcessor.js` - Video processing logic
- `src/vimeoClient.js` - Vimeo API client wrapper
- `src/batchProcessor.js` - Batch processing functionality
- `src/utils.js` - Utility functions
- `src/cleanup.js` - Cleanup handlers

## Error Handling

- Automatic retry mechanism for failed API calls
- Rate limit handling with exponential backoff
- Detailed error logging
- Cleanup of temporary files on process exit

## Progress Tracking

The application maintains a `processed_videos.json` file that tracks:
- Successfully processed videos
- Failed attempts
- Processing timestamps

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
