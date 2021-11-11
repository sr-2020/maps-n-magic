import Ajv, { JSONSchemaType } from "ajv";

export const speedPercentValues = [25, 50, 75, 100, 125, 150, 175, 200];

export interface TimetableItem {
  routeId: number;
  time: number; // minutes, from 0:00 to 23:59 (23*60 + 59 = 1439)
  speedPercent: number; // 25%, 50%, 75%, ... 200%
}

export type SpiritTimetable = TimetableItem[];

export const timetableItemSchema: JSONSchemaType<TimetableItem> = {
  type: "object",
  properties: {
    routeId: {type: 'integer'},
    speedPercent: {type: 'integer', enum: [25, 50, 75, 100, 125, 150, 175, 200]},
    time: {type: 'integer', minimum: 0, exclusiveMaximum: 1440}
  },
  required: ['routeId', 'speedPercent', 'time'],
  additionalProperties: false,
};
