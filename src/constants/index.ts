// Re-export icons
export { Icons } from "./icons";

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
  TOGGLE_FAVORITE: { modifiers: ["cmd"], key: "s" },
  SET_GROUP: { modifiers: ["cmd"], key: "g" },
} as const;

// ============================================
// Default Groups
// ============================================

export const DEFAULT_GROUPS = ["Work", "Personal", "Open Source"] as const;

// ============================================
// IDE Multi-Workspace Support
// ============================================

// IDEs that support opening multiple folders in a single window
export const MULTI_WORKSPACE_IDES: Record<string, boolean> = {
  // VS Code family - supports .code-workspace
  "com.microsoft.VSCode": true,
  "com.microsoft.VSCodeInsiders": true,
  "com.todesktop.230313mzl4w4u92": true, // Cursor
  "com.vscodium": true,

  // Sublime Text - supports multi-folder projects
  "com.sublimetext.4": true,
  "com.sublimetext.3": true,

  // JetBrains IDEs - one project per window
  "com.jetbrains.WebStorm": false,
  "com.jetbrains.intellij": false,
  "com.jetbrains.pycharm": false,
  "com.jetbrains.goland": false,
  "com.jetbrains.rubymine": false,
  "com.jetbrains.rider": false,
  "com.jetbrains.phpstorm": false,
  "com.jetbrains.clion": false,
  "com.jetbrains.datagrip": false,
  "com.jetbrains.AppCode": false,

  // Apple IDEs - single project
  "com.apple.dt.Xcode": false,

  // Other
  "com.google.android.studio": false,
  "org.vim.MacVim": false,
} as const;

// Check if an IDE supports multi-workspace
export function supportsMultiWorkspace(bundleId: string): boolean {
  // Default to false (safer assumption)
  return MULTI_WORKSPACE_IDES[bundleId] ?? false;
}
