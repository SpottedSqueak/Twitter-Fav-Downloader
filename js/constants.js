export const TWITTER_DEFAULT_BASE = 'https://www.twitter.com';
export const TWITTER_FAVORITES = ''
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
export const BROWSER_DIR = './twitter_fav_downloader/browser_profiles/';
export const DOWNLOADED_BROWSER_DIR = './twitter_fav_downloader/downloaded_browser';
export const LOG_DIR = './twitter_fav_downloader/logs';
export const DOWNLOAD_DIR = './twitter_fav_downloader/downloaded_content';
export const DOWNLOAD_ICON_DIR = './twitter_fav_downloader/downloaded_content/icons';
export const DB_LOCATION = './twitter_fav_downloader/databases/defaultDB.db';
export const RELEASE_CHECK = 'https://github.com/SpottedSqueak/FA-Gallery-Downloader/releases';
