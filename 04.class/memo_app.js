import * as readline from "node:readline/promises";
import * as fs from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import Enquirer from "enquirer";
import { v4 as uuidv4 } from "uuid";
import { path, createFile } from "./base_file.js";

export class MemosApp {
  constructor() {
    if (!fs.existsSync(path)) {
      createFile();
      this.baseData = JSON.parse(fs.readFileSync(path, "utf-8"));
    } else {
      this.baseData = JSON.parse(fs.readFileSync(path, "utf-8"));
    }
    this.memos = this.baseData.memos;
  }

  add() {
    const rl = readline.createInterface({ input, output });

    const lines = [];
    rl.on("line", (line) => {
      lines.push(line);
    });

    const params = {};
    const memo = function (params, lines) {
      return new Promise((resolve) => {
        rl.on("close", () => {
          params.memo = lines;
          resolve(params);
        });
      });
    };

    (async () => {
      await memo(params, lines);
      const uuid = uuidv4();

      params.uuid = uuid;

      const newMemo = Object.values(params);
      const newMemoElement = newMemo[0];
      if (newMemoElement[0] === "") {
        console.log("メモの1行目を入力してください。");
        return;
      }
      this.memos.push(params);
      const json = JSON.stringify(this.baseData);

      fs.writeFile(path, json, function (err) {
        if (err) {
          throw err;
        }
        console.log("メモを保存しました。");
      });
    })();
  }

  list() {
    this.memos.forEach((element) => {
      console.log(element.memo[0]);
    });
  }

  read() {
    const choices = [];

    this.memos.forEach((element) => {
      const choice = {};
      choice.name = element.memo[0];
      choice.value = element.memo;
      choices.push(choice);
    });

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

    this.memos.forEach((element, index) => {
      const choice = {};
      choice.name = element.memo[0];
      choice.value = this.memos[index].uuid;
      choices.push(choice);
    });

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

      this.memos.forEach((element, index) => {
        if (element.uuid === answerUuid[0]) {
          this.memos.splice(index, 1);
        }
      });
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
