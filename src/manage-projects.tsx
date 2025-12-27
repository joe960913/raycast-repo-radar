import { ActionPanel, Action, List, Icon, Color, confirmAlert, Alert } from "@raycast/api";
import { useProjectsSimple } from "./hooks/useProjects";
import { ProjectForm } from "./components";
import { IDE_CONFIGS, SHORTCUTS } from "./constants";
import { Project } from "./types";

// ============================================
// Manage Projects Command
// ============================================

export default function ManageProjects() {
  const { projects, isLoading, refresh, deleteProject } = useProjectsSimple();

  const handleDelete = async (project: Project) => {
    const confirmed = await confirmAlert({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.alias}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await deleteProject(project);
    }
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects to manage..."
    >
      {projects.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Folder}
          title="No Projects Yet"
          description="Press Cmd+N to add your first project"
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icon.Plus}
                title="Add Project"
                shortcut={SHORTCUTS.ADD_PROJECT as any}
                target={<ProjectForm onSave={refresh} />}
              />
            </ActionPanel>
          }
        />
      ) : (
        projects.map((project) => (
          <List.Item
            key={project.id}
            icon={Icon.Folder}
            title={project.alias}
            subtitle={project.paths.join(", ")}
            accessories={[
              { tag: { value: IDE_CONFIGS[project.ide].name, color: Color.Blue } },
              { text: `${project.paths.length} path${project.paths.length > 1 ? "s" : ""}` },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.Push
                    icon={Icon.Pencil}
                    title="Edit Project"
                    target={<ProjectForm project={project} onSave={refresh} />}
                  />
                  <Action.Push
                    icon={Icon.Plus}
                    title="Add Project"
                    shortcut={SHORTCUTS.ADD_PROJECT as any}
                    target={<ProjectForm onSave={refresh} />}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action
                    icon={Icon.Trash}
                    title="Delete Project"
                    style={Action.Style.Destructive}
                    shortcut={SHORTCUTS.DELETE_PROJECT as any}
                    onAction={() => handleDelete(project)}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action.ShowInFinder
                    path={project.paths[0]}
                    shortcut={SHORTCUTS.SHOW_IN_FINDER as any}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
