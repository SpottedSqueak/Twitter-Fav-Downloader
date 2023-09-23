import * as db from './database-interface.js';
import * as selector from './constants.js';
import * as cheerio from 'cheerio';
import got from 'got';

import { join } from 'node:path';
import { Page } from 'puppeteer-core';

const scrollHeight = 1000;
let headers = {
  headers: {
    cookies: '',
  }
};
let currMediaToDownload = [];

async function getTweetDataViaAPI(url, defaultData) {
  const apiUrl = `${selector.VXTWITTER_API}${url.split('.com/')[1]}`;
  const json = await got(apiUrl).json().catch((e) => {
    console.error(e);
    return false;
  });
  if (json) {
    return {
      url,
      displayname: json.user_screen_name,
      username: json.user_name,
      date_posted: json.date,
      text: json.text,
      media_json: JSON.stringify(json.mediaURLs),
    };
  }
  return defaultData;
}

async function downloadMedia() {
  // If already downloading something, leave it be
  if (currMediaToDownload.length) return;
  // Get new media to download
  // Loop through media to save
    // save to DL folder
  
  // Mark as complete when done
  // Call again to loop

}

async function getQRTweetData(url) {
  let data = {};
  if (url) {
    data = await getTweetDataViaAPI(url, data);
    // Save tweet data
    await db.saveQRTweet(data);
  }
}

async function getTweetData(tweet) {
  let data;
  const html = await tweet.evaluate((el) => el.innerHTML);
  const $ = cheerio.load(html);
  // Check if tweet is already saved
  const url = $(selector.TWEET_URL).first().attr('href');
  if (url && !!db.tweetExists(url)) {
    // Gather data
    data = {
      url,
      displayname: $(selector.TWEET_DISPLAYNAME).first().text(),
      username: $(selector.TWEET_USERNAME).first().text(),
      date_posted: $(selector.TWEET_DATE).first().attr('datetime'),
      text: $(selector.TWEET_TEXT).first().text(),
    }
    // Check media
    const images = Array.from($('img', selector.TWEET_MEDIA_SECTION));
    const video = $('video', selector.TWEET_MEDIA_SECTION).attr('src');
    let media = images.map(m => m.src.replace('=small', '=large'));
    // If video exists and it's not mp4, make api call
    if (video && !/mp4$/i.test(video)) {
      data.media_json = JSON.stringify(media);
      data = await getTweetDataViaAPI(url, data);
      media = JSON.parse(data.media_json);
    } else {
      if (video) media.push(video);
      data.media_json = JSON.stringify(media);
    }
    await downloadMedia(media);
    // Get QRT Info
    await getQRTweetData();
    // Save Tweet
    db.saveTweet(data); 
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
  // Start looping through favorites, scrolling down bit by bit
  while (scrollCount === 0 || newScrollHeight !== oldScrollHeight) {
    // Get all current tweets
    const tweets = await page.$$(selector.TWEET_SELECTOR);
    for (const tweet of tweets) {
      await getTweetData(tweet);
    }
    // Loop
    scrollCount++;
    oldScrollHeight = await page.evaluate(selector.SCROLL_HEIGHT);
    await page.evaluate(`window.scrollTo(0, ${scrollHeight*scrollCount})`);
    newScrollHeight = await page.evaluate(selector.SCROLL_HEIGHT);
  }
}