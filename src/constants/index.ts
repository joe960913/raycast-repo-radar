import { IDE, IDEConfig } from "../types";

// ============================================
// IDE Configurations
// ============================================

export const IDE_CONFIGS: Record<IDE, IDEConfig> = {
  cursor: {
    name: "Cursor",
    bundleId: "com.todesktop.230313mzl4w4u92",
    icon: "cursor-icon.png",
    cliCommand: "cursor",
  },
  vscode: {
    name: "Visual Studio Code",
    bundleId: "com.microsoft.VSCode",
    icon: "vscode-icon.png",
    cliCommand: "code",
  },
  webstorm: {
    name: "WebStorm",
    bundleId: "com.jetbrains.WebStorm",
    icon: "webstorm-icon.png",
    cliCommand: "webstorm",
  },
  idea: {
    name: "IntelliJ IDEA",
    bundleId: "com.jetbrains.intellij",
    icon: "idea-icon.png",
    cliCommand: "idea",
  },
  zed: {
    name: "Zed",
    bundleId: "dev.zed.Zed",
    icon: "zed-icon.png",
    cliCommand: "zed",
  },
  sublime: {
    name: "Sublime Text",
    bundleId: "com.sublimetext.4",
    icon: "sublime-icon.png",
    cliCommand: "subl",
  },
  atom: {
    name: "Atom",
    bundleId: "com.github.atom",
    icon: "atom-icon.png",
    cliCommand: "atom",
  },
};

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  PROJECTS: "projects",
} as const;

// ============================================
// UI Constants
// ============================================

export const SHORTCUTS = {
  ADD_PROJECT: { modifiers: ["cmd"], key: "n" },
  EDIT_PROJECT: { modifiers: ["cmd"], key: "e" },
  DELETE_PROJECT: { modifiers: ["cmd"], key: "backspace" },
  SHOW_IN_FINDER: { modifiers: ["cmd"], key: "f" },
  COPY_PATH: { modifiers: ["cmd", "shift"], key: "c" },
  CREATE_QUICKLINK: { modifiers: ["cmd", "shift"], key: "q" },
} as const;
