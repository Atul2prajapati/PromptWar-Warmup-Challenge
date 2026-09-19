import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.static(__dirname));

app.get('/api/user-info', (req, res) => {
    // Check GCP IAP, Cloud Run, proxy headers, or query params
    const rawEmail = req.headers['x-goog-authenticated-user-email'] ||
                     req.headers['x-user-email'] ||
                     req.headers['x-forwarded-user'] ||
                     req.headers['x-forwarded-email'] ||
                     req.headers['x-auth-request-email'] ||
                     req.query.email ||
                     '';
    
    let cleanEmail = '';
    if (typeof rawEmail === 'string' && rawEmail.trim()) {
        cleanEmail = rawEmail.replace(/^accounts\.google\.com:/, '').trim();
    }

    const rawName = req.query.name || req.headers['x-user-name'] || '';

    res.json({
        email: cleanEmail || null,
        name: rawName || null,
        headersDetected: Object.keys(req.headers).filter(k => k.toLowerCase().includes('user') || k.toLowerCase().includes('auth') || k.toLowerCase().includes('goog'))
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
