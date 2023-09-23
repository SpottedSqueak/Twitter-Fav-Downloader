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
export const VXTWITTER_API = 'https://api.vxtwitter.com/';
/**
 * Example JSON:
 * {
    "date": "Wed Oct 05 18:40:30 +0000 2022",
    "date_epoch": 1664995230,
    "hashtags": [],
    "likes": 21664,
    "mediaURLs": [
        "https://video.twimg.com/tweet_video/FeU5fh1XkA0vDAE.mp4",
        "https://pbs.twimg.com/media/FeU5fhPXkCoZXZB.jpg"
    ],
    "media_extended": [
        {
            "altText": "GIF of Laura Dern in Jurassic Park as Dr. Ellie Sattler taking off her sunglasses in shock",
            "duration_millis": 0,
            "size": {
                "height": 206,
                "width": 194
            },
            "thumbnail_url": "https://pbs.twimg.com/tweet_video_thumb/FeU5fh1XkA0vDAE.jpg",
            "type": "video",
            "url": "https://video.twimg.com/tweet_video/FeU5fh1XkA0vDAE.mp4"
        },
        {
            "altText": "picture of Kermit doing a one legged stand on a bicycle seat riding through the park",
            "size": {
                "height": 1007,
                "width": 1179
            },
            "thumbnail_url": "https://pbs.twimg.com/media/FeU5fhPXkCoZXZB.jpg",
            "type": "image",
            "url": "https://pbs.twimg.com/media/FeU5fhPXkCoZXZB.jpg"
        }
    ],
    "replies": 2911,
    "retweets": 3229,
    "text": "whoa, it works\n\nnow everyone can mix GIFs, videos, and images in one Tweet, available on iOS and Android https://t.co/LVVolAQPZi",
    "tweetID": "1577730467436138524",
    "tweetURL": "https://twitter.com/Twitter/status/1577730467436138524",
    "user_name": "Twitter",
    "user_screen_name": "Twitter"
}
 */
