// import { AbstractService } from 'sr2020-mm-event-engine';

// const metadata = {
//   actions: ['runModel', 'stopModel'],
//   requests: ['isModelRunning', 'modelSpeed'],
//   emitEvents: ['modelRunningChange', 'modelTick'],
// };
// export class TickerService extends AbstractService {
//   startTime: any;
//   speed: any;
//   mainCycleAbortController: any;

//   constructor(logger) {
//     super(logger);
//     this.setMetadata(metadata);
//     this.startTime = null;
//     this.speed = null;
//     this.mainCycleAbortController = null;
//   }

//   dispose() {
//     this.stopModel();
//   }

//   getIsModelRunning() {
//     return this.mainCycleAbortController && !this.mainCycleAbortController.signal.aborted;
//   }

//   getModelSpeed() {
//     return this.speed;
//   }

//   stopModel() {
//     if (this.mainCycleAbortController) {
//       this.mainCycleAbortController.abort();
//       this.emit('modelRunningChange', {
//         isModelRunning: false,
//       });
//     }
//   }

//   runModel({ speed }) {
//     if (this.getIsModelRunning()) {
//       this.stopModel();
//     }
//     console.log(this);
//     // const start = performance.now();
//     this.mainCycleAbortController = new AbortController();
//     // const animation = {
//     //   enable: true,
//     // };
//     this.speed = speed;
//     this.startTime = performance.now();

//     requestAnimationFrame(function animate2(time) {
//       // console.log(options.key || 'animation triggered');
//       // if (!animation.enable) return;
//       if (this.mainCycleAbortController.signal.aborted) return;

//       // console.log(time - start);
//       // this.activeBots = filterBots(this.activeBots);

//       // if (lastTime !== null) {
//       const newTime = this.startTime + (time - this.startTime) * this.speed;
//       this.emit('modelTick', {
//         // time,
//         time: newTime,
//       });
//       // }
//       // lastTime = time;

//       // // timeFraction from 0 to 1
//       // let timeFraction = (time - start) / options.duration;
//       // if (timeFraction > 1) timeFraction = 1;

//       // // current animation state
//       // const progress = options.timing(timeFraction);

//       // options.draw(progress);

//       // if (timeFraction < 1) {
//       requestAnimationFrame(animate2.bind(this));
//       // } else if (options.loop) {
//       //   start += options.duration;
//       //   requestAnimationFrame(animate2);
//       // }
//     }.bind(this));

//     this.emit('modelRunningChange', {
//       isModelRunning: true,
//       speed: this.speed,
//     });
//     // return animation;
//   }
// }
