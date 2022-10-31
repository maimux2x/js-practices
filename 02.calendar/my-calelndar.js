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

const date = DateTime.fromObject({
  year: year,
  month: month,
  day: 1,
});

if (date.month < 10) {
  console.log(`      ${date.month}月 ${date.year}`);
} else {
  console.log(`     ${date.month}月 ${date.year}`);
}

console.log("日 月 火 水 木 金 土");
const enddate = date.endOf("month");

if (date.weekday < 7) {
  const space = " ".repeat(3 * date.weekday);

  process.stdout.write(space);
}

let newdate = date;
while (newdate <= enddate) {
  process.stdout.write(`${String(newdate.day).padStart(2, " ")} `);

  if (newdate.weekday === 6) {
    process.stdout.write("\n");
  }

  newdate = newdate.plus({ day: 1 });
}

console.log("\n");
