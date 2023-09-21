import * as db from './js/database-interface.js';
import { setupBrowser } from './js/setup-browsers.js';
import { init as initUtils } from './js/utils.js';

import { join } from 'node:path';

async function init() {
  await db.init();
  const { page, browser } = await setupBrowser();
  await initUtils(page);
}

init();
