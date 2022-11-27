import * as readline from "node:readline/promises";
import * as fs from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import Enquirer from "enquirer";
import { v4 as uuidv4 } from "uuid";

const path = "memos.json";

export class MemosApp {
  constructor() {
    const rl = readline.createInterface({ input, output });

    const lines = [];
    rl.on("line", (line) => {
      //改行ごとに"line"イベントが発火される
      lines.push(line); //ここで、lines配列に、標準入力から渡されたデータを入れる
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
      this.memo = params;
      this.addMemo();
    })();
  }

  addMemo() {
    const baseData = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, "utf-8"))
      : { memos: [] };
    const newMemo = Object.values(this.memo);
    const newMemoElement = newMemo[0];
    if (newMemoElement[0] === "") {
      console.log("メモの1行目を入力してください。");
      return;
    }
    baseData.memos.push(this.memo);
    const json = JSON.stringify(baseData);

    fs.writeFile(path, json, function (err) {
      if (err) {
        throw err;
      }
      console.log("メモを保存しました。");
    });
  }

  static listMemo() {
    const memosData = fs.readFileSync(path, "utf-8");
    const base = JSON.parse(memosData);
    const memos = base.memos;
    memos.forEach((element) => {
      console.log(element.memo[0]);
    });
  }

  static referenceMemo() {
    const memosData = fs.readFileSync(path, "utf-8");
    const base = JSON.parse(memosData);
    const memos = base.memos;
    const choices = [];

    memos.forEach((element) => {
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

  static deleteMemo() {
    const memosData = fs.readFileSync(path, "utf-8");
    const base = JSON.parse(memosData);
    const memos = base.memos;
    const choices = [];

    memos.forEach((element, index) => {
      const choice = {};
      choice.name = element.memo[0];
      choice.value = memos[index].uuid;
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

      memos.forEach((element, index) => {
        if (element.uuid === answerUuid[0]) {
          memos.splice(index, 1);
        }
      });
      const json = JSON.stringify(base);

      fs.writeFile(path, json, function (err) {
        if (err) {
          throw err;
        }
      });
      console.log("メモを削除しました。");
    })();
  }
}
