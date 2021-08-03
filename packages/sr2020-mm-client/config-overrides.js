const { override, babelInclude } = require('customize-cra');
const path = require('path');

module.exports = override(
  babelInclude([
    path.resolve('src'),
    // path.resolve('../sr2020-mm-client-core'),
    // path.resolve('../sr2020-mm-data'),
    // path.resolve('../sr2020-mm-event-engine'),
    // path.resolve('../sr2020-mm-client-event-engine'),
    path.resolve('../sr2020-mm-client-core/src'),
    path.resolve('../sr2020-mm-data/dist'),
    path.resolve('../sr2020-mm-event-engine/dist'),
    path.resolve('../sr2020-mm-client-event-engine/dist'),
  ]),
);
