const fs = require('fs-extra');

const pathToMainStatic = '../sr2020-mm-server/dist/static';
// const pathToStaticTA = `${pathToStatic}/trackAnalysis`;
const pathToMainClientBuild = '../sr2020-mm-client/build';
// const pathToTrackAnalysis = '../sr2020-mm-track-analysis/build';
const pathToPlayerStatic =      '../sr2020-mm-player-server/dist/static';
const pathToPlayerClientBuild = '../sr2020-mm-player-client/build';

async function runDeploy() {
  try {
    // main client deploy
    const exists = await fs.pathExists(pathToMainStatic);
    if (exists) {
      console.log('Removing previous main deploy');
      await fs.remove(pathToMainStatic);
    }
    console.log('Copy main client to static dir');
    await fs.copy(pathToMainClientBuild, pathToMainStatic);

    // player client deploy
    const exists2 = await fs.pathExists(pathToPlayerStatic);
    if (exists2) {
      console.log('Removing previous player deploy');
      await fs.remove(pathToPlayerStatic);
    }
    console.log('Copy player client to static dir');
    await fs.copy(pathToPlayerClientBuild, pathToPlayerStatic);
    // console.log('Copy track analysis to static dir');
    // await fs.copy(pathToTrackAnalysis, pathToStaticTA);
    console.log('Deploy finished!');
  } catch (err) {
    console.error(err);
  }
}

runDeploy();
