import type { GestureRupture } from "../../../types";
import { FR_GESTURE_BACKFILL_1925_1949 } from "./1925_1949";
import { FR_GESTURE_BACKFILL_1950_1969 } from "./1950_1969";
import { FR_GESTURE_BACKFILL_1970_1989 } from "./1970_1989";
import { FR_GESTURE_BACKFILL_1990_2009 } from "./1990_2009";
import { FR_GESTURE_BACKFILL_2010_current } from "./2010_current";

export const FR_GESTURE_PERIOD_ENTRIES: GestureRupture[] = [
  ...FR_GESTURE_BACKFILL_1925_1949,
  ...FR_GESTURE_BACKFILL_1950_1969,
  ...FR_GESTURE_BACKFILL_1970_1989,
  ...FR_GESTURE_BACKFILL_1990_2009,
  ...FR_GESTURE_BACKFILL_2010_current,
];
