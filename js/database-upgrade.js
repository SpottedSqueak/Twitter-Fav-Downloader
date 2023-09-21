/**
 * Used for making future upgrades/updates to the database, to enforce
 * a schema.
 * @returns If an error occurred or not. If yes, we need to exit!
 */
export async function upgradeDatabase(db) {
  let { user_version:version = 0 } = await db.get('PRAGMA user_version');
  switch(version) {
    case 0:
    case 1:
      await db.exec(`
      CREATE TABLE IF NOT EXISTS twitterfaves (
        url TEXT UNIQUE ON CONFLICT IGNORE,
        displayname TEXT,
        username TEXT,
        date_posted TEXT,
        text TEXT,
        qrt_url TEXT,
        media_json TEXT,
        is_fav INTEGER DEFAULT 1,
        is_qrt INTEGER DEFAULT 0
      )`);
      version = 2;
    default:
      await db.exec(`VACUUM`);
      await db.exec(`PRAGMA user_version = ${version}`);
      console.log(`Database now at: v${version}`);
  }
}