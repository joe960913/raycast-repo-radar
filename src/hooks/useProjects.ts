import { useState, useEffect, useCallback } from "react";
import { showToast, Toast } from "@raycast/api";
import { Project, ProjectWithStatus } from "../types";
import { getProjects, deleteProject as removeProject } from "../lib/storage";
import { getCombinedGitStatus } from "../lib/git";

// ============================================
// useProjects Hook
// ============================================

interface UseProjectsReturn {
  projects: ProjectWithStatus[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  deleteProject: (project: Project) => Promise<boolean>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedProjects = await getProjects();

      const projectsWithStatus: ProjectWithStatus[] = storedProjects.map((project) => ({
        ...project,
        gitStatus: getCombinedGitStatus(project.paths),
      }));

      setProjects(projectsWithStatus);
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

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    refresh: loadProjects,
    deleteProject,
  };
}

// ============================================
// useProjectsSimple Hook (without git status)
// ============================================

interface UseProjectsSimpleReturn {
  projects: Project[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  deleteProject: (project: Project) => Promise<boolean>;
}

export function useProjectsSimple(): UseProjectsSimpleReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedProjects = await getProjects();
      setProjects(storedProjects);
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

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    refresh: loadProjects,
    deleteProject,
  };
}
