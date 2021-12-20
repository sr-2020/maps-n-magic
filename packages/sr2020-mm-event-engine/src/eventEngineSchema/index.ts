import * as fs from "fs";

import { colorPalette, strFormat, yedEdgeTmpl, yedGmlBase, yedNodeTmpl } from "../featuresTest/yed";
import { mainServerMetadata } from "./mainServerMetadata";
import { eeSchemaEdgeTmpl } from "./yedTemplates";

const { color } = colorPalette[0];

console.log(333);

const requestIndex = new Map();
const actionIndex = new Map();
const emitEventsIndex = new Map();

Object.entries(mainServerMetadata.services)
  .forEach(([serviceName, metadata]) => {
    metadata.requests.forEach(request => requestIndex[request] = serviceName);
    metadata.actions.forEach(action => actionIndex[action] = serviceName);
    metadata.emitEvents.forEach(event => emitEventsIndex[event] = serviceName);
  });

Object.entries(mainServerMetadata.eventProcessors)
  .filter(([processorName]) => processorName !== 'StubEventProcessor')
  .forEach(([processorName, metadata]) => {
    metadata.emitEvents.forEach(event => emitEventsIndex[event] = processorName);
  });

const yedNodes = Object.entries(mainServerMetadata.services)
  .map(([serviceName, metadata]) => {
    return strFormat(yedNodeTmpl, [serviceName, serviceName, color.background, color.border]);
  }).join('\n') + Object.entries(mainServerMetadata.eventProcessors)
  .map(([processorName, metadata]) => {
    return strFormat(yedNodeTmpl, [processorName, processorName, color.background, color.border]);
  }).join('\n')


enum EdgeType {
  Request = 1,
  Action,
  Event
};

interface Edge {
  from: string;
  type: EdgeType;
  to: string;
  id: number;
  label: string;
}

let id = 1;

const edgeIndex: Map<string, Edge> = new Map();

function addEdge({
  from,
  to,
  type,
  label
}: {
  from: string,
  to: string,
  type: EdgeType,
  label: string
}) {
  const key = from + to + type;
  let edge = edgeIndex.get(key);
  if (edge) {
    edge.label += '\n' + label;
  } else {
    // console.log('duplicate', key, label);
    edge = {
      id: id++,
      type,
      from,
      to,
      label
    }
    edgeIndex.set(key, edge);
  }
}

Object.entries(mainServerMetadata.services)
  .forEach(([serviceName, metadata]) => {
    metadata.needRequests.forEach(request => addEdge({
      type: EdgeType.Request,
      from: serviceName,
      to: requestIndex[request],
      label: request
    }));
    metadata.needActions.forEach(action => addEdge({
      type: EdgeType.Action,
      from: serviceName,
      to: actionIndex[action],
      label: action
    }));
    metadata.listenEvents.forEach(event => addEdge({
      type: EdgeType.Event,
      from: serviceName,
      to: emitEventsIndex[event],
      label: event
    }));
    // edges.push(...metadata.needRequests.map(request => ({
    //   id: id++,
    //   type: EdgeType.Request,
    //   from: serviceName,
    //   to: requestIndex[request],
    //   label: request
    // })));
    // edges.push(...metadata.needActions.map(action => ({
    //   id: id++,
    //   type: EdgeType.Action,
    //   from: serviceName,
    //   to: actionIndex[action],
    //   label: action
    // })));
    // edges.push(...metadata.listenEvents.map(event => ({
    //   id: id++,
    //   type: EdgeType.Event,
    //   from: serviceName,
    //   to: emitEventsIndex[event],
    //   label: event
    // })));
  });

Object.entries(mainServerMetadata.eventProcessors)
  .forEach(([processorName, metadata]) => {
    metadata.listenEvents.forEach(event => addEdge({
      type: EdgeType.Event,
      from: processorName,
      to: emitEventsIndex[event],
      label: event
    }));
  });

const edges: Edge[] = [...edgeIndex.values()];

function typeToLineStyle(type: EdgeType) {
  switch(type) {
    case EdgeType.Request: return 'line';
    case EdgeType.Action: return 'dashed';
    case EdgeType.Event: return 'dashed_dotted';
  }
}

const yedEdges = edges.filter(edge => {
  if(edge.to === undefined || edge.from === undefined) {
    // console.log('broken edge', edge);
    return false;
  }
  return true;
}).map(edge => strFormat(eeSchemaEdgeTmpl, [
  edge.id, 
  edge.label, 
  edge.from, 
  edge.to,
  typeToLineStyle(edge.type)
])).join('\n');

// const graphmlText = strFormat(yedGmlBase, [yedNodes, '']);
const graphmlText = strFormat(yedGmlBase, [yedNodes, yedEdges]);

// console.log(graphmlText);

fs.writeFileSync('out.graphml', graphmlText);