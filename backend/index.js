import express from 'express';
import instagramGetUrl from 'instagram-url-direct';
import fbDownloader from 'fb-downloader-scrapper';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());

// Endpoint to download Facebook videos
app.get("/download-fb-video", async (req, res) => {
    const videoUrl = req.query.url;
    try {
        const videoInfo = await fbDownloader(videoUrl);
        const videoDownloadUrl = videoInfo.hd;
        if (videoDownloadUrl) {
            return res.json({ videoUrl: videoDownloadUrl });
        } else {
            return res.status(404).json({ error: "No downloadable video found." });
        }
    } catch (error) {
        return res.status(404).json({ error: "Please enter a valid Facebook URL." });
    }
});

// Endpoint to download Instagram videos
app.get("/download-instagram-video", async (req, res) => {
    const videoUrl = req.query.url;
    try {
        const videoInfo = await instagramGetUrl(videoUrl);
        if (!videoInfo.url_list || videoInfo.url_list.length === 0) {
            return res.status(400).send("No downloadable video found.");
        }
        const videoDownloadUrl = videoInfo.url_list[0];
        return res.json({ videoUrl: videoDownloadUrl });
    } catch (error) {
        return res.status(404).json({ error: "Please enter a valid Instagram URL." });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
