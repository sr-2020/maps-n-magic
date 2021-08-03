export {};
// import { 
//   AbstractService,
//   Metadata, 
//   GameModel, 
//   GMLogger,
//   WipeManaOceanEffects,
//   AddManaEffect,
//   RemoveManaEffect,
//   ManaOceanStubEvents
// } from 'sr2020-mm-event-engine';

// const metadata: Metadata = {
//   actions: [
//     'wipeManaOceanEffects',
//     'removeManaEffect',
//     'addManaEffect',
//   ],
//   requests: [],
//   emitEvents: [
//     'wipeManaOceanEffects',
//     'removeManaEffect',
//     'addManaEffect',
//   ],
//   needActions: [],
//   needRequests: [],
//   listenEvents: [],
// };
// export class ManaOceanStubService extends AbstractService<ManaOceanStubEvents> {

//   constructor(gameModel: GameModel, logger: GMLogger) {
//     super(gameModel, logger);
//     this.setMetadata(metadata);
//   }
  
//   wipeManaOceanEffects(action: WipeManaOceanEffects) {
//     this.emit2({
//       type: 'wipeManaOceanEffects',
//     });
//   }

//   removeManaEffect(data: RemoveManaEffect) {
//     this.emit2({
//       ...data,
//     });
//   }

//   addManaEffect(data: AddManaEffect) {
//     this.emit2({
//       ...data,
//     });
//   }
// }
