import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../../constants';
import { ExtensionConfig } from '../../types';
import { BaseIDEApi } from './BaseIDEApi';

export class VscodeApi extends BaseIDEApi {
  public getOpenedFilePath() {
    return vscode.window.activeTextEditor?.document.uri.path || null;
  }

  public async openOrToggleFile(filePath: string) {
    const textDocument = await vscode.workspace.openTextDocument(filePath);
    vscode.window.showTextDocument(textDocument);
  }

  public getExtensionConfig(): ExtensionConfig | Promise<ExtensionConfig> {
    const config = vscode.workspace
      .getConfiguration()
      .get(EXTENSION_NAME) as ExtensionConfig;

    if (!config) {
      this.showErrorMessage('no config found');
      throw new Error('no config found');
    }

    return config;
  }

  public showErrorMessage(message: string): void {
    vscode.window.showErrorMessage(message);
  }

  public showInfoMessage(message: string): void {
    vscode.window.showInformationMessage(message);
  }
}
