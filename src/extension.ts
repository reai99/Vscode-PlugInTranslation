// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import traslateApi from './translate/api';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
 const disposable = vscode.commands.registerCommand('translate.zntoen', 
  async function () {
    /**
     * @type {string} 选择的单词
     */
    let selectWord:string;
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) { return false; }
    const currentSelect = currentEditor.document.getText(currentEditor.selection);
    if (!currentSelect) { return false; }
    const data = await traslateApi.translate(currentSelect, 'zh', 'en');
    const result = data.data.trans_result[0].dst;
    // 基于空格分割
    const list = result.split(' ');
    if (list.length > 1) {
      const arr = [];
      // - 号连接
      arr.push(list.map((v: string) => v.toLocaleLowerCase()).join('-'));
      // 下划线连接
      arr.push(list.map((v: string) => v.toLocaleLowerCase()).join('_'));
      // 大驼峰
      arr.push(list.map((v: string) => v.charAt(0).toLocaleUpperCase() + v.slice(1)).join(''));
      // 小驼峰
      arr.push(list.map((v: string, i: number) => {
        if (i !== 0) {
          return v.charAt(0).toLocaleUpperCase() + v.slice(1);
        }
        return v.toLocaleLowerCase();
      }).join(''));
      selectWord = await vscode.window.showQuickPick(arr, { placeHolder: '请选择要替换的变量名' });
    } else {
      selectWord = list[0];
    }

    if (selectWord) {
      currentEditor.edit(editBuilder => {
        editBuilder.replace(currentEditor.selection, selectWord);
      });
    }
  });

  context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() { }
