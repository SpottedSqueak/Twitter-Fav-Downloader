import { TWITTER_FAVORITES, TWITTER_HOME } from './js/constants.js';
import * as db from './js/database-interface.js';
import { setupBrowser } from './js/setup-browsers.js';
import { init as initUtils } from './js/utils.js';
import * as scrapeData from './js/scrape-data.js';

async function init() {
  await db.init();
  const { page } = await setupBrowser();
  await initUtils(page);

  page.on('domcontentloaded', async() => {

  });
  // Login to Twitter logic
  await Promise.all([
    page.goto(TWITTER_HOME),
    page.waitForSelector('[aria-label="Profile"]'),
  ]);
  // When logged in, go to favorites
  await Promise.all([
    page.goto(TWITTER_FAVORITES),
    page.waitForSelector('[aria-label^="Timeline:"]'),
  ]);
  // Start data scraping
  scrapeData.init(page);
}

init();
