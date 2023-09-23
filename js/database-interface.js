import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs-extra';
import process from 'node:process';
import { DB_LOCATION as dbLocation } from './constants.js';
import { upgradeDatabase } from './database-upgrade.js';

/**
 * @type Database
 */
let db = null;
const defaultColumns = [
  'url',
  'displayname',
  'username',
  'date_posted',
  'text',
  'qrt_url',
  'media_json',
  'is_qrt',
  'is_fav',
];

// General Functions
function genericInsert({ table = 'twitterfaves', columns = defaultColumns, placeholders = defaultColumns.map(() => '?'), data }) {
  const arr = defaultColumns.map(c => data[c] || null);
  return db.run(`
  INSERT OR IGNORE INTO ${table} (${columns})
  VALUES (${placeholders.join(',')})
`, ...arr);
}
export async function close() {
  return db.close();
}

// GET Functions
export async function getTweet(url) {
  if (!url) return null;
  return db.get(`
  SELECT * FROM twitterfaves
  WHERE url = '${url}'
  `);
}
export async function getAllTweets() {
  const allTweets = await db.all(`
  SELECT * FROM twitterfaves
  `);
  // Get all QRTs
  const qrts = allTweets.filter(t => t.is_qrt);
  // Get all Tweets that are not QRTs
  const tweets = allTweets.filter(t => t.is_fav);
  // For each tweet...
  tweets.forEach(t => {
    // ...add in the qrt info
    t.qrt = qrts.find(qrt => qrt.url === t.qrt_url);
  });
  // Return both
  return tweets;
}
export async function tweetExists(url) {
  const exists = await db.get(`
  SELECT EXISTS(SELECT 1 FROM twitterfaves
  WHERE url = '${url}')
  `);
  return exists;
}

export async function getMediaToDownload() {
  return db.all(`
  SELECT url, media_json FROM twitterfaves
  where is_media_downloaded = 0
  `);
}

// POST Functions
export async function saveTweet(data) {
  data.is_fav = true;
  await updateTweet(data);
  data.is_qrt = false;
  return genericInsert({ data });
}

export async function updateTweet(d) {
  const data = [];
  let queryNames = Object.getOwnPropertyNames(d)
  .map(key => {
    data.push(d[key]);
    return `${key} = ?`
  });
  return db.run(`
  UPDATE OR IGNORE twitterfaves
  SET
    ${queryNames.join(',')}
  WHERE url = '${d.url}'
  `);
}

export async function saveQRTweet(data) {
  data.is_qrt = true;
  await updateTweet(data);
  data.is_fav = false;
  return genericInsert({ data });
}

export async function setMediaDownloaded(url) {
  return db.run(`
  UPDATE twitterfaves
  SET
    is_media_downloaded = 1
  WHERE url = '${url}'
  `);
}
/**
 * Creates appropriate database tables.
 * @returns 
 */
export async function init() {
  await fs.ensureFile(dbLocation);
  sqlite3.verbose();
  db = await open({
    filename: dbLocation,
    driver: sqlite3.cached.Database,
  });
  // Upgrade/create tables
  return upgradeDatabase(db)
  .catch(async (e) => {
    console.error(e);
    await db.close();
    process.exit(2);
  });
}
