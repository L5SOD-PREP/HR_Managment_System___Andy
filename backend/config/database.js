import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db = null;
let ready = null;

function getStorePath() {
  return path.join(__dirname, '..', process.env.DB_PATH || './db/hrms.db');
}

async function connect() {
  if (db) return db;
  const SQL = await initSqlJs();
  const storePath = getStorePath();
  if (fs.existsSync(storePath)) {
    const buffer = fs.readFileSync(storePath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA foreign_keys = ON');
  return db;
}

async function save() {
  if (!db) return;
  const data = db.export();
  const storePath = getStorePath();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, Buffer.from(data));
}

async function init() {
  if (ready) return ready;
  ready = (async () => {
    await connect();
  })();
  return ready;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call init() first.');
  return db;
}

function all(sql, params = []) {
  const stmt = getDb().prepare(sql);
  try {
    if (params.length > 0) stmt.bind(params);
    const results = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    return results;
  } finally {
    stmt.free();
  }
}

function get(sql, params = []) {
  const stmt = getDb().prepare(sql);
  try {
    if (params.length > 0) stmt.bind(params);
    if (stmt.step()) return stmt.getAsObject();
    return null;
  } finally {
    stmt.free();
  }
}

function run(sql, params = []) {
  const stmt = getDb().prepare(sql);
  try {
    if (params.length > 0) stmt.bind(params);
    stmt.step();
  } finally {
    stmt.free();
  }
}

export { init, getDb, all, get, run, save };
