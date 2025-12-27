// ============================================
// Project Types
// ============================================

export interface Project {
  id: string;
  alias: string;
  paths: string[];
  ide: IDE;
  createdAt: number;
  updatedAt: number;
}

export type IDE = "cursor" | "vscode" | "webstorm" | "idea" | "zed" | "sublime" | "atom";

// ============================================
// Git Types
// ============================================

export interface GitStatus {
  isGitRepo: boolean;
  branch?: string;
  hasChanges?: boolean;
  ahead?: number;
  behind?: number;
}

// ============================================
// IDE Types
// ============================================

export interface IDEConfig {
  name: string;
  bundleId: string;
  icon: string;
  cliCommand: string;
}

// ============================================
// Component Props Types
// ============================================

export interface ProjectWithStatus extends Project {
  gitStatus: GitStatus | null;
}

export interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
}

// ============================================
// Launch Context Types
// ============================================

export interface OpenProjectContext {
  projectId: string;
}
