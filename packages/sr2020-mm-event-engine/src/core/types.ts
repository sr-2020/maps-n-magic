import { Interface } from "readline";

export interface GMTyped {
  type: string;
  [key: string]: any;
}

export interface GMRequest extends GMTyped {
  
}

export interface GMAction extends GMTyped {

}

// export type GMLogger = unknown;

export interface GMLogger {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  customChild?: (baseLogger: GMLogger, ...args: unknown[]) => GMLogger;
}

export interface Metadata {
  actions: string[];
  requests: string[];
  emitEvents: string[];
  needActions: string[];
  needRequests: string[];
  listenEvents: string[];
};