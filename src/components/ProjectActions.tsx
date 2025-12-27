import { ActionPanel, Action, Icon, confirmAlert, Alert } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import { IDE_CONFIGS, SHORTCUTS } from "../constants";
import { openProjectWithToast } from "../lib/ide";
import { createProjectDeeplink } from "../utils/deeplink";
import ProjectForm from "./ProjectForm";

// ============================================
// ProjectActions Component
// ============================================

interface ProjectActionsProps {
  project: Project | ProjectWithStatus;
  onRefresh: () => void;
  onDelete: (project: Project) => Promise<boolean>;
}

export default function ProjectActions({ project, onRefresh, onDelete }: ProjectActionsProps) {
  const handleOpen = async () => {
    await openProjectWithToast(project);
  };

  const handleDelete = async () => {
    const confirmed = await confirmAlert({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.alias}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await onDelete(project);
    }
  };

  return (
    <ActionPanel>
      {/* Primary Action */}
      <ActionPanel.Section>
        <Action
          icon={Icon.ArrowRight}
          title={`Open in ${IDE_CONFIGS[project.ide].name}`}
          onAction={handleOpen}
        />
      </ActionPanel.Section>

      {/* CRUD Actions */}
      <ActionPanel.Section>
        <Action.Push
          icon={Icon.Plus}
          title="Add Project"
          shortcut={SHORTCUTS.ADD_PROJECT as any}
          target={<ProjectForm onSave={onRefresh} />}
        />
        <Action.Push
          icon={Icon.Pencil}
          title="Edit Project"
          shortcut={SHORTCUTS.EDIT_PROJECT as any}
          target={<ProjectForm project={project} onSave={onRefresh} />}
        />
        <Action
          icon={Icon.Trash}
          title="Delete Project"
          style={Action.Style.Destructive}
          shortcut={SHORTCUTS.DELETE_PROJECT as any}
          onAction={handleDelete}
        />
      </ActionPanel.Section>

      {/* Quicklink */}
      <ActionPanel.Section>
        <Action.CreateQuicklink
          title="Create Quicklink"
          shortcut={SHORTCUTS.CREATE_QUICKLINK as any}
          quicklink={{
            name: project.alias,
            link: createProjectDeeplink(project.id),
          }}
        />
      </ActionPanel.Section>

      {/* Utility Actions */}
      <ActionPanel.Section>
        <Action.ShowInFinder
          path={project.paths[0]}
          shortcut={SHORTCUTS.SHOW_IN_FINDER as any}
        />
        <Action.CopyToClipboard
          title="Copy Path"
          content={project.paths.join("\n")}
          shortcut={SHORTCUTS.COPY_PATH as any}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
