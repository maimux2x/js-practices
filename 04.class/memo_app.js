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
    const uuid = uuidv4();
    const input = fs.readFileSync("/dev/stdin", "utf-8");
    const memo = input.split("\n");
    memo.pop();

    if (memo[0] === "") {
      console.log("メモの1行目を入力してください。");
      return;
    }

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
    for (const property in this.baseData) {
      console.log(this.baseData[property][0]);
    }
  }

  read() {
    const choices = [];

    for (const property in this.baseData) {
      const choice = {};
      choice.name = this.baseData[property][0];
      choice.value = this.baseData[property];
      choices.push(choice);
    }

    (async () => {
      const question = {
        type: "select",
        name: "result",
        message: "参照したいメモを選択してください。",
        choices: choices,
        result(names) {
          return this.map(names);
        },
      };
      const answer = await Enquirer.prompt(question);
      const resultMemo = answer.result;
      const memoValues = Object.values(resultMemo);
      memoValues[0].forEach((element) => {
        console.log(element);
      });
    })();
  }

  delete() {
    const choices = [];

    for (const property in this.baseData) {
      const choice = {};
      choice.name = this.baseData[property][0];
      choice.value = property;
      choices.push(choice);
    }

    (async () => {
      const question = {
        type: "select",
        name: "result",
        message: "削除したいメモを選択してください",
        choices: choices,
        result(names) {
          return this.map(names);
        },
      };
      const answer = await Enquirer.prompt(question);
      const answerUuid = Object.values(answer.result);

      for (const property in this.baseData) {
        if (property === answerUuid[0]) {
          delete this.baseData[property];
        }
      }
      const json = JSON.stringify(this.baseData);

      fs.writeFile(path, json, function (err) {
        if (err) {
          throw err;
        }
      });
      console.log("メモを削除しました。");
    })();
  }
}
