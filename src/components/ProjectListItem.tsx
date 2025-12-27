import { List, Icon, Color } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import { IDE_CONFIGS } from "../constants";
import ProjectActions from "./ProjectActions";

// ============================================
// ProjectListItem Component
// ============================================

interface ProjectListItemProps {
  project: ProjectWithStatus;
  onRefresh: () => void;
  onDelete: (project: Project) => Promise<boolean>;
}

export default function ProjectListItem({ project, onRefresh, onDelete }: ProjectListItemProps) {
  return (
    <List.Item
      key={project.id}
      icon={Icon.Folder}
      title={project.alias}
      subtitle={project.paths[0]}
      accessories={getAccessories(project)}
      actions={
        <ProjectActions
          project={project}
          onRefresh={onRefresh}
          onDelete={onDelete}
        />
      }
    />
  );
}

// ============================================
// Helper Functions
// ============================================

function getAccessories(project: ProjectWithStatus): List.Item.Accessory[] {
  const accessories: List.Item.Accessory[] = [];

  // IDE tag
  accessories.push({
    tag: { value: IDE_CONFIGS[project.ide].name, color: Color.Blue },
  });

  // Path count
  if (project.paths.length > 1) {
    accessories.push({
      text: `${project.paths.length} paths`,
      icon: Icon.Folder,
    });
  }

  // Git status
  if (project.gitStatus?.isGitRepo) {
    if (project.gitStatus.branch) {
      accessories.push({
        tag: { value: project.gitStatus.branch, color: Color.Purple },
        icon: Icon.Code,
      });
    }

    if (project.gitStatus.hasChanges) {
      accessories.push({
        icon: { source: Icon.Circle, tintColor: Color.Orange },
        tooltip: "Uncommitted changes",
      });
    }
  }

  return accessories;
}
