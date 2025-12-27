import { ActionPanel, Action, List, Icon } from "@raycast/api";
import ProjectForm from "./ProjectForm";
import { SHORTCUTS } from "../constants";

// ============================================
// EmptyView Component
// ============================================

interface EmptyViewProps {
  onProjectAdded: () => void;
}

export default function EmptyView({ onProjectAdded }: EmptyViewProps) {
  return (
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
            target={<ProjectForm onSave={onProjectAdded} />}
          />
        </ActionPanel>
      }
    />
  );
}
