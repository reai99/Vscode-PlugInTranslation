
import * as vscode from 'vscode';
import axios from 'axios';
import  { Md5 } from "ts-md5/dist/md5";;

const appid = vscode.workspace.getConfiguration().get('translate.appid');
const secret = vscode.workspace.getConfiguration().get('translate.secret');

  /**
 * 翻译方法
 * @param {string} q 查询字符串
 * @param {string} from 源语言
 * @param {string} to 目标语言
* @returns {
  Promise<{
  data: {
  trans_result: [{
    src: string, dst: string
  }]
}
}>} Promise翻译结果
 */
function translate(q: string, from: string, to: string) {
  var salt = Math.random();
  return axios({
    method: 'get',
    url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
    params: {
      q,
      appid,
      from,
      to,
      salt,
      sign: Md5.hashStr(appid + q + salt + secret)
    }
  });
}


export default  {
  translate
};
