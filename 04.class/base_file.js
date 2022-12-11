import * as fs from "node:fs";

export const path = "memos.json";
export function createFile() {
  const rawData = { memos: [] };
  const json = JSON.stringify(rawData);

  fs.writeFileSync(path, json, function (err) {
    if (err) {
      throw err;
    }
  });
}
