import { Bot } from './Bot';

export function fillGameModelWithBots(gameModel) {
  const locations = gameModel.get('locations');
  const points = locations.map(locToSomePoint);
  const spirits = gameModel.get('spirits');
  const speeds = [3, 5, 8];
  spirits.filter((s, i) => i < 6).forEach((spirit, i) => {
    const path = [];
    let j = 0;
    while (j < 5) {
      path.push(points[(((j + 3) * 31) + (5 + i) * 13) % points.length]);
      j++;
    }
    gameModel.execute({
      type: 'putBot',
      name: spirit.name + i,
      bot: new Bot(speeds[i % 3], path),
    });
  });
}

function locToSomePoint(loc) {
  const pointSum = loc.latlngs[0].reduce((acc, point) => {
    acc.lat += point.lat;
    acc.lng += point.lng;
    return acc;
  }, { lat: 0, lng: 0 });
  return {
    lat: pointSum.lat / loc.latlngs[0].length,
    lng: pointSum.lng / loc.latlngs[0].length,
  };
}
