import * as https from "https";
import * as querystring from "querystring";
const md5 = require("md5");

export const translate = (word) => {
  const appid = "";
  const appSecret = "";
  const salt = Math.random();
  const sign = md5(appid + word + salt + appSecret);

  const query: string = querystring.stringify({
    q: word,
    from: "en",
    to: "zn",
    appid,
    salt,
    sign,
  });

  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate",
    method: "GET",
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (e) => {
    console.log(e);
  });

  req.end();
};
