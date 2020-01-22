// 111100 meters in lat
// 63995 meters in lng

const deg2meters = ({ lat, lng }) => ({ lat: lat * 111100, lng: lng * 63995 });
const meters2deg = ({ lat, lng }) => ({ lat: lat / 111100, lng: lng / 63995 });

const dist = (pt1, pt2) => Math.sqrt((pt1.lat - pt2.lat) ** 2 + (pt1.lng - pt2.lng) ** 2);

// 1 deg - 63995 meters
// X deg - 5 meters

// 63995/1 = 5/X
// x = 5/63995 =

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

  getPath() {
    return this.bot.path;
  }

  getIndex() {
    return this.bot.index;
  }

  getCurPosition() {
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

  stop() {
    this.lastTime = null;
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
    // console.log('curPosition', this.curPosition);

    this.lastTime = curTime;
  }
}
