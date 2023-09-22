import * as db from './database-interface.js';
import * as selector from './constants.js';
import * as cheerio from 'cheerio';

import { join } from 'node:path';
import { Page } from 'puppeteer-core';

const scrollHeight = 1000;

async function getTweetData(tweet) {
  let data;
  const html = await tweet.evaluate((el) => el.innerHTML);
  const $ = cheerio.load(html);
  // Check if tweet is already saved
  const url = $(selector.TWEET_URL).attr('href');
  if (url && !!db.tweetExists(url)) {
    // Gather data
    data = {
      url,
      displayname: $(selector.TWEET_DISPLAYNAME).first().text(),
      username: $(selector.TWEET_USERNAME).first().text(),
      date_posted: $(selector.TWEET_DATE).first().attr('datetime'),
      text: $(selector.TWEET_TEXT).first().text(),
    }
    // Get QRT Info
    // Get Media
  }
  return data;
}
/**
 * 
 * @param {Page} page 
 */
export async function init(page) {
  let scrollCount = 0;
  let oldScrollHeight = 0;
  let newScrollHeight = 0;
  // Start looping through favorites, scrolling down bit by bit
  while (scrollCount === 0 || newScrollHeight !== oldScrollHeight) {
    // Get all current tweets
    const tweets = await page.$$(selector.TWEET_SELECTOR);
    page.setdow
    for (const tweet of tweets) {
      const data = getTweetData(tweet);
      // Save to database
      // Save media files
    }
    // Loop
    scrollCount++;
    oldScrollHeight = await page.evaluate(selector.SCROLL_HEIGHT);
    await page.evaluate(`window.scrollTo(0, ${scrollHeight*scrollCount})`);
    newScrollHeight = await page.evaluate(selector.SCROLL_HEIGHT);
  }
}