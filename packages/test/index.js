// based on https://observablehq.com/@erikbrinkman/d3-dag-sugiyama

// "dependencies": {
//   "d3": "^6.1.1",
//   "d3-dag": "^0.3.5",
//   "jsdom": "^16.4.0"
// }

const fs = require('fs');
const jsdom = require('jsdom');
const d3Base = require('d3');
const d3Dag = require('d3-dag');

const d3 = { ...d3Base, ...d3Dag };

const { JSDOM } = jsdom;

const width = 400;
const height = 400;

const sources = {
  Grafo: ['grafo', d3.dagStratify()],
  'X-Shape': ['ex', d3.dagStratify()],
  Zherebko: ['zherebko', d3.dagConnect().linkData(() => ({}))],
};
// console.log(sources);
const nodeRadius = 20;
// const svgNode = svg;

const { document } = (new JSDOM(`<svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width=${width} height=${height} viewbox="${-nodeRadius} ${-nodeRadius} ${width + 2 * nodeRadius} ${height + 2 * nodeRadius}"></svg>`)).window;
const svgSelection = d3.select(document).select('svg');

// console.log(svgSelection);
// const svgSelection = d3.select(svgNode);
const defs = svgSelection.append('defs'); // For gradients

function getDag(source, dagData) {
  const [key, reader] = sources[source];
  return reader(dagData);
}

const dagData = [
  {
    id: '0',
    parentIds: ['8'],
  },
  {
    id: '1',
    parentIds: [],
  },
  {
    id: '2',
    parentIds: [],
  },
  {
    id: '3',
    parentIds: ['11'],
  },
  {
    id: '4',
    parentIds: ['12'],
  },
  {
    id: '5',
    parentIds: ['18'],
  },
  {
    id: '6',
    parentIds: ['9', '15', '17'],
  },
  {
    id: '7',
    parentIds: ['3', '17', '20', '21'],
  },
  {
    id: '8',
    parentIds: [],
  },
  {
    id: '9',
    parentIds: ['4'],
  },
  {
    id: '10',
    parentIds: ['16', '21'],
  },
  {
    id: '11',
    parentIds: ['2'],
  },
  {
    id: '12',
    parentIds: ['21'],
  },
  {
    id: '13',
    parentIds: ['4', '12'],
  },
  {
    id: '14',
    parentIds: ['1', '8'],
  },
  {
    id: '15',
    parentIds: [],
  },
  {
    id: '16',
    parentIds: ['0'],
  },
  {
    id: '17',
    parentIds: ['19'],
  },
  {
    id: '18',
    parentIds: ['9'],
  },
  {
    id: '19',
    parentIds: [],
  },
  {
    id: '20',
    parentIds: ['13'],
  },
  {
    id: '21',
    parentIds: [],
  },
];

const layerings = {
  'Simplex (slow)': d3.layeringSimplex(),
  'Longest Path (fast)': d3.layeringLongestPath(),
  'Coffman Graham (medium)': d3.layeringCoffmanGraham(),
};

const layering = 'Simplex (slow)';
const decross = 'Optimal (slow)';
// const coord = 'Vertical (slow)';
const coord = 'Minimum Curves (slow)';

const decrossings = {
  'Optimal (slow)': d3.decrossOpt(),
  'Two Layer Opt (medium)': d3.decrossTwoLayer().order(d3.twolayerOpt()),
  'Two Layer (flast)': d3.decrossTwoLayer(),
};

const coords = {
  'Vertical (slow)': d3.coordVert(),
  'Minimum Curves (slow)': d3.coordMinCurve(),
  'Greedy (medium)': d3.coordGreedy(),
  'Center (fast)': d3.coordCenter(),
};

const layout = d3.sugiyama()
  .size([width, height])
  .layering(layerings[layering])
  .decross(decrossings[decross])
  .coord(coords[coord]);

const dag = getDag('Grafo', dagData);
// Use computed layout
layout(dag);

const steps = dag.size();
const interp = d3.interpolateRainbow;
const colorMap = {};
dag.each((node, i) => {
  colorMap[node.id] = interp(i / steps);
});

// How to draw edges
const line = d3.line()
  .curve(d3.curveCatmullRom)
  .x((d) => d.x)
  .y((d) => d.y);

// Plot edges
svgSelection.append('g')
  .selectAll('path')
  .data(dag.links())
  .enter()
  .append('path')
  .attr('d', ({ data }) => line(data.points))
  .attr('fill', 'none')
  .attr('stroke-width', 3)
  .attr('stroke', ({ source, target }) => {
    const gradId = `${source.id}-${target.id}`;
    const grad = defs.append('linearGradient')
      .attr('id', gradId)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', source.x)
      .attr('x2', target.x)
      .attr('y1', source.y)
      .attr('y2', target.y);
    grad.append('stop').attr('offset', '0%').attr('stop-color', colorMap[source.id]);
    grad.append('stop').attr('offset', '100%').attr('stop-color', colorMap[target.id]);
    return `url(#${gradId})`;
  });

// Select nodes
const nodes = svgSelection.append('g')
  .selectAll('g')
  .data(dag.descendants())
  .enter()
  .append('g')
  .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

// Plot node circles
nodes.append('circle')
  .attr('r', 20)
  .attr('fill', (n) => colorMap[n.id]);

// Add text to nodes
nodes.append('text')
  .text((d) => d.id)
  .attr('font-weight', 'bold')
  .attr('font-family', 'sans-serif')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .attr('fill', 'white');

const svgEl = document.querySelector('svg');
// console.log(svgEl.serialize());
console.log(svgEl.outerHTML);
fs.writeFileSync('./test.svg', svgEl.outerHTML, 'utf-8');
