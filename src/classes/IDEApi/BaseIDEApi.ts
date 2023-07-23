import { ExtensionConfig } from '../../types';

export abstract class BaseIDEApi {
  public abstract getOpenedFilePath(): string | null | Promise<string | null>;
  public abstract openOrToggleFile(filePath: string): void | Promise<void>;
  public abstract showErrorMessage(message: string): void;
  public abstract showInfoMessage(message: string): void;
  public abstract getExtensionConfig():
    | ExtensionConfig
    | Promise<ExtensionConfig>;
}
