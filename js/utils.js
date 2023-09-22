import * as cheerio from 'cheerio';
import got from 'got';
import { dirname, join, } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import * as db from './database-interface.js';
import util from 'util';
import { exitCode, default as process } from 'node:process';
import { RELEASE_CHECK, LOG_DIR as logDir } from './constants.js';

export const stop = {
  should: false,
  get now() {
    return this.should || !!exitCode;
  },
  set now(shouldStop) {
    this.should = shouldStop;
  },
  reset() {
    this.should = false;
  }
};

// Get the main folder directory name
export const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../');
let page = null;
let version = '';

export function getVersion() {
  if (!version) {
    version = JSON.parse(fs.readFileSync(join(__dirname, './package.json'), 'utf8'))?.version;
  }
  return version;
}

/**
 * Creates a Promise from a non-async function. Useful for error catching
 * outside of try/catch blocks.
 * 
 * @param {Function} method 
 * @returns 
 */
export function getPromise(method) {
  return new Promise((resolve, reject) => {
    const results = method();
    (results) ? resolve(results) : reject();
  });
}
// Create debug log
const logFileName = join(logDir, `debug-${Date.now()}.log`);

function setup() {
  fs.ensureFileSync(logFileName);
  const logFile = fs.createWriteStream(logFileName, { flags : 'w' });
  const hooks = ['log', 'error', 'info', 'warn', 'debug'];
  const defaultHooks = {};
  hooks.forEach((hook) => {
    defaultHooks[hook] = console[hook];
    console[hook] = function () {
      logFile.write(`[${hook}] ${util.format.apply(null, arguments)}\n`);
      defaultHooks[hook](util.format.apply(null, arguments));
    }
  });
  process.on('uncaughtException', async function(err) {
    //logFile.write(`${err.stack}`);
    stop.now = true;
    console.error(err);
    await db.close();
    process.exit(2);
  });
  // Clean up log files
  fs.readdir(logDir, (_err, files) => {
    files.reverse().slice(5).forEach(val => {
      fs.remove(join(logDir, val));
    });
  });
}

/**
 * Creates a Promise that auto-resolves after the specified duration.
 * @param {Number} t 
 * @returns A timed Promise
 */
export async function waitFor(t = 1000) {
  return new Promise(r => setTimeout(r, t));
}

/**
 * Checks Github for the latest version.
 * @returns {Object}
 */
export async function releaseCheck() {
  const data = { current: getVersion() };
  let $ = await getHTML(RELEASE_CHECK, false).catch(() => false);
  if ($) {
    const latest = $('a.Link--primary').first().text().replace('v', '');
    data.latest = latest;
  }
  return data;
}
export async function urlExists(url, sendHeaders = true) {
  let headers = sendHeaders ? faRequestHeaders : {};
  headers = {...headers, method: 'HEAD', timeout: { response: 3000 }};
  return got(url, headers).then(() => true).catch(() => false);
}

/**
 * Binds the given Page object for future log messages.
 * @param {Puppeteer.Page} newPage 
 */
export async function init(newPage) {
  page = newPage;
}

setup();
