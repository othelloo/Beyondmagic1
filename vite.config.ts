import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const rootDir = import.meta.dirname || path.resolve('.');

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
                const publicDir = path.resolve(rootDir, 'public/images');
                fs.mkdirSync(publicDir, { recursive: true });
                fs.writeFileSync(path.join(publicDir, 'portrait.jpg'), buffer);

                const currentTs = path.resolve(rootDir, 'src/data/currentPortrait.ts');
                fs.writeFileSync(currentTs, `export const PERMANENT_PORTRAIT: string = ${JSON.stringify(body.image)};\n`);

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
                const targetDir = path.resolve(rootDir, `public/images/${category}`);
                fs.mkdirSync(targetDir, { recursive: true });

                const rawName = body.filename;
                fs.writeFileSync(path.join(targetDir, rawName), buffer);
                const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                if (safeName !== rawName) {
                  fs.writeFileSync(path.join(targetDir, safeName), buffer);
                }

                const url = `/images/${category}/${rawName}`;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url, filename: rawName }));
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

      // API to sync all gallery photos from client localStorage into physical files
      server.middlewares.use('/api/sync-gallery-photos', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              if (Array.isArray(body.photos) && body.photos.length > 0) {
                const targetDir = path.resolve(rootDir, 'public/images/onstage');
                fs.mkdirSync(targetDir, { recursive: true });

                const processedPhotos = body.photos.map((photo: any, index: number) => {
                  if (photo.image && typeof photo.image === 'string' && photo.image.startsWith('data:image')) {
                    const base64Data = photo.image.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    const filename = `gallery_photo_${index}_${Date.now()}.jpg`;
                    fs.writeFileSync(path.join(targetDir, filename), buffer);
                    return {
                      ...photo,
                      image: `/images/onstage/${filename}`
                    };
                  }
                  return photo;
                });

                const bundlePath = path.resolve(rootDir, 'src/data/bundledGallery.ts');
                fs.writeFileSync(bundlePath, `import { PhotoItem } from '../types';\n\nexport const BUNDLED_GALLERY_PHOTOS: PhotoItem[] = ${JSON.stringify(processedPhotos, null, 2)};\n`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: processedPhotos.length }));
                return;
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, count: 0 }));
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
          const filePath = path.resolve(rootDir, 'public/images', reqPath.replace(/^\//, ''));
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
            const dir = path.resolve(rootDir, 'public/images/onstage');
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

      // Admin Security Middleware for password verification
      let pendingAdminChange: any = null;

      server.middlewares.use('/api/admin/pending-change', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              pendingAdminChange = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'DELETE') {
          pendingAdminChange = null;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/admin/verify-token', (req, res) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url || '', 'http://localhost');
            const token = url.searchParams.get('token');
            if (pendingAdminChange && pendingAdminChange.token === token && Date.now() <= pendingAdminChange.expiresAt) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ valid: true, newPassword: pendingAdminChange.newPasswordValue }));
              return;
            }
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ valid: false, error: 'Token not found or expired' }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/admin/apply-password', (req, res) => {
        if (req.method === 'POST') {
          pendingAdminChange = null;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/admin/send-email', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              console.log(`[Admin Security] Verification link generated for ${body.recipient || 'beeyondmagic@protonmail.com'}:`);
              console.log(`[Admin Security] Link: ${body.verificationUrl}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      // API to backup incoming inquiries to disk (Fail-Safe against spam dropping)
      server.middlewares.use('/api/inquiries', (req, res) => {
        const backupFile = path.resolve(rootDir, 'src/data/inquiries_backup.json');
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              let list: any[] = [];
              if (fs.existsSync(backupFile)) {
                try {
                  list = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
                } catch {
                  list = [];
                }
              }
              list.unshift(body);
              fs.writeFileSync(backupFile, JSON.stringify(list, null, 2));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          try {
            let list: any[] = [];
            if (fs.existsSync(backupFile)) {
              list = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ inquiries: list }));
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

function noCrossOriginPlugin() {
  return {
    name: 'no-crossorigin',
    transformIndexHtml(html: string) {
      let clean = html.replace(/ crossorigin(?:="[^"]*")?/g, '');
      // Move script tag to end of body so DOM is guaranteed ready before module runs
      const scriptMatch = clean.match(/<script type="module" src="\.\/assets\/index-[^"]+\.js"><\/script>/);
      if (scriptMatch) {
        clean = clean.replace(scriptMatch[0], '');
        clean = clean.replace('</body>', `  ${scriptMatch[0]}\n  </body>`);
      }
      return clean;
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [react(), tailwindcss(), portraitUploadPlugin(), noCrossOriginPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    build: {
      target: 'es2020',
      modulePreload: false,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('pianoSamples')) {
              return 'audio-samples';
            }
          },
        },
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
