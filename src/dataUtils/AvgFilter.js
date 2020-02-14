// this filter is applied after simplification messages with beacon arrays to list of single beacon messages
// AvgFilter2 applied to raw data so it can be used directly. Also it is more precise for time.
export class AvgFilter {
  queue = [];

  avgObj = {};

  constructor(queueSize) {
    this.queueSize = queueSize;
  }

  appendToAverage(el) {
    if (!el.beacon) {
      return;
    }
    let avgData = this.avgObj[el.beacon.beaconId];
    if (!avgData) {
      // eslint-disable-next-line no-multi-assign
      avgData = this.avgObj[el.beacon.beaconId] = {
        valueSum: 0,
        total: 0,
      };
    }
    avgData.valueSum += el.beacon.level;
    avgData.total++;
  }

  removeFromAverage(el) {
    if (!el.beacon) {
      return;
    }
    const avgData = this.avgObj[el.beacon.beaconId];
    avgData.valueSum -= el.beacon.level;
    avgData.total--;
  }

  getAvgLevel(el) {
    const avgData = this.avgObj[el.beacon.beaconId];
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

    return !newEl.beacon ? newEl : {
      ...newEl,
      level: this.getAvgLevel(newEl),
    };
  }
//   var queue = [];
// queue.push(2);         // queue is now [2]
// queue.push(5);         // queue is now [2, 5]
// var i = queue.shift(); // queue is now [5]
// alert(i);
}
