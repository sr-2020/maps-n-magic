import { Interface } from "readline";

export interface GMTyped {
  type: string;
}

export interface GMRequest extends GMTyped {
  
}

export interface GMAction extends GMTyped {

}

// export type GMLogger = unknown;

export interface GMLogger {
  info: (...args) => void;
  error: (...args) => void;
  customChild?: (baseLogger: GMLogger, ...args) => GMLogger;
}

export interface Metadata {
  actions: string[];
  requests: string[];
  emitEvents: string[];
  needActions: string[];
  needRequests: string[];
  listenEvents: string[];
};