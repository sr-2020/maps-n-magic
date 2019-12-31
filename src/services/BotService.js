// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import EventEmitter from 'events';

// 111100 meters in lat
// 63995 meters in lng

const deg2meters = ({ lat, lng }) => ({ lat: lat * 111100, lng: lng * 63995 });
const meters2deg = ({ lat, lng }) => ({ lat: lat / 111100, lng: lng / 63995 });

const dist = (pt1, pt2) => Math.sqrt((pt1.lat - pt2.lat) ** 2 + (pt1.lng - pt2.lng) ** 2);

// 1 deg - 63995 meters
// X deg - 5 meters

// 63995/1 = 5/X
// x = 5/63995 =

export class Bot {
  speed = 10; // meter / sec

  path = [
    {
      lat: 54.9278242,
      lng: 36.8724486,
    },
    {
      lat: 54.92773638342276,
      lng: 36.872947311826174,
    },
    {
      lat: 54.92748710184526,
      lng: 36.87260627746583,
    },
    {
      lat: 54.927576493162945,
      lng: 36.871930360794074,
    },
    {
      lat: 54.927752192760124,
      lng: 36.87176942825318,
    },
  ];
}

export class ActiveBot {
  constructor(name, bot) {
    this.name = name;
    this.bot = bot;
    this.pathIndex = 2;
    [this.curPosition, this.nextPoint] = bot.path;
    this.curPosition = deg2meters(this.curPosition);
    this.nextPoint = deg2meters(this.nextPoint);

    // this.direction = {
    //   lat: this.nextPoint.lat - this.prevPoint.lat,
    //   lng: this.nextPoint.lng - this.prevPoint.lng,
    // };

    // this.curPosition = { ...this.prevPoint };
    // this.dist = dist(this.prevPoint, this.nextPoint);
    console.log(this.curPosition, this.nextPoint);
    this.speed = bot.speed;
  }

  getName() {
    return this.name;
  }

  getCutPosition() {
    return meters2deg(this.curPosition);
  }

  _hasNextPoint() {
    return !!this.bot.path[this.pathIndex];
  }

  _getNextPoint() {
    console.log('this.pathIndex', this.pathIndex);
    const nextPoint = deg2meters(this.bot.path[this.pathIndex]);
    this.pathIndex++;
    return nextPoint;
  }

  hasNext() {
    // return true;
    return this.nextPoint !== null;
  }

  next(curTime) {
    if (!this.lastTime) {
      this.lastTime = curTime;
      return;
    }
    let walkedDistance = ((curTime - this.lastTime) / 1000) * this.speed;
    let restOfDistance = dist(this.curPosition, this.nextPoint);

    while (walkedDistance > restOfDistance) {
      this.curPosition = { ...this.nextPoint };
      if (this._hasNextPoint()) {
        this.nextPoint = this._getNextPoint();
        walkedDistance -= restOfDistance;
        restOfDistance = dist(this.curPosition, this.nextPoint);
      } else {
        this.nextPoint = null;
        return;
      }
    }

    const walkedPart = walkedDistance / restOfDistance;
    this.curPosition = {
      lat: (this.nextPoint.lat - this.curPosition.lat) * walkedPart + this.curPosition.lat,
      lng: (this.nextPoint.lng - this.curPosition.lng) * walkedPart + this.curPosition.lng,
    };
    console.log('curPosition', this.curPosition);

    this.lastTime = curTime;
  }

  // makeStep() {

  // }
}

export class BotService extends EventEmitter {
  constructor() {
    super();
    this.bots = {};
    this.activeBots = [];
  }

  getActiveBots() {
    return this.activeBots;
  }

  runMainCycle(options) {
    console.log(this);
    const start = performance.now();
    this.abortController = new AbortController();
    // const animation = {
    //   enable: true,
    // };

    const filterBots = R.pipe(R.toPairs, R.filter(([, bot]) => bot.hasNext()), R.fromPairs);

    requestAnimationFrame(function animate2(time) {
      // console.log(options.key || 'animation triggered');
      // if (!animation.enable) return;
      if (this.abortController.signal.aborted) return;

      // console.log(time - start);


      // this.activeBots = filterBots(this.activeBots);
      this.activeBots = this.activeBots.filter((bot) => bot.hasNext());
      this.activeBots.forEach((bot) => bot.next(time));
      // R.values(this.activeBots).forEach((bot) => bot.next(time));
      this.emit('botUpdate');

      if (R.isEmpty(this.activeBots)) {
        this.runBot('bot1');
      }

      // // timeFraction from 0 to 1
      // let timeFraction = (time - start) / options.duration;
      // if (timeFraction > 1) timeFraction = 1;

      // // current animation state
      // const progress = options.timing(timeFraction);

      // options.draw(progress);

      // if (timeFraction < 1) {
      requestAnimationFrame(animate2.bind(this));
      // } else if (options.loop) {
      //   start += options.duration;
      //   requestAnimationFrame(animate2);
      // }
    }.bind(this));
    // return animation;
  }

  dispose() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  putBot(name, bot) {
    this.bots[name] = bot;
  }

  getBot(name) {
    return this.bots[name];
  }

  runBot(name) {
    // this.activeBots[name] = new ActiveBot(name, this.bots[name]);
    this.activeBots.push(new ActiveBot(name, this.bots[name]));
  }
}


// const botService = new BotService();

// botService.putBot('bot1', new Bot());
// botService.runBot('bot1');

// botService.runMainCycle();

// setTimeout(() => botService.dispose(), 3000);
