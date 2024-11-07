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
- When testing, use a single video ID first to verify the process works as expected