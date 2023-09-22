export const TWITTER_DEFAULT_BASE = 'https://www.twitter.com';
export const TWITTER_HOME = `${TWITTER_DEFAULT_BASE}/home`;
export const TWITTER_FAVORITES = `${TWITTER_DEFAULT_BASE}/favorites`;

export const DEFAULT_BROWSER_PARAMS = [
  '--app=data:text/html, "Loading..."',
  '--window-size=1280,720',
  '--disable-features=IsolateOrigins',
  '--disable-features=BlockInsecurePrivateNetworkRequests',
  '--allow-file-access-from-files',
  '--disable-extensions',
  '--disable-automation',
];
export const IGNORE_DEFAULT_PARAMS = [
  //'--enable-automation',
  //'--disable-site-isolation-trials',
  //'--disable-blink-features=AutomationControlled',
  //`--enable-blink-features=IdleDetection`
];

export const INTERNAL_DIR_BASE = './twitter_fav_downloader'
export const BROWSER_DIR = `${INTERNAL_DIR_BASE}/browser_profiles/`;
export const DOWNLOADED_BROWSER_DIR = `${INTERNAL_DIR_BASE}/downloaded_browser`;
export const LOG_DIR = `${INTERNAL_DIR_BASE}/logs`;
export const DOWNLOAD_DIR = `${INTERNAL_DIR_BASE}/downloaded_content`;
export const DOWNLOAD_ICON_DIR = `${INTERNAL_DIR_BASE}/downloaded_content/icons`;
export const DB_LOCATION = `${INTERNAL_DIR_BASE}/databases/defaultDB.db`;
export const RELEASE_CHECK = 'https://github.com/SpottedSqueak/Twitter-Fav-Downloader/releases';

// Query Selectors
export const TWEET_SELECTOR = '[aria-label^="Timeline:"] article';
export const TWEET_ICON = '[data-test-id="Tweet-User-Avatar"]';
export const TWEET_DISPLAYNAME = '[data-test-id="User-Name"] > div:first-child';
export const TWEET_USERNAME = '[data-test-id="User-Name"] > div:nth-child(2) > div > div:first-child';
export const TWEET_DATE = '[data-test-id="User-Name"] > div:nth-child(2) > div > div:nth-child(3) time';
export const TWEET_URL = '[data-test-id="User-Name"] > div:nth-child(2) > div > div:nth-child(3) a';
export const TWEET_TEXT = '[data-test-id="tweetText"]';
export const TWEET_MEDIA_SECTION = 'div[aria-labelledby] > div:first-child';
export const TWEET_QRT_SECTION = 'div[aria-labelledby] > div:nth-child(2)';
export const TWEET_MEDIA = '[data-test-id="tweetPhoto"]';

// JS
export const SCROLL_HEIGHT = 'document.documentElement.scrollTop';
