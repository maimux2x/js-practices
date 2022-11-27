#!/usr/bin/env node
"use strict";
import { MemosApp } from "./memo_app.js";

const option = process.argv.slice(2);

if (option[0] === "-l") {
  MemosApp.listMemo();
} else if (option[0] === "-r") {
  MemosApp.referenceMemo();
} else if (option[0] === "-d") {
  MemosApp.deleteMemo();
} else if (option.length === 0) {
  new MemosApp();
}
