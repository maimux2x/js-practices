"use strict";

(async function () {
  const response = await fetch("https://bootcamp.fjord.jp/", {
    method: "GET",
  });
  if (!response.ok) {
    return;
  }
  const text = await response.text();
  console.log(text.replace(/>/g, ">\n"));
})();
