
import express from 'express';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', requireAuth, async (req: any, res) => {
    try {
        const { image, filename } = req.body;
        if (!image || !filename) {
            return res.status(400).json({ error: 'Missing image data or filename' });
        }

        // Extract base64 data (remove "data:image/png;base64," prefix)
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        let buffer;
        if (matches && matches.length === 3) {
            buffer = Buffer.from(matches[2], 'base64');
        } else {
            // Fallback if raw base64 string
            buffer = Buffer.from(image, 'base64');
        }

        const uniqueName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, buffer);

        // Return URL (assuming server serves /uploads)
        // Adjust protocol/host later if needed, but relative URL /uploads/xyz is best
        res.json({ url: `/uploads/${uniqueName}` });

    } catch (e) {
        console.error('Upload error', e);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
