# Repo Radar

A Raycast extension for lightning-fast project switching. Create custom aliases for your projects and open them instantly in your preferred IDE with Git status insights.

## Features

- **Custom Aliases** - Name your projects anything you want (`abc`, `p2`, `frontend`) for instant access
- **Multi-Path Support** - Open multiple folders in one IDE window as a multi-root workspace
- **IDE Flexibility** - Choose your IDE per project: Cursor, VS Code, WebStorm, IntelliJ IDEA, Zed, Sublime Text, Atom
- **Git Insights** - See current branch and uncommitted changes at a glance
- **Quicklinks** - Create Raycast quicklinks to open projects directly from root search

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to start development mode
4. The extension will appear in Raycast

## Usage

### Adding a Project

1. Open "Search Projects" command in Raycast
2. Press `Cmd+N` to add a new project
3. Enter an alias (e.g., `myapp`)
4. Select one or more project folders
5. Choose your preferred IDE

### Opening a Project

- Open "Search Projects" and type your alias, then press `Enter`
- Or create a Quicklink (`Cmd+Shift+Q`) to access directly from Raycast root search

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Open project in IDE |
| `Cmd+N` | Add new project |
| `Cmd+E` | Edit project |
| `Cmd+Backspace` | Delete project |
| `Cmd+Shift+Q` | Create Quicklink |
| `Cmd+F` | Show in Finder |
| `Cmd+Shift+C` | Copy path |

## Project Structure

```
src/
├── components/          # UI components
├── constants/           # IDE configs, shortcuts
├── hooks/               # React hooks
├── lib/                 # Core logic (storage, git, ide)
├── types/               # TypeScript types
├── utils/               # Utility functions
└── *.tsx                # Command entry points
```

## Supported IDEs

- Cursor
- Visual Studio Code
- WebStorm
- IntelliJ IDEA
- Zed
- Sublime Text
- Atom

## Requirements

- macOS
- Raycast
- IDE CLI tools installed (e.g., `cursor`, `code` commands available in terminal)

## License

MIT
