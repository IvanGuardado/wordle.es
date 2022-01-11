import { DateTime } from "luxon";
import target5 from "./target5";

export function getTodaysIndex(date) {
  const firstDay = DateTime.fromISO("2022-01-06T00:00", {
    zone: "America/New_York",
  });
  let today = date || DateTime.local();

  const diff = today.diff(firstDay, ["days"]);
  return parseInt(diff.days) % target5.length;
}

export function getTodaysWord(dateOrIndex) {
  const index = dateOrIndex instanceof Date ? getTodaysIndex(dateOrIndex) : parseInt(dateOrIndex)
  return target5[index];
}
