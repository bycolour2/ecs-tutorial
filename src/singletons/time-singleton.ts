import { Singleton } from '~/types';

export type Time = {
  nowMs: number;
  tick: number;
  accumulatorMs: number;
};

export const TimeSingleton: Singleton<Time> = {
  name: 'Time',
  initial: {
    nowMs: 0,
    tick: 0,
    accumulatorMs: 0,
  },
};
