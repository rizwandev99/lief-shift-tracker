# Agent Rules Standard (AGENTS.md)

## Table of Contents

- [Rule Organization](#rule-organization)
  - [Table of Contents Maintenance](#table-of-contents-maintenance)
  - [Rule Modification Policy](#rule-modification-policy)
  - [Categorization Requirement](#categorization-requirement)
- [Git Rules](#git-rules)
- [Context Management](#context-management)
  - [Auto-Context Creation and Maintenance](#auto-context-creation-and-maintenance)
  - [Initial Setup](#initial-setup)
  - [Maintenance Requirements](#maintenance-requirements)
  - [Update Triggers](#update-triggers)

## Rule Organization

### Table of Contents Maintenance

At the beginning of each interaction, generate and insert a table of contents at the top of AGENTS.md (immediately after the main title) to facilitate easy navigation. This table of contents should list all main sections (e.g., ## headings) and subsections (e.g., ### headings) with hyperlinks to their locations in the file. Automatically update and regenerate this table of contents whenever the contents of AGENTS.md are modified, ensuring it remains accurate and current. Use Markdown format for the table of contents, such as:

- [Section Name](#section-name)
- [Subsection Name](#subsection-name)

Ensure the table of contents is placed right after the file's title and before any other content. If no sections exist, include a placeholder note indicating that sections will be added.

### Rule Modification Policy

When instructed to change a rule, modify it in place only, without placing it above as a separate rule.

### Categorization Requirement

All rules must be grouped under specific categories, using consistent formatting only. these categories should be oredered on basis of priority and importance, for example if a specific category is important than it should be above the less important category.but all rules should be inside categories only.Basically, what i want is that you organize AGENTS.md file hierarchy wise, like if more important category is there it should be placed above and then see rules inside that and then sort these rules based on importance inside that category only, if like a rule is very important but it is in low important category, you have to sort inside that low important category only and not put that rule above all as it is very important above all as it is very important, you have to put inside that low important category only, i basically want hierarchy wise only.

## Git Rules

Whenever I tell you to git commit, commit both git_author_date and git_committer_date simultaneously. Always ask me for the date, message, and time to commit, then only commit after confirmation. Provide a proposed message, date, and time based on the changes in the current repo, and ask if I want any personal git_message, git date, or git time, or if I should commit with the proposed data only.

## Context Management

## Auto-Context Creation and Maintenance

AI agents **MUST** create and maintain a `context.md` file at the project root to prevent hallucination and context loss. This file serves as the project's memory system.

### Initial Setup

- Check if `context.md` exists at the project root.
- If not found, create it immediately with the following structure:

```markdown
# Project Context

## Project Overview

[Brief project description and purpose]

## Current Status

[What's currently being worked on]

## Key Decisions Made

[Important architectural/design decisions with reasoning]

## Active Issues & Solutions

[Current problems and their solutions/workarounds]

## Dependencies & Integrations

[External services, APIs, libraries being used]

## Development Notes

[Important implementation details, gotchas, patterns]

## Next Steps

[Planned features, improvements, refactoring]
```

### Maintenance Requirements

- Update `context.md` after every significant code change or decision.
- Add new sections as the project evolves.
- Remove outdated information but **keep decision history**.
- Always reference this file before making suggestions or changes.
- When answering questions, first check `context.md` for relevant information.

### Update Triggers

Update `context.md` when:

- New features are added.
- Architecture changes are made.
- Dependencies are modified.
- Bugs are fixed (document the solution).
- Configuration changes occur.
- Integration points are established.

You have to ensure **consistent, informed development** without losing project knowledge between sessions.

---
