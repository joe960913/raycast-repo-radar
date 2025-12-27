import { ActionPanel, Action, List, confirmAlert, Alert } from "@raycast/api";
import { useProjectsSimple } from "./hooks/useProjects";
import { ProjectForm } from "./components";
import { SHORTCUTS, Icons } from "./constants";
import { Project } from "./types";

// ============================================
// Manage Projects Command
// ============================================

export default function ManageProjects() {
  const { projects, groups, isLoading, refresh, deleteProject, toggleFavorite } = useProjectsSimple();

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

  const handleToggleFavorite = async (project: Project) => {
    await toggleFavorite(project);
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects..."
    >
      {projects.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icons.Document}
          title="No Projects"
          description="Add your first project to get started"
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icons.Plus}
                title="Add Project"
                shortcut={SHORTCUTS.ADD_PROJECT as any}
                target={<ProjectForm groups={groups} onSave={refresh} />}
              />
            </ActionPanel>
          }
        />
      ) : (
        projects.map((project) => (
          <List.Item
            key={project.id}
            icon={{ fileIcon: project.app.path }}
            title={project.alias}
            subtitle={project.paths[0].split("/").pop()}
            keywords={[project.alias, project.app.name, project.group, ...project.paths].filter(Boolean) as string[]}
            accessories={[
              project.isFavorite ? { icon: Icons.StarFilled, tooltip: "Favorite" } : null,
              project.group ? { icon: Icons.Folder, text: project.group } : null,
              project.paths.length > 1
                ? { text: `${project.paths.length}`, icon: Icons.FolderOpen, tooltip: `${project.paths.length} paths` }
                : null,
            ].filter(Boolean) as List.Item.Accessory[]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.Push
                    icon={Icons.Pencil}
                    title="Edit Project"
                    target={<ProjectForm project={project} groups={groups} onSave={refresh} />}
                  />
                  <Action
                    icon={project.isFavorite ? Icons.Star : Icons.StarFilled}
                    title={project.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    shortcut={SHORTCUTS.TOGGLE_FAVORITE as any}
                    onAction={() => handleToggleFavorite(project)}
                  />
                  <Action.Push
                    icon={Icons.Plus}
                    title="Add Project"
                    shortcut={SHORTCUTS.ADD_PROJECT as any}
                    target={<ProjectForm groups={groups} onSave={refresh} />}
                  />
                </ActionPanel.Section>

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

                <ActionPanel.Section>
                  <Action
                    icon={Icons.Trash}
                    title="Delete Project"
                    style={Action.Style.Destructive}
                    shortcut={SHORTCUTS.DELETE_PROJECT as any}
                    onAction={() => handleDelete(project)}
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
