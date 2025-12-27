import { List } from "@raycast/api";
import { useProjects } from "./hooks/useProjects";
import { ProjectListItem, EmptyView } from "./components";

// ============================================
// Search Projects Command
// ============================================

export default function SearchProjects() {
  const { projects, isLoading, refresh, deleteProject } = useProjects();

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects by alias..."
    >
      {projects.length === 0 && !isLoading ? (
        <EmptyView onProjectAdded={refresh} />
      ) : (
        projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            onRefresh={refresh}
            onDelete={deleteProject}
          />
        ))
      )}
    </List>
  );
}
