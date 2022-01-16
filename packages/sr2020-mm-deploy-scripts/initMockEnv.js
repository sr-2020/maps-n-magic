const fs = require('fs-extra');
const path = require('path');

const envFile = '.env';
const envMockedFile = '.env.mocked';

const pathToMainServer = '../sr2020-mm-server';
const pathToMainClient = '../sr2020-mm-client';
const pathToPlayerServer = '../sr2020-mm-player-server';
const pathToPlayerClient = '../sr2020-mm-player-client';


/**
 * 1. Remove .env files in sr2020-mm-server, sr2020-mm-client,
 * sr2020-mm-player-server and sr2020-mm-player-client.
 * 2. Copy .env.mocked to .env in all these places.
 */
async function initMockEnv() {
  try {
    await copyEnv(pathToMainServer);
    await copyEnv(pathToMainClient);
    await copyEnv(pathToPlayerServer);
    await copyEnv(pathToPlayerClient);
  } catch(err) {
    console.error(err);
  }
}

async function copyEnv(pathToDir) {
  const src = path.resolve(pathToDir, envMockedFile);
  const dst = path.resolve(pathToDir, envFile);

  const exists = await fs.pathExists(dst);
  if (exists) {
    console.log(`Removing ${dst}`);
    await fs.remove(dst);
  }
  console.log(`Copy src ${src} to dst ${dst}`);
  await fs.copy(src, dst);
}

initMockEnv();