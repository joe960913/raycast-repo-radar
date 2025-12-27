import {
  ActionPanel,
  Action,
  Form,
  showToast,
  Toast,
  useNavigation,
  Icon,
} from "@raycast/api";
import { useState } from "react";
import { Project, IDE, ProjectFormProps } from "../types";
import { addProject, updateProject, isAliasExists } from "../lib/storage";
import { IDE_CONFIGS } from "../constants";

// ============================================
// Form Values Interface
// ============================================

interface FormValues {
  alias: string;
  paths: string[];
  ide: IDE;
}

// ============================================
// ProjectForm Component
// ============================================

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const { pop } = useNavigation();
  const [aliasError, setAliasError] = useState<string | undefined>();

  const isEditing = !!project;

  async function handleSubmit(values: FormValues) {
    // Validate alias
    if (!values.alias.trim()) {
      setAliasError("Alias is required");
      return;
    }

    // Check for duplicate alias
    const aliasExists = await isAliasExists(values.alias.trim(), project?.id);
    if (aliasExists) {
      setAliasError("This alias already exists");
      return;
    }

    // Validate paths
    if (!values.paths || values.paths.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        message: "Please select at least one path",
      });
      return;
    }

    try {
      if (isEditing && project) {
        await updateProject(project.id, {
          alias: values.alias.trim(),
          paths: values.paths,
          ide: values.ide,
        });
        await showToast({
          style: Toast.Style.Success,
          title: "Project updated",
          message: values.alias,
        });
      } else {
        await addProject({
          alias: values.alias.trim(),
          paths: values.paths,
          ide: values.ide,
        });
        await showToast({
          style: Toast.Style.Success,
          title: "Project added",
          message: values.alias,
        });
      }

      onSave();
      pop();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to save project",
        message: String(error),
      });
    }
  }

  function handleAliasChange() {
    if (aliasError) {
      setAliasError(undefined);
    }
  }

  return (
    <Form
      navigationTitle={isEditing ? "Edit Project" : "Add Project"}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={isEditing ? "Save Changes" : "Add Project"}
            icon={isEditing ? Icon.Check : Icon.Plus}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="alias"
        title="Alias"
        placeholder="e.g., abc, p2, frontend"
        info="A short name to quickly find and open this project"
        defaultValue={project?.alias}
        error={aliasError}
        onChange={handleAliasChange}
      />

      <Form.FilePicker
        id="paths"
        title="Project Paths"
        allowMultipleSelection
        canChooseDirectories
        canChooseFiles={false}
        info="Select one or more project folders"
        defaultValue={project?.paths}
      />

      <Form.Dropdown
        id="ide"
        title="IDE"
        info="Which IDE to open the project with"
        defaultValue={project?.ide || "cursor"}
      >
        {(Object.keys(IDE_CONFIGS) as IDE[]).map((ide) => (
          <Form.Dropdown.Item
            key={ide}
            value={ide}
            title={IDE_CONFIGS[ide].name}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
