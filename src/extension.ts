import * as vscode from 'vscode';
import { FileToggler } from './classes/FileToggler';
import { VscodeApi } from './classes/IDEApi/VscodeApi';

const api = new VscodeApi();

export async function activate(context: vscode.ExtensionContext) {
  const c = vscode.window.createOutputChannel('ext').appendLine;
  const config = await api.getExtensionConfig();

  c(JSON.stringify(config));

  const disposable = vscode.commands.registerCommand(
    'file-quick-toggle.toggle',
    (args) => {
      new FileToggler(api).run(args);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
