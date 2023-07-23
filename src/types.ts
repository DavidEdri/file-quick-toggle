export type FileTogglerConfig = {
  pattern: string;
};
export type ExtensionConfig = Record<string, FileTogglerConfig | undefined>;
