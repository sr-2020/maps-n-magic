import { strFormat, yedEdgeTmpl, yedGmlBase, yedNodeTmpl, colorPalette } from "./yed";
import { features } from "./features";

import * as fs from "fs";

const { color } = colorPalette[0];

const rootNodeId = 'root-node';
const archNodeId = 'arch-node';

const yedNodes = features.map(feature => {
// const yedNodes = [features[0], features[1]].map(feature => {
  return strFormat(yedNodeTmpl, [feature.id, feature.humanReadableName, color.background, color.border]);
}).join('\n')
 + strFormat(yedNodeTmpl, [rootNodeId, 'Корень', color.background, color.border]) + '\n'
 + strFormat(yedNodeTmpl, [archNodeId, 'Архетипы', color.background, color.border]) + '\n';

const featureIds = new Set();
features.forEach(feature =>featureIds.add(feature.id));

interface Edge {
  from: string;
  to: string;
  id: number;
}

const edges: Edge[] = [];

let id = 1;
features.forEach(fromFeature => {
  const prereq = fromFeature.prerequisites.filter(str => str.charAt(0) !== '!');
  if(fromFeature.id === 'arch-mage') {
    console.log(prereq);
  }
  if (prereq.length > 0) {
    prereq.forEach(toFeature => {
      if(featureIds.has(toFeature)) {
        edges.push({
          from: fromFeature.id,
          to: toFeature,
          id
        });
        id++;
      }
    });
  } else {
    if(fromFeature.id.startsWith('arch')) {
      edges.push({
        from: fromFeature.id,
        to: fromFeature.id.startsWith('arch') ? archNodeId : rootNodeId,
        id
      });
      id++;
    }
  }
});

const yedEdges = edges.map(edge => strFormat(yedEdgeTmpl, [edge.id, '', edge.to, edge.from])).join('\n');

const graphmlText = strFormat(yedGmlBase, [yedNodes, yedEdges]);
// const graphmlText = strFormat(yedGmlBase, ['', '']);

// console.log(graphmlText);

fs.writeFileSync('out2.graphml', graphmlText);