import { LaunchProps, showToast, Toast } from "@raycast/api";
import { getProjectById } from "./lib/storage";
import { openProjectWithHUD } from "./lib/ide";
import { OpenProjectContext } from "./types";

// ============================================
// Open Project Command (No-View)
// ============================================

export default async function OpenProject(
  props: LaunchProps<{ launchContext: OpenProjectContext }>
) {
  const projectId = props.launchContext?.projectId;

  if (!projectId) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No project ID provided",
    });
    return;
  }

  const project = await getProjectById(projectId);

  if (!project) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Project not found",
      message: "The project may have been deleted",
    });
    return;
  }

  await openProjectWithHUD(project);
}
