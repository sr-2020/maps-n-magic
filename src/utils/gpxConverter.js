import { gpx } from '@tmcw/togeojson';
import * as R from 'ramda';

import { parseString } from 'xml2js';
// import { string as gpxData } from '../data/14-09-2019_beacons';
// import gpxData from '../data/14-09-2019_beacons';

const gpxData = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Mobile Topographer Free">
  <metadata>
    <name>14-09-2019 маяки.gpx</name>
    <author>
      <name>S.F. Applicality Ltd.</name>
      <email id="info" domain="applicality.com"/>
      <link href="http://www.applicality.com"/>
    </author>
    <copyright author="Stathis D. Stathakis &amp; S.F. Applicality Ltd.">
      <year>2019</year>
    </copyright>
  </metadata>
  <wpt lat="54.92837799" lon="36.87314019">
    <ele>146.7477713997501</ele>
    <geoidheight>131.67013652650056</geoidheight>
    <name>30</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92818532" lon="36.87283511">
    <ele>144.95192307692307</ele>
    <geoidheight>127.0</geoidheight>
    <name>29</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92859145" lon="36.87255827">
    <ele>149.6969696969697</ele>
    <geoidheight>127.00000000000001</geoidheight>
    <name>28</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92859604" lon="36.87224386">
    <ele>153.36220472440942</ele>
    <geoidheight>127.0</geoidheight>
    <name>27</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92853914" lon="36.87193252">
    <ele>151.71739130434784</ele>
    <geoidheight>127.0</geoidheight>
    <name>26 (высокий)</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92852877" lon="36.87158808">
    <ele>150.57500000000002</ele>
    <geoidheight>127.0</geoidheight>
    <name>25</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92875469" lon="36.87169900">
    <ele>147.65217391304347</ele>
    <geoidheight>127.0</geoidheight>
    <name>24</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92897089" lon="36.87195595">
    <ele>146.0842105263158</ele>
    <geoidheight>127.0</geoidheight>
    <name>23</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92913163" lon="36.87219672">
    <ele>143.03252032520325</ele>
    <geoidheight>127.0</geoidheight>
    <name>22</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92965521" lon="36.87236735">
    <ele>158.48529411764707</ele>
    <geoidheight>127.0</geoidheight>
    <name>21</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92936007" lon="36.87299053">
    <ele>151.64102564102564</ele>
    <geoidheight>127.0</geoidheight>
    <name>тарелка на запад</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <wpt lat="54.92929777" lon="36.87312344">
    <ele>151.925</ele>
    <geoidheight>127.0</geoidheight>
    <name>Тарелка на Юг</name>
    <src>Mobile Topographer Pro</src>
  </wpt>
  <rte>
    <name>route</name>
    <rtept lat="54.92837799" lon="36.87314019">
      <ele>146.7477713997501</ele>
      <geoidheight>131.67013652650056</geoidheight>
      <name>30</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92818532" lon="36.87283511">
      <ele>144.95192307692307</ele>
      <geoidheight>127.0</geoidheight>
      <name>29</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92859145" lon="36.87255827">
      <ele>149.6969696969697</ele>
      <geoidheight>127.00000000000001</geoidheight>
      <name>28</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92859604" lon="36.87224386">
      <ele>153.36220472440942</ele>
      <geoidheight>127.0</geoidheight>
      <name>27</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92853914" lon="36.87193252">
      <ele>151.71739130434784</ele>
      <geoidheight>127.0</geoidheight>
      <name>26 (высокий)</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92852877" lon="36.87158808">
      <ele>150.57500000000002</ele>
      <geoidheight>127.0</geoidheight>
      <name>25</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92875469" lon="36.87169900">
      <ele>147.65217391304347</ele>
      <geoidheight>127.0</geoidheight>
      <name>24</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92897089" lon="36.87195595">
      <ele>146.0842105263158</ele>
      <geoidheight>127.0</geoidheight>
      <name>23</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92913163" lon="36.87219672">
      <ele>143.03252032520325</ele>
      <geoidheight>127.0</geoidheight>
      <name>22</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92965521" lon="36.87236735">
      <ele>158.48529411764707</ele>
      <geoidheight>127.0</geoidheight>
      <name>21</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92936007" lon="36.87299053">
      <ele>151.64102564102564</ele>
      <geoidheight>127.0</geoidheight>
      <name>тарелка на запад</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92929777" lon="36.87312344">
      <ele>151.925</ele>
      <geoidheight>127.0</geoidheight>
      <name>Тарелка на Юг</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
    <rtept lat="54.92837799" lon="36.87314019">
      <ele>146.7477713997501</ele>
      <geoidheight>131.67013652650056</geoidheight>
      <name>30</name>
      <src>Mobile Topographer Pro</src>
    </rtept>
  </rte>
</gpx>`;

// console.log('gpxData', gpxData)

// // console.log('gpxData', gpxData);
const oParser = new DOMParser();
const oDOM = oParser.parseFromString(gpxData, 'application/xml');
// // console.log('oDOM', (oDOM));
// // console.log('gpx(oDOM)', gpx(oDOM));

const parsedGpx = gpx(oDOM);

parsedGpx.features = parsedGpx.features.filter((feature) => feature.geometry.type === 'Point');

// console.log(JSON.stringify(parsedGpx, null, '  '));


// template
// {
//   "type": "Feature",
//   "properties": {
//     "name": "тарелка на запад"
//   },
//   "geometry": {
//     "type": "Point",
//     "coordinates": [
//       36.87299053,
//       54.92936007,
//       151.64102564102564
//     ]
//   }
// },

// parseString(gpxData, function (err, result) {
//     // console.dir(result);
//     const arr = result.gpx.rte[0].rtept;
//     const markers = arr.map(point => ({
//       "type": "Feature",
//       "properties": {
//         "name": point.name[0]
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           Number(point.$.lon),
//           Number(point.$.lat),
//           Number(point.ele[0]),
//         ]
//       }
//     }));
//     parsedGpx.features = parsedGpx.features.concat(markers);
//     // console.log(JSON.stringify(result, null, '  '));
//     console.log(JSON.stringify(parsedGpx, null, '  '));
// });


// const gpxPoints = parsedGpx.features.filter(feature => feature.geometry.type === 'Point');
// // console.log(gpxPoints);

// const srcPoints = gpxPoints.map(gpxPoint => ({
//   id: gpxPoint.properties.name,
//   x: gpxPoint.geometry.coordinates[0],
//   y: -gpxPoint.geometry.coordinates[1],
// }));

// // console.log(srcPoints);

// const xs = srcPoints.map(R.prop('x'));
// const ys = srcPoints.map(R.prop('y'));

// // console.log(xs, ys);
// const minX = Math.min.apply(null, xs);
// const minY = Math.min.apply(null, ys);
// const maxX = Math.max.apply(null, xs);
// const maxY = Math.max.apply(null, ys);

// // console.log(minX, maxX, minY, maxY);

// const normilizedPoints = srcPoints.map(srcPoint => ({
//   ...srcPoint,
//   x: (srcPoint.x - minX) / (maxX - minX),
//   y: (srcPoint.y - minY) / (maxY - minY),
// }));
// console.log(normilizedPoints);

// export default function (x, y, width, height) {
//   return normilizedPoints.map(srcPoint => ({
//     ...srcPoint,
//     x: srcPoint.x * width + x,
//     y: srcPoint.y * height + y,
//   }));
// }
