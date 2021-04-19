const fs = require('fs-extra');

const pathToStatic = '../sr2020-mm-server/dist/static';
// const pathToStaticTA = `${pathToStatic}/trackAnalysis`;
const pathToClientBuild = '../sr2020-mm-client/build';
// const pathToTrackAnalysis = '../sr2020-mm-track-analysis/build';

async function runDeploy() {
  try {
    const exists = await fs.pathExists(pathToStatic);
    if (exists) {
      console.log('Removing previous deploy');
      await fs.remove(pathToStatic);
    }
    console.log('Copy client to static dir');
    await fs.copy(pathToClientBuild, pathToStatic);
    // console.log('Copy track analysis to static dir');
    // await fs.copy(pathToTrackAnalysis, pathToStaticTA);
    console.log('Deploy finished!');
  } catch (err) {
    console.error(err);
  }
}

runDeploy();
