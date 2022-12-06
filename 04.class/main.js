#!/usr/bin/env node
"use strict";
import { MemosApp } from "./memo_app.js";

const option = process.argv.slice(2);
const memo = new MemosApp();

if (option[0] === "-l") {
  memo.listMemo();
} else if (option[0] === "-r") {
  memo.referMemo();
} else if (option[0] === "-d") {
  memo.deleteMemo();
} else if (option.length === 0) {
  memo.addMemo();
}
