import { List } from "@raycast/api";
import { useState } from "react";
import { useProjects } from "./hooks/useProjects";
import { ProjectListItem, EmptyView } from "./components";
import { ProjectWithStatus } from "./types";

// ============================================
// Search Projects Command
// ============================================

export default function SearchProjects() {
  const { projects, groups, isLoading, refresh, deleteProject, toggleFavorite } = useProjects();
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Filter projects by selected group
  const filteredProjects =
    selectedGroup === "all"
      ? projects
      : selectedGroup === "favorites"
        ? projects.filter((p) => p.isFavorite)
        : selectedGroup === "ungrouped"
          ? projects.filter((p) => !p.group)
          : projects.filter((p) => p.group === selectedGroup);

  // Group projects for sections
  const groupedProjects = groupProjectsByCategory(filteredProjects);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search projects..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter by group"
          value={selectedGroup}
          onChange={setSelectedGroup}
        >
          <List.Dropdown.Item title="All Projects" value="all" />
          <List.Dropdown.Item title="Favorites" value="favorites" />
          <List.Dropdown.Section title="Groups">
            {groups.map((group) => (
              <List.Dropdown.Item key={group} title={group} value={group} />
            ))}
            <List.Dropdown.Item title="Ungrouped" value="ungrouped" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {filteredProjects.length === 0 && !isLoading ? (
        <EmptyView groups={groups} onProjectAdded={refresh} />
      ) : (
        Object.entries(groupedProjects).map(([section, sectionProjects]) => (
          <List.Section key={section} title={section}>
            {sectionProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                groups={groups}
                onRefresh={refresh}
                onDelete={deleteProject}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </List.Section>
        ))
      )}
    </List>
  );
}

// ============================================
// Helper Functions
// ============================================

function groupProjectsByCategory(
  projects: ProjectWithStatus[]
): Record<string, ProjectWithStatus[]> {
  const result: Record<string, ProjectWithStatus[]> = {};

  // First, favorites
  const favorites = projects.filter((p) => p.isFavorite);
  if (favorites.length > 0) {
    result["Favorites"] = favorites;
  }

  // Then, group by group name
  const nonFavorites = projects.filter((p) => !p.isFavorite);
  const grouped = new Map<string, ProjectWithStatus[]>();

  for (const project of nonFavorites) {
    const groupName = project.group || "Ungrouped";
    if (!grouped.has(groupName)) {
      grouped.set(groupName, []);
    }
    grouped.get(groupName)!.push(project);
  }

  // Sort groups alphabetically, but put Ungrouped last
  const sortedGroups = [...grouped.keys()].sort((a, b) => {
    if (a === "Ungrouped") return 1;
    if (b === "Ungrouped") return -1;
    return a.localeCompare(b);
  });

  for (const groupName of sortedGroups) {
    result[groupName] = grouped.get(groupName)!;
  }

  return result;
}
