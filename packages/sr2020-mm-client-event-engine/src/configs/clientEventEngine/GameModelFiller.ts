export {};
// import L from 'leaflet/dist/leaflet-src';
// import { Bot } from '../../services/BotService/Bot';

// function latLngsToBounds(latLngs) {
//   const bounds = new L.LatLngBounds();
//   latLngs.forEach(bounds.extend.bind(bounds));
//   return bounds;
// }

// export function fillGameModelWithBots(gameModel) {
//   const locations = gameModel.get('locations');
//   const points = locations.map(locToSomePoint);
//   const spirits = gameModel.get('spirits');
//   const speeds = [2, 3, 5];
//   // const speeds = [30, 50, 80];
//   // const waitTimes = [2, 3, 5];
//   const waitTimes = [120, 180, 300];
//   const pathLength = 5;
//   spirits
//   // .filter((s, i) => i < 6)
//     .forEach((spirit, i) => {
//       const path = [];
//       let j = 0;
//       while (j < pathLength) {
//         const locationIndex = (((j + 3) * 31) + (5 + i) * 13) % locations.length;
//         const location = locations[locationIndex];
//         // path.push((points[locationIndex]));
//         // path.push(locToSomePoint(location));
//         path.push(locToSomePoint2(location, i / spirits.length, j / pathLength));
//         j++;
//       }
//       gameModel.execute({
//         type: 'putBot',
//         name: spirit.name,
//         bot: new Bot(speeds[i % 3], path, i, waitTimes[i % 2], spirit.fraction),
//       });
//     });
// }

// function locToSomePoint2(loc, xPercent, yPercent) {
//   const bound = latLngsToBounds(loc.latlngs);
//   // const center = locToSomePoint(loc);
//   return {
//     lat: bound.getNorth() + (bound.getSouth() - bound.getNorth()) * (xPercent / 2 + 0.5),
//     lng: bound.getWest() + (bound.getEast() - bound.getWest()) * (yPercent / 2 + 0.5),
//     // lat: center.lat + (bound.getSouth() - bound.getNorth()) * (xPercent / 2 + 0.5),
//     // lng: center.lng + (bound.getEast() - bound.getWest()) * (yPercent / 2 + 0.5),
//   };
// }

// function locToSomePoint(loc) {
//   const pointSum = loc.latlngs[0].reduce((acc, point) => {
//     acc.lat += point.lat;
//     acc.lng += point.lng;
//     return acc;
//   }, { lat: 0, lng: 0 });
//   return {
//     lat: pointSum.lat / loc.latlngs[0].length,
//     lng: pointSum.lng / loc.latlngs[0].length,
//   };
// }
