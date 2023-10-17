import * as db from './database-interface.js';
import * as sel from './constants.js';
import * as cheerio from 'cheerio';
import got from 'got';
import * as cliProgress from 'cli-progress';
import fs from 'fs-extra';
import { join } from 'node:path';
import { Page } from 'puppeteer-core';
import { waitFor } from './utils.js';
import random from 'random';

const scrollHeight = 1000;
let headers = {
  headers: {
    cookies: '',
  }
};
const dlOptions = {
  mode: fs.constants.S_IRWXO,
};

let pBar = null;
let mediaTotal = 0;
let mediaIndex = 0;
let isDownloading = false;
// Default current account
let account = '';

async function getTweetDataViaAPI(url, defaultData) {
  const apiUrl = `${sel.VXTWITTER_API}${url.split('.com/')[1]}`;
  const json = await got(apiUrl).json().catch((e) => {
    console.error(e);
    return false;
  });
  if (json) {
    return {
      url: json.tweetURL,
      displayname: json.user_screen_name,
      username: json.user_name,
      date_posted: json.date,
      text: json.text,
      media_json: JSON.stringify(json.mediaURLs),
      qrt_url: qrtURL,
    };
  }
  return defaultData;
}

function updateProgressBar(index, total) {
  // Create bar if not already active
  if (!pBar) {
    pBar = new cliProgress.SingleBar({
      hideCursor: true,
      format: ' {bar} | {filename} | {value}/{total}',
    }, cliProgress.Presets.shades_grey);
    pBar.start(total, index);
  } else {
    // Update totals
    pBar.update(index);
    if (total) pBar.setTotal(total);
  }
}
async function initiateMediaDownloads() {
  // If already downloading something, leave it be
  if (isDownloading) return;
  isDownloading = true;
  await fs.ensureDir(sel.DOWNLOAD_DIR, dlOptions);
  // Get new media to download
  const allMedia = await db.getMediaToDownload();
  if (!allMedia.length) return isDownloading = false;
  // Update total if new amount is more than previous
  mediaTotal = allMedia.length > mediaTotal ? allMedia.length : mediaTotal;
  // Update progress bar
  updateProgressBar(mediaIndex, mediaTotal);
  const { url, media_json } = allMedia[0];
  const mediaArr = JSON.parse(media_json);
  let hasFailed = false;
  // Loop through media to save
  for (const m of mediaArr) {
    const content_name = m.split('/').pop();
    const fileLocation = join(sel.DOWNLOAD_DIR, content_name);
      // save to DL folder
      await new Promise((resolve, reject) => {
        const dlStream = got.stream(m, headers);
        const fStream = fs.createWriteStream(fileLocation, { flags: 'w+', mode: fs.constants.S_IRWXO });
        dlStream.on('error', (error) => {
          console.error(`Download failed: ${error.message} for ${content_name}`);
        });
        fStream.on('error', (error) => {
          console.error(`Could not write file '${content_name}' to system: ${error.message}`);
          reject();
        })
        .on('finish', () => {
          resolve();
        });
        dlStream.pipe(fStream);
      }).catch((e) => {
        fs.removeSync(fileLocation);
        hasFailed = true;
      });
      if (hasFailed) break;
  }
  if (!hasFailed) {
    await db.setMediaDownloaded(url);
  }
  isDownloading = false;
  return initiateMediaDownloads();
}

async function getQRTweetData(url) {
  let data = {};
  if (url) {
    data = await getTweetDataViaAPI(url);
    if (!data) return data;
    // Save tweet data
    await db.saveQRTweet(data);
  }
  return data;
}

async function getTweetData(tweet) {
  let data;
  const html = await tweet.evaluate((el) => el.innerHTML);
  const $ = cheerio.load(html);
  // Check if tweet is already saved
  const url = $(sel.TWEET_URL).first().attr('href');
  if (url && !!db.tweetExists(url)) {
    // Gather data
    const tweetLinks = $(sel.TWEET_LINKS).first().attr('href') || '';
    data = {
      url,
      displayname: $(sel.TWEET_DISPLAYNAME).first().text(),
      username: $(sel.TWEET_USERNAME).first().text(),
      date_posted: $(sel.TWEET_DATE).first().attr('datetime'),
      text: `${$(sel.TWEET_TEXT).first().text()} ${tweetLinks}`,
    }
    // Check media
    const images = Array.from($('img', sel.TWEET_MEDIA_SECTION));
    const videos = Array.from($('video', sel.TWEET_MEDIA_SECTION)).map(v => v.src);
    let media = images.map(m => m.src.replace('=small', '=large'));
    // Check if there's a qrt
    const hasQRT = !!$(sel.HAS_QRT).length;
    // If there's a QRT, just use the API, it's easier
    if (hasQRT) {
      data.media_json = JSON.stringify(media);
      data = await getTweetDataViaAPI(url, data);
      if (data) {
        // Get QRT Info
        const qrtData = await getQRTweetData(data.qrt_url);
        // Correct QRT URL in original data
        data.qrt_url = qrt.url;
      }
    }
    // If video exists and it's not mp4 (not easily downloaded), make api call
    else if (videos && !videos.every(v => /mp4$/i.test(v))) {
      data.media_json = JSON.stringify(media);
      data = await getTweetDataViaAPI(url, data);
      media = JSON.parse(data.media_json);
    } else {
      media.push(videos);
      data.media_json = JSON.stringify(media);
    }
    // Add current account name
    data.account = account;
    // Save and start downloads
    db.saveTweet(data);
    initiateMediaDownloads();
  }
}

function parseCookies(cookies) {
  const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  headers.cookies = cookieString;
}
/**
 * 
 * @param {Page} page 
 */
export async function init(page) {
  let scrollCount = 0;
  let oldScrollHeight = 0;
  let newScrollHeight = 0;
  parseCookies(await page.cookies());
  // Get account name
  account = await page.$(sel.ACCOUNT_NAME)?.textContent?.split('@')[0];
  // Start looping through favorites, scrolling down bit by bit
  while (scrollCount === 0 || newScrollHeight !== oldScrollHeight) {
    await waitFor(random.int(1000, 4000));
    // Get all current tweets
    const tweets = await page.$$(sel.TWEET_SELECTOR);
    for (const tweet of tweets) {
      await getTweetData(tweet);
    }
    // Loop
    scrollCount++;
    oldScrollHeight = await page.evaluate(sel.SCROLL_HEIGHT);
    await page.evaluate(`window.scrollTo(0, ${scrollHeight*scrollCount})`);
    newScrollHeight = await page.evaluate(sel.SCROLL_HEIGHT);
  }
}
