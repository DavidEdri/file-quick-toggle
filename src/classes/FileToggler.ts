import { readdir } from 'fs/promises';
import * as path from 'path';
import { FileTogglerConfig } from '../types';
import { BaseIDEApi } from './IDEApi/BaseIDEApi';

export class FileToggler {
  constructor(protected api: BaseIDEApi) {}

  protected getConfigRegex(config: FileTogglerConfig) {
    return new RegExp(config.pattern);
  }

  protected async getDirectoryFilesNames(parentFolder: string) {
    const directoryData = await readdir(parentFolder, { withFileTypes: true });

    return directoryData
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);
  }

  protected async getToggleTargetPath(
    openedFilePath: string,
    toggleConfig: FileTogglerConfig
  ) {
    const parentDir = path.resolve(openedFilePath, '..');
    const directoryFiles = await this.getDirectoryFilesNames(parentDir);
    const targetFileName = directoryFiles.find((fileName) =>
      this.getConfigRegex(toggleConfig).test(fileName)
    );

    if (!targetFileName) {
      return;
    }

    return path.join(parentDir, targetFileName);
  }

  public async run(args: unknown) {
    if (typeof args !== 'string') {
      this.api.showErrorMessage('no args supplied!');
      return;
    }

    const openedFilePath = await this.api.getOpenedFilePath();
    if (!openedFilePath) {
      return;
    }

    const targetConfigKey = args.split(' ')[0].trim();
    const config = await this.api.getExtensionConfig();
    const toggleConfig = config[targetConfigKey];

    if (!toggleConfig) {
      this.api.showErrorMessage(`no config found for: ${targetConfigKey}`);
      return;
    }

    const targetFilePath = await this.getToggleTargetPath(
      openedFilePath,
      toggleConfig
    );

    if (!targetFilePath) {
      this.api.showInfoMessage(`${targetConfigKey} not found`);
      return;
    }

    this.api.openOrToggleFile(targetFilePath);
  }
}
