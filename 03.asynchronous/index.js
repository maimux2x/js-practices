async function main() {
  try {
    const result = await fetch("https://bootcamp.fjord.jp/", {
      method: "GET",
    })
      .then((response) => {
        return response.text();
      })
      .then(function (data) {
        const parser = new DOMParser();
        return parser.parseFromString(data, "text/html");
      });
    console.log(result);
  } catch (error) {
    console.error(`エラーが発生しました (${error})`);
  }
}
