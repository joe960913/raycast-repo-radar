import { useState, useEffect, useCallback } from "react";
import { showToast, Toast } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import {
  getProjects,
  deleteProject as removeProject,
  toggleFavorite as toggleFavoriteStorage,
  getGroups as getGroupsStorage,
} from "../lib/storage";
import { getCombinedGitStatus } from "../lib/git";

// ============================================
// Sorting Logic
// ============================================

function sortProjects<T extends Project>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    // 1. Favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // 2. Recently opened
    const aOpened = a.lastOpenedAt || 0;
    const bOpened = b.lastOpenedAt || 0;
    if (aOpened !== bOpened) return bOpened - aOpened;

    // 3. By creation date (newest first)
    return b.createdAt - a.createdAt;
  });
}

// ============================================
// useProjects Hook
// ============================================

interface UseProjectsReturn {
  projects: ProjectWithStatus[];
  groups: string[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  deleteProject: (project: Project) => Promise<boolean>;
  toggleFavorite: (project: Project) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithStatus[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedProjects = await getProjects();
      const storedGroups = await getGroupsStorage();

      const projectsWithStatus: ProjectWithStatus[] = storedProjects.map((project) => ({
        ...project,
        gitStatus: getCombinedGitStatus(project.paths),
      }));

      setProjects(sortProjects(projectsWithStatus));
      setGroups(storedGroups);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to load projects",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (project: Project): Promise<boolean> => {
    const success = await removeProject(project.id);
    if (success) {
      await loadProjects();
      await showToast({
        style: Toast.Style.Success,
        title: "Project deleted",
        message: project.alias,
      });
    }
    return success;
  }, [loadProjects]);

  const toggleFavorite = useCallback(async (project: Project): Promise<void> => {
    const isFavorite = await toggleFavoriteStorage(project.id);
    await loadProjects();
    await showToast({
      style: Toast.Style.Success,
      title: isFavorite ? "Added to favorites" : "Removed from favorites",
      message: project.alias,
    });
  }, [loadProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    groups,
    isLoading,
    refresh: loadProjects,
    deleteProject,
    toggleFavorite,
  };
}

// ============================================
// useProjectsSimple Hook (without git status)
// ============================================

interface UseProjectsSimpleReturn {
  projects: Project[];
  groups: string[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  deleteProject: (project: Project) => Promise<boolean>;
  toggleFavorite: (project: Project) => Promise<void>;
}

export function useProjectsSimple(): UseProjectsSimpleReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedProjects = await getProjects();
      const storedGroups = await getGroupsStorage();
      setProjects(sortProjects(storedProjects));
      setGroups(storedGroups);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to load projects",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (project: Project): Promise<boolean> => {
    const success = await removeProject(project.id);
    if (success) {
      await loadProjects();
      await showToast({
        style: Toast.Style.Success,
        title: "Project deleted",
        message: project.alias,
      });
    }
    return success;
  }, [loadProjects]);

  const toggleFavorite = useCallback(async (project: Project): Promise<void> => {
    const isFavorite = await toggleFavoriteStorage(project.id);
    await loadProjects();
    await showToast({
      style: Toast.Style.Success,
      title: isFavorite ? "Added to favorites" : "Removed from favorites",
      message: project.alias,
    });
  }, [loadProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    groups,
    isLoading,
    refresh: loadProjects,
    deleteProject,
    toggleFavorite,
  };
}
