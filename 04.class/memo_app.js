import * as fs from "node:fs";
import Enquirer from "enquirer";
import { v4 as uuidv4 } from "uuid";

const path = "memos.json";

export class MemosApp {
  constructor() {
    if (!fs.existsSync(path)) {
      this.createFile();
    }
    this.baseData = JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  createFile() {
    const rawData = {};
    const json = JSON.stringify(rawData);

    fs.writeFileSync(path, json, function (err) {
      if (err) {
        throw err;
      }
    });
  }

  add() {
    const input = fs.readFileSync("/dev/stdin", "utf-8");
    const memo = input.trim();

    if (memo === "") {
      console.log("メモの1行目を入力してください。");
      return;
    }

    const uuid = uuidv4();
    this.baseData[uuid] = memo;

    const json = JSON.stringify(this.baseData);
    fs.writeFile(path, json, function (err) {
      if (err) {
        throw err;
      }
    });
    console.log("メモを保存しました。");
  }

  list() {
    for (const uuid in this.baseData) {
      console.log(this.extractFirstLine(this.baseData[uuid]));
    }
  }

  read() {
    this.chooseMemo("参照したいメモを選択してください。", (uuid) => {
      console.log(this.baseData[uuid]);
    });
  }

  delete() {
    this.chooseMemo("削除したいメモを選択してください", (uuid) => {
      delete this.baseData[uuid];

      const json = JSON.stringify(this.baseData);

      fs.writeFile(path, json, function (err) {
        if (err) {
          throw err;
        }
      });
      console.log("メモを削除しました。");
    });
  }

  chooseMemo(message, callback) {
    const choices = [];

    for (const uuid in this.baseData) {
      const choice = {};
      choice.name = this.extractFirstLine(this.baseData[uuid]);
      choice.value = uuid;
      choices.push(choice);
    }

    (async () => {
      const question = {
        type: "select",
        name: "result",
        message: message,
        choices: choices,
        result(names) {
          return this.map(names);
        },
      };
      const answer = await Enquirer.prompt(question);
      callback(Object.values(answer.result)[0]);
    })();
  }

  extractFirstLine(baseData) {
    const lines = baseData.split("\n");
    return lines[0];
  }
}
