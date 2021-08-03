// import * as R from 'ramda';

// import { AbstractService } from '../core/AbstractService';

// import { defaultManaOceanSettings } from '../api/constants';

// export class ManaOceanSettingsService extends AbstractService {
//   metadata = {
//     actions: [
//       'postManaOceanSettings',
//       'postManaOceanSettingsConfirmed',
//       'setManaOceanSettings',
//     ],
//     requests: [
//       'manaOceanSettings',
//     ],
//     emitEvents: [
//       'postManaOceanSettings',
//       'postManaOceanSettingsRequested',
//       'manaOceanSettingsChanged',
//     ],
//     listenEvents: [],
//   };

//   constructor() {
//     super();
//     this.manaOceanSettings = R.clone(defaultManaOceanSettings);
//   }

//   setData({ manaOceanSettings } = {}) {
//     this.manaOceanSettings = manaOceanSettings || R.clone(defaultManaOceanSettings);
//     // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
//   }

//   getData() {
//     return {
//       manaOceanSettings: this.getManaOceanSettings(),
//     };
//   }

//   getManaOceanSettings() {
//     return R.clone(this.manaOceanSettings);
//   }

//   setManaOceanSettings({ manaOceanSettings }) {
//     const areEqual = R.equals(this.manaOceanSettings, manaOceanSettings);
//     this.setData({ manaOceanSettings });
//     if (!areEqual) {
//       this.emit('manaOceanSettingsChanged', {
//         type: 'manaOceanSettingsChanged',
//         manaOceanSettings,
//       });
//     }
//   }

//   postManaOceanSettings = (action) => {
//     this.emit('postManaOceanSettingsRequested', action);
//   }

//   postManaOceanSettingsConfirmed({ manaOceanSettings }) {
//     this.manaOceanSettings = R.clone(manaOceanSettings);
//     // console.log('postBeaconRecord');
//     this.emit('postManaOceanSettings', { manaOceanSettings });
//     this.emit('manaOceanSettingsChanged', {
//       type: 'manaOceanSettingsChanged',
//       manaOceanSettings,
//     });
//   }
// }
