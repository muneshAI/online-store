const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
const SESSION_COOKIE = 'codex_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_DIR = path.join(__dirname, 'storage');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');
const DB_FILE = path.join(STORAGE_DIR, 'ideas-db.json');

const defaultUser = {
  id: 1,
  name: 'Munesh Builder',
  email: process.env.DEMO_EMAIL || 'admin@munesh.ai',
  password: process.env.DEMO_PASSWORD || 'codex123',
};

const sessions = new Map();

function ensureDatabase() {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  if (!fs.existsSync(DB_FILE)) {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    const ideas = seed.ideas.map((idea) => ({
      ...idea,
      status: idea.priority === 'Now' ? 'Ready' : idea.priority === 'Next' ? 'Planned' : 'Backlog',
      owner: idea.id === 101 ? 'Munesh AI' : '',
      notes: idea.id === 101 ? 'Use this as the umbrella product that packages the strongest ideas.' : '',
      updatedAt: new Date().toISOString(),
    }));

    fs.writeFileSync(DB_FILE, JSON.stringify({ ideas, featuredIds: seed.featuredIds }, null, 2));
  }
}

function readDatabase() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(';').map((part) => {
      const [key, ...rest] = part.trim().split('=');
      return [key, decodeURIComponent(rest.join('='))];
    })
  );
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
  };

  res.writeHead(200, {
    'Content-Type': types[ext] || 'application/octet-stream',
  });
  fs.createReadStream(filePath).pipe(res);
}

function requireAuth(req, res) {
  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, { error: 'Authentication required' });
    return null;
  }
  return session;
}

function sanitizeIdeaUpdate(body) {
  const allowedStatus = new Set(['Ready', 'Planned', 'Building', 'Backlog', 'Launched']);
  const next = {};

  if (typeof body.priority === 'string' && ['Now', 'Next', 'Later'].includes(body.priority)) {
    next.priority = body.priority;
  }
  if (typeof body.status === 'string' && allowedStatus.has(body.status)) {
    next.status = body.status;
  }
  if (typeof body.owner === 'string') {
    next.owner = body.owner.trim().slice(0, 80);
  }
  if (typeof body.notes === 'string') {
    next.notes = body.notes.trim().slice(0, 400);
  }

  return next;
}

async function handleApi(req, res, pathname) {
  if (req.method === 'POST' && pathname === '/api/login') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (email !== defaultUser.email.toLowerCase() || password !== defaultUser.password) {
      sendJson(res, 401, { error: 'Invalid demo credentials' });
      return;
    }

    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      user: { id: defaultUser.id, name: defaultUser.name, email: defaultUser.email },
      expiresAt: Date.now() + SESSION_TTL_MS,
    });

    sendJson(
      res,
      200,
      { user: { id: defaultUser.id, name: defaultUser.name, email: defaultUser.email } },
      {
        'Set-Cookie': `${SESSION_COOKIE}=${sessionId}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`,
      }
    );
    return;
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    const session = getSession(req);
    if (session) {
      for (const [id, entry] of sessions.entries()) {
        if (entry === session) {
          sessions.delete(id);
          break;
        }
      }
    }

    sendJson(res, 200, { ok: true }, {
      'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/session') {
    const session = getSession(req);
    sendJson(res, 200, { authenticated: Boolean(session), user: session?.user || null });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/ideas') {
    const session = requireAuth(req, res);
    if (!session) {
      return;
    }

    const db = readDatabase();
    sendJson(res, 200, db);
    return;
  }

  if (req.method === 'PATCH' && pathname.startsWith('/api/ideas/')) {
    const session = requireAuth(req, res);
    if (!session) {
      return;
    }

    const id = Number(pathname.split('/').pop());
    const body = await parseBody(req);
    const changes = sanitizeIdeaUpdate(body);
    const db = readDatabase();
    const idea = db.ideas.find((entry) => entry.id === id);

    if (!idea) {
      sendJson(res, 404, { error: 'Idea not found' });
      return;
    }

    Object.assign(idea, changes, { updatedAt: new Date().toISOString() });
    writeDatabase(db);
    sendJson(res, 200, { idea });
    return;
  }

  sendJson(res, 404, { error: 'API route not found' });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname);
      return;
    }

    const filePath = pathname === '/'
      ? path.join(PUBLIC_DIR, 'index.html')
      : path.join(PUBLIC_DIR, pathname.replace(/^\/+/, ''));

    if (!filePath.startsWith(PUBLIC_DIR)) {
      sendJson(res, 403, { error: 'Forbidden' });
      return;
    }

    sendFile(res, filePath);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unexpected server error' });
  }
});

ensureDatabase();
server.listen(PORT, HOST, () => {
  console.log(`Codex Ideas OS running on http://${HOST}:${PORT}`);
  console.log(`Demo login: ${defaultUser.email} / ${defaultUser.password}`);
});
