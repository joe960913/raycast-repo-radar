import { showToast, Toast, showHUD } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { Project } from "../types";
import { IDE_CONFIGS } from "../constants";

const execAsync = promisify(exec);

// ============================================
// IDE Operations
// ============================================

export async function openProjectInIDE(project: Project): Promise<boolean> {
  const ideConfig = IDE_CONFIGS[project.ide];

  try {
    // Use CLI command to open all paths in one window (multi-root workspace)
    // Example: cursor path1 path2 path3
    const quotedPaths = project.paths.map((p) => `"${p}"`).join(" ");
    const command = `${ideConfig.cliCommand} ${quotedPaths}`;

    await execAsync(command);
    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to open project",
      message: String(error),
    });
    return false;
  }
}

export async function openProjectWithHUD(project: Project): Promise<void> {
  const ideConfig = IDE_CONFIGS[project.ide];
  const success = await openProjectInIDE(project);

  if (success) {
    await showHUD(`Opening ${project.alias} in ${ideConfig.name}`);
  }
}

export async function openProjectWithToast(project: Project): Promise<void> {
  const ideConfig = IDE_CONFIGS[project.ide];
  const success = await openProjectInIDE(project);

  if (success) {
    await showToast({
      style: Toast.Style.Success,
      title: `Opening in ${ideConfig.name}`,
      message: project.alias,
    });
  }
}
