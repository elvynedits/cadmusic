import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import ytSearch from 'yt-search';
import axios from 'axios';

// Stream caching to avoid repeated requests
const streamCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Search Music
  app.post('/api/search-music', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const r = await ytSearch(query);
      const videos = r.videos.slice(0, 20).map(v => ({
        videoId: v.videoId,
        title: v.title,
        artist: v.author.name,
        duration: v.seconds,
        thumbnail: v.thumbnail,
      }));

      res.json({ results: videos });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to search music' });
    }
  });

  // Top Picks
  app.get('/api/top-picks', async (req, res) => {
    try {
      const r = await ytSearch('Global Top Songs 2024 playlist');
      const playlists = r.playlists || r.lists;
      if (playlists && playlists.length > 0) {
        const listId = playlists[0].listId;
        const playlist = await ytSearch({ listId });
        const videos = playlist.videos.slice(0, 10).map(v => ({
          videoId: v.videoId,
          title: v.title,
          artist: v.author.name,
          duration: v.duration.seconds,
          thumbnail: v.thumbnail,
        }));
        return res.json({ results: videos });
      } else {
        // Fallback to search
        const r2 = await ytSearch('Global Top Songs 2024');
        const videos = r2.videos.slice(0, 10).map(v => ({
          videoId: v.videoId,
          title: v.title,
          artist: v.author.name,
          duration: v.seconds,
          thumbnail: v.thumbnail,
        }));
        return res.json({ results: videos });
      }
    } catch (error) {
      console.error('Top picks error:', error);
      res.status(500).json({ error: 'Failed to get top picks' });
    }
  });

  // Get Stream URL - Using external free music streaming API
  app.get('/api/stream', async (req, res) => {
    try {
      const videoId = req.query.videoId as string;
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      // Check cache first
      const cached = streamCache.get(videoId);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({ streamUrl: cached.url });
      }

      // Get stream URL from youtube-ext API (no yt-dlp needed)
      try {
        const streamResponse = await axios.get(
          `https://api.harvester.slithercraft.com/info?url=https://www.youtube.com/watch?v=${videoId}`,
          { timeout: 10000 }
        );

        if (streamResponse.data && streamResponse.data.formats && streamResponse.data.formats.length > 0) {
          // Find audio format
          const audioFormat = streamResponse.data.formats.find((f: any) => f.mimeType && f.mimeType.includes('audio'));
          
          if (audioFormat && audioFormat.url) {
            // Cache the URL
            streamCache.set(videoId, {
              url: audioFormat.url,
              timestamp: Date.now(),
            });

            return res.json({ streamUrl: audioFormat.url });
          }
        }
      } catch (e) {
        console.log('Harvester API failed, trying fallback...');
      }

      // Fallback: Return a direct play URL (works for some videos)
      const fallbackUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Use another fallback API
      try {
        const invidious = await axios.get(
          `https://api.invidious.io/api/v1/videos/${videoId}?fields=formatStreams`,
          { timeout: 8000 }
        );

        if (invidious.data && invidious.data.formatStreams && invidious.data.formatStreams.length > 0) {
          const audioStream = invidious.data.formatStreams.find((f: any) => f.type && f.type.includes('audio'));
          if (audioStream) {
            streamCache.set(videoId, {
              url: audioStream.url,
              timestamp: Date.now(),
            });
            return res.json({ streamUrl: audioStream.url });
          }
        }
      } catch (e) {
        console.log('Invidious API failed');
      }

      res.status(500).json({ error: 'Could not get stream for this video' });
    } catch (error) {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to get stream' });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
