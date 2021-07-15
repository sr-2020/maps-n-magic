export * from './spirits';
export * from './auth';

export interface CatcherData {
  startTime: number; // current time
  durationMillis: number; // power * 5 minutes
  catchProbability: number; // 0-100 or more
  attemptNumber: number; // 1-3
}

export type CatcherStates = Record<string, CatcherData>;