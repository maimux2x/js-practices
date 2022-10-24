"use strict";
const { DateTime } = require("luxon");
const minimist = require("minimist");

const options = minimist(process.argv.slice(2), {
  year: "y",
  month: "m",
  default: {
    year: DateTime.now().year,
    month: DateTime.now().month,
  },
});

const year = options.y;
const month = options.m;

const dt = DateTime.fromObject({
  year: year,
  month: month,
  day: 1,
});

if (dt.month < 10) {
  console.log(`      ${dt.month}月 ${dt.year}`);
} else {
  console.log(`     ${dt.month}月 ${dt.year}`);
}

console.log("日 月 火 水 木 金 土");
const endDt = dt.endOf("month");

if (dt.weekday < 7) {
  const RawSpace = " ";
  const MakingSpace = RawSpace.repeat(3 * dt.weekday);

  process.stdout.write(MakingSpace);
}

let newDt = dt;
while (newDt <= endDt) {
  process.stdout.write(`${String(newDt.day).padStart(2, " ")} `);

  if (newDt.weekdayShort === "土") {
    process.stdout.write("\n");
  }

  newDt = newDt.plus({ day: 1 });
}

console.log("\n");
