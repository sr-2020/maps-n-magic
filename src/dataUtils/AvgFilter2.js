import * as R from 'ramda';

// AvgFilter2 applied to raw data so it can be used directly. Also it is more precise for time.
export class AvgFilter2 {
  queue = [];

  avgObj = {};

  constructor(queueSize) {
    this.queueSize = queueSize;
    this.timeWindow = 60000;
    this.appendBeaconToAverage = this.appendBeaconToAverage.bind(this);
    this.removeBeaconFromAverage = this.removeBeaconFromAverage.bind(this);
  }

  appendToAverage(el) {
    el.beacons.forEach(this.appendBeaconToAverage);
  }

  appendBeaconToAverage(beacon) {
    // if (!el.beacon) {
    //   return;
    // }
    let avgData = this.avgObj[beacon.beaconId];
    if (!avgData) {
      // eslint-disable-next-line no-multi-assign
      avgData = this.avgObj[beacon.beaconId] = {
        valueSum: 0,
        total: 0,
      };
    }
    avgData.valueSum += beacon.level;
    avgData.total++;
  }

  removeFromAverage(el) {
    el.beacons.forEach(this.removeBeaconFromAverage);
  }

  removeBeaconFromAverage(beacon) {
    // if (!beacon) {
    //   return;
    // }
    const avgData = this.avgObj[beacon.beaconId];
    avgData.valueSum -= beacon.level;
    avgData.total--;
  }

  // return avg only for current recieved beacons
  // updateWithAvgLevel(el) {
  //   const newEl = { ...el };
  //   newEl.rawBeacons = newEl.beacons;
  //   newEl.beacons = newEl.beacons.map((beacon) => ({
  //     ...beacon,
  //     level: this.getBeaconAvgLevel(beacon),
  //   }));
  //   return newEl;
  // }

  // return avg for all hearable in previous time beacons
  updateWithAvgLevel(el) {
    const newEl = { ...el };
    newEl.rawBeacons = newEl.beacons;

    newEl.beacons = Object.entries(this.avgObj).filter((pair) => pair[1].total > 0).map((pair) => ({
      beaconId: Number(pair[0]),
      level: Math.round(pair[1].valueSum / pair[1].total),
    }));
    return newEl;
  }

  // return avg for all hearable in previous time beacons
  getBeaconAvgLevel(beacon) {
    const avgData = this.avgObj[beacon.beaconId];
    return Math.round(avgData.valueSum / avgData.total);
  }

  filter(newEl) {
    this.queue.push(newEl);
    this.appendToAverage(newEl);
    this.clearByTime(newEl);
    this.clearByOverflow();
    return this.updateWithAvgLevel(newEl);
  }

  clearByTime(el) {
    const timeBoundary = el.timeMillis - this.timeWindow;
    while (this.queue[0].timeMillis < timeBoundary) {
      const removedEl = this.queue.shift();
      this.removeFromAverage(removedEl);
    }
  }

  clearByOverflow() {
    if (this.queue.length > this.queueSize) {
      const removedEl = this.queue.shift();
      this.removeFromAverage(removedEl);
    }
  }
}
