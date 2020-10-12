import { deg2meters, meters2deg } from '../../utils';

const dist = (pt1, pt2) => Math.sqrt((pt1.lat - pt2.lat) ** 2 + (pt1.lng - pt2.lng) ** 2);

// 1 deg - 63995 meters
// X deg - 5 meters

// 63995/1 = 5/X
// x = 5/63995 =

// state sequence
// walk <-> wait -> finish

export class ActiveBot {
  constructor(name, bot) {
    this.name = name;
    this.bot = bot;
    this.pathIndex = 2;
    [this.curPosition, this.nextPoint] = bot.path;
    this.curPosition = deg2meters(this.curPosition);
    this.nextPoint = deg2meters(this.nextPoint);
    // this.prevPoint = deg2meters(this.prevPoint);

    // this.direction = {
    //   lat: this.nextPoint.lat - this.prevPoint.lat,
    //   lng: this.nextPoint.lng - this.prevPoint.lng,
    // };

    // this.curPosition = { ...this.prevPoint };
    // this.dist = dist(this.prevPoint, this.nextPoint);
    console.log(this.curPosition, this.nextPoint);
    this.speed = bot.speed;

    this.curTask = 'walk';
  }

  getName() {
    return this.name;
  }

  getSpeed() {
    return this.speed;
  }

  getPath() {
    return this.bot.path;
  }

  getFraction() {
    return this.bot.fraction;
  }

  getWaitTime() {
    return this.bot.waitTime;
  }

  getIndex() {
    return this.bot.index;
  }

  getCurPosition() {
    return meters2deg(this.curPosition);
  }

  getNextPoint() {
    return this.nextPoint ? meters2deg(this.nextPoint) : null;
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

  hasMoreTasks() {
    return this.curTask !== 'finish';
    // return true;
    // return this.nextPoint !== null;
  }

  stop() {
    this.lastTime = null;
  }

  runTask(curTime) {
    if (!this.lastTime) {
      this.lastTime = curTime;
      return;
    }

    if (this.curTask === 'walk') {
      const walkedDistance = ((curTime - this.lastTime) / 1000) * this.speed;
      const restOfDistance = dist(this.curPosition, this.nextPoint);

      if (walkedDistance > restOfDistance) {
        this.curPosition = { ...this.nextPoint };

        const spentTime = (restOfDistance / this.speed) * 1000;

        this.lastTime += spentTime;

        this.curTask = 'wait';
        this.runTask(curTime);
        return;
        // if (this._hasNextPoint()) {
        //   // this.prevPoint = this.nextPoint;
        //   this.nextPoint = this._getNextPoint();
        //   walkedDistance -= restOfDistance;
        //   restOfDistance = dist(this.curPosition, this.nextPoint);
        // } else {
        //   // this.prevPoint = this.nextPoint;
        //   this.nextPoint = null;
        //   return;
        // }
      }
      const walkedPart = walkedDistance / restOfDistance;
      this.curPosition = {
        lat: (this.nextPoint.lat - this.curPosition.lat) * walkedPart + this.curPosition.lat,
        lng: (this.nextPoint.lng - this.curPosition.lng) * walkedPart + this.curPosition.lng,
      };
      // console.log('curPosition', this.curPosition);
      this.lastTime = curTime;
    }
    if (this.curTask === 'wait') {
      if ((curTime - this.lastTime) > this.bot.waitTime * 1000) {
        this.lastTime += this.bot.waitTime * 1000;
        if (this._hasNextPoint()) {
          this.nextPoint = this._getNextPoint();
          this.curTask = 'walk';
          this.runTask(curTime);
          return;
        }
        this.curTask = 'finish';
      }
    }
  }
}
