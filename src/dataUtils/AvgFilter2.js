// AvgFilter2 applied to raw data so it can be used directly. Also it is more precise for time.
export class AvgFilter2 {
  queue = [];

  avgObj = {};

  constructor(queueSize) {
    this.queueSize = queueSize;
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

  updateWithAvgLevel(el) {
    const newEl = { ...el };
    newEl.rawBeacons = newEl.beacons;
    newEl.beacons = newEl.beacons.map((beacon) => ({
      ...beacon,
      level: this.getBeaconAvgLevel(beacon),
    }));
    return newEl;
  }

  getBeaconAvgLevel(beacon) {
    const avgData = this.avgObj[beacon.beaconId];
    return Math.round(avgData.valueSum / avgData.total);
    // return (avgData.valueSum / avgData.total);
  }

  filter(newEl) {
    this.queue.push(newEl);
    this.appendToAverage(newEl);
    if (this.queue.length > this.queueSize) {
      const removedEl = this.queue.shift();
      this.removeFromAverage(removedEl);
    }

    return this.updateWithAvgLevel(newEl);

    // return !newEl.beacon ? newEl : {
    //   ...newEl,
    //   level: this.getAvgLevel(newEl),
    // };
  }
}
