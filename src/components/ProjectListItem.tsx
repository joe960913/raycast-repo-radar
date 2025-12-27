import { List } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import { Icons } from "../constants";
import ProjectActions from "./ProjectActions";

// ============================================
// ProjectListItem Component
// ============================================

interface ProjectListItemProps {
  project: ProjectWithStatus;
  groups: string[];
  onRefresh: () => void;
  onDelete: (project: Project) => Promise<boolean>;
  onToggleFavorite: (project: Project) => Promise<void>;
}

export default function ProjectListItem({
  project,
  groups,
  onRefresh,
  onDelete,
  onToggleFavorite,
}: ProjectListItemProps) {
  const subtitle = formatSubtitle(project);
  const keywords = [project.alias, project.app.name, project.group, ...project.paths].filter(
    Boolean
  ) as string[];

  return (
    <List.Item
      key={project.id}
      icon={{ fileIcon: project.app.path }}
      title={project.alias}
      subtitle={subtitle}
      keywords={keywords}
      accessories={getAccessories(project)}
      actions={
        <ProjectActions
          project={project}
          groups={groups}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      }
    />
  );
}

// ============================================
// Helper Functions
// ============================================

function formatSubtitle(project: ProjectWithStatus): string {
  const pathName = project.paths[0].split("/").pop() || project.paths[0];
  return pathName;
}

function getAccessories(project: ProjectWithStatus): List.Item.Accessory[] {
  const accessories: List.Item.Accessory[] = [];

  // Favorite indicator
  if (project.isFavorite) {
    accessories.push({
      icon: Icons.StarFilled,
      tooltip: "Favorite",
    });
  }

  // Group tag
  if (project.group) {
    accessories.push({
      icon: Icons.Folder,
      text: project.group,
      tooltip: `Group: ${project.group}`,
    });
  }

  // Git status (if git repo)
  if (project.gitStatus?.isGitRepo && project.gitStatus.branch) {
    const { branch, ahead, behind, hasChanges } = project.gitStatus;

    // Build branch text with ahead/behind info
    let branchText = branch;
    const syncParts: string[] = [];

    if (ahead && ahead > 0) {
      syncParts.push(`↑${ahead}`);
    }
    if (behind && behind > 0) {
      syncParts.push(`↓${behind}`);
    }

    if (syncParts.length > 0) {
      branchText = `${branch} ${syncParts.join(" ")}`;
    }

    // Build tooltip
    const tooltipParts = [`Branch: ${branch}`];
    if (ahead && ahead > 0) {
      tooltipParts.push(`${ahead} ahead`);
    }
    if (behind && behind > 0) {
      tooltipParts.push(`${behind} behind`);
    }
    if (hasChanges) {
      tooltipParts.push("Uncommitted changes");
    }

    accessories.push({
      icon: hasChanges ? Icons.GitDiff : Icons.GitBranch,
      text: branchText,
      tooltip: tooltipParts.join(" | "),
    });
  }

  // Path count (if multiple)
  if (project.paths.length > 1) {
    accessories.push({
      text: `${project.paths.length}`,
      icon: Icons.FolderOpen,
      tooltip: `${project.paths.length} paths`,
    });
  }

  return accessories;
}
