import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function portraitUploadPlugin(): Plugin {
  return {
    name: 'portrait-upload-handler',
    configureServer(server) {
      server.middlewares.use('/api/upload-portrait', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              if (body.image) {
                const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve(__dirname, 'public/images');
                fs.mkdirSync(publicDir, { recursive: true });
                fs.writeFileSync(path.join(publicDir, 'portrait.jpg'), buffer);

                const assetsDir = path.resolve(__dirname, 'src/assets/images');
                fs.mkdirSync(assetsDir, { recursive: true });
                fs.writeFileSync(path.join(assetsDir, 'opera_singer_verisme_portrait_1790685727901.jpg'), buffer);
                fs.writeFileSync(path.join(assetsDir, 'user_portrait.jpg'), buffer);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, path: '/images/portrait.jpg' }));
                return;
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'No image provided' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/upload-gallery-photo', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              if (body.image && body.filename) {
                const category = body.category === 'behind_the_scenes' ? 'behind_the_scenes' : 'onstage';
                const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const targetDir = path.resolve(__dirname, `public/images/${category}`);
                fs.mkdirSync(targetDir, { recursive: true });

                const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                fs.writeFileSync(path.join(targetDir, safeName), buffer);

                const url = `/images/${category}/${safeName}`;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url, filename: safeName }));
                return;
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing image or filename' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      // Serve static images directly from public/images
      server.middlewares.use('/images', (req, res, next) => {
        try {
          const reqPath = decodeURIComponent(req.url || '');
          const filePath = path.resolve(__dirname, 'public/images', reqPath.replace(/^\//, ''));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.gif': 'image/gif'
            };
            res.writeHead(200, {
              'Content-Type': mimeTypes[ext] || 'application/octet-stream',
              'Cache-Control': 'public, max-age=3600'
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        } catch (e) {
          console.error('Error serving static image:', e);
        }
        next();
      });

      // API to list all uploaded gallery photos
      server.middlewares.use('/api/gallery-photos', (req, res) => {
        if (req.method === 'GET') {
          try {
            const dir = path.resolve(__dirname, 'public/images/onstage');
            if (fs.existsSync(dir)) {
              const files = fs.readdirSync(dir);
              const photos = files
                .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                .map((f, i) => ({
                  id: `photo-${i}-${f}`,
                  title: '',
                  category: 'production',
                  image: `/images/onstage/${f}`,
                  caption: '',
                  venueOrContext: '',
                  year: ''
                }));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, photos }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, photos: [] }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    }
  };
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [react(), tailwindcss(), portraitUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
