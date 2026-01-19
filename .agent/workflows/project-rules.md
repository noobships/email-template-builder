---
description: Core project rules and skill usage guidelines for the email-template-builder
---

# Project Rules

These rules apply to ALL work in this repository. The agent MUST follow these automatically.

---

## 1. React Best Practices (MANDATORY)

Before writing, modifying, or reviewing ANY React/Next.js code:

1. Read `.agent/skills/vercel-react-best-practices/SKILL.md`
2. Apply the relevant rules from `.agent/skills/vercel-react-best-practices/rules/`
3. Assess existing code against these best practices when debugging or refactoring

**Trigger**: Any task involving React components, Next.js pages, hooks, data fetching, or performance optimization.

---

## 2. Frontend Design Skill (MANDATORY)

For ALL UI/UX and frontend/design work:

1. Read `.agent/skills/frontend-design/SKILL.md`
2. Follow its design principles and implementation patterns
3. Ensure visual excellence and modern aesthetics

**Trigger**: Any task involving UI components, styling, design systems, layouts, or visual elements.

---

## 3. Documentation Reference

Before implementing features or fixing bugs:

1. Check the `docs/` folder for relevant documentation
2. Reference appropriate docs when the task involves specific libraries or patterns

---

## 4. Package Awareness

At the start of any coding session:

1. Read `package.json` to understand installed dependencies
2. Use existing packages instead of installing new ones when possible
3. Check version compatibility before suggesting new packages

---

## Checklist for Every Task

- [ ] Read `package.json` for dependency context
- [ ] Check `docs/` for relevant documentation
- [ ] Apply React best practices skill for any React/Next.js code
- [ ] Apply frontend-design skill for any UI/UX work
- [ ] Validate changes against established patterns in the codebase
