# GitHub README Design

## Goal

Create a concise Chinese README that explains the project's frontend framework and engineering setup, rather than describing the blog's identity, articles, or user-facing features.

## Scope

The README will cover:

- The framework and build stack: React 19, TypeScript, Vite, and Tailwind CSS 4.
- Supporting libraries visible in the dependency manifest, including Lucide React and React Markdown.
- The responsibilities of the main source directories and build configuration.
- The commands for installing dependencies, starting the development server, and creating a production build.

The README will not include a blog introduction, article or music editing guide, deployment instructions, or claims about unconfigured tests and services.

## Technical Accuracy

The project uses Vite with the React and Tailwind CSS plugins, plus `vite-plugin-singlefile` for single-file builds. The project structure and command names will be verified against the repository before writing the README.

## Output

Update the existing root `README.md` as UTF-8 Markdown. Do not modify unrelated project files or stage existing workspace changes.
