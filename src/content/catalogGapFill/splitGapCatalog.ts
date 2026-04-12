import {
  isCatalogPlaceholderCultural,
  isCatalogPlaceholderGesture,
  isCatalogPlaceholderInvention
} from "../../lib/editorialCatalogPlaceholders";
import type { CulturalMomentEntry } from "../culturalMoments/types";
import type { GestureRupture } from "../gestures/types";
import type { InventionEntry } from "../inventions/types";
import raw from "./catalog_gap131.json";

type Row =
  | { axis: "gesture"; year: number; payload: GestureRupture }
  | { axis: "invention"; year: number; payload: InventionEntry }
  | { axis: "cultural"; year: number; payload: CulturalMomentEntry };

const rows = raw as Row[];

export const FR_GESTURE_GAP_FILL: GestureRupture[] = [];
export const FR_INVENTION_GAP_FILL: InventionEntry[] = [];
export const FR_CULTURAL_GAP_FILL: CulturalMomentEntry[] = [];

for (const r of rows) {
  if (r.axis === "gesture") {
    if (!isCatalogPlaceholderGesture(r.payload)) FR_GESTURE_GAP_FILL.push(r.payload);
  } else if (r.axis === "invention") {
    if (!isCatalogPlaceholderInvention(r.payload)) FR_INVENTION_GAP_FILL.push(r.payload);
  } else if (!isCatalogPlaceholderCultural(r.payload)) {
    FR_CULTURAL_GAP_FILL.push(r.payload);
  }
}
