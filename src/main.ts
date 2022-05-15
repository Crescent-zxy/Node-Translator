import * as https from "https";
import * as querystring from "querystring";
import { appid, appSecret } from "./private";
const md5 = require("md5");

type ErrorMap = {
  [k: string]: string;
};

const errorMap: ErrorMap = {
  52000: "成功",
  52001: "请求超时 ",
  52002: "系统错误 ",
  52003: "未授权用户",
  54000: "必填参数为空 ",
  54001: "签名错误 ",
  54003: "访问频率受限",
  54004: "账户余额不足 ",
  54005: "长query请求频繁",
  58000: "客户端IP非法 ",
  58001: "译文语言方向不支持 ",
  58002: "服务当前已关闭 ",
  90107: "认证未通过或未生效",
};

export const translate = (word: string) => {
  const salt = Math.random();
  const sign = md5(appid + word + salt + appSecret);

  const test = /[a-zA-Z]/.test(word[0]);

  const query: string = querystring.stringify({
    q: word,
    from: test ? "en" : "zh",
    to: test ? "zh" : "en",
    appid,
    salt,
    sign,
  });

  const options = {
    hostname: "fanyi-api.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET",
  };

  const request = https.request(options, (response) => {
    const chunks: Buffer[] = [];
    response.on("data", (chunk) => {
      chunks.push(chunk);
    });
    response.on("end", () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        error_code?: string;
        error_msg?: string;
        from?: string;
        to?: string;
        trans_result: { src: string; dst: string }[];
      };
      const object: BaiduResult = JSON.parse(string);
      if (object.error_code) {
        console.error(errorMap[object.error_code] || object.error_msg);
        process.exit(2);
      } else {
        object.trans_result.forEach((item) => {
          console.log(item.dst);
        });
        process.exit(0);
      }
    });
  });

  request.on("error", (e) => {
    console.log(e);
  });

  request.end();
};
