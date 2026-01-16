# Email Template Builder

<div align="left">

**Visual Email Builder** — Tiptap × React Email × Next.js

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-000000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Email](https://img.shields.io/badge/React_Email-1.0-white?style=for-the-badge&logo=react&logoColor=black)](https://react.email/)
[![MIT License](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)

</div>

> A drag-and-drop email builder that combines **Tiptap** for rich-text editing with **React Email** for generating cross-client compatible HTML. Build beautiful, responsive emails visually—export as HTML or reusable React Email templates.

## Features

| **Core**                               | **Export**                      |
| :------------------------------------- | :------------------------------ |
| Visual block editor with drag-and-drop | HTML file for any email service |
| Rich text editing powered by Tiptap    | React Email `.tsx` templates    |
| Dark mode preview                      |                                 |
| Design system support                  |                                 |
| Undo/redo with keyboard shortcuts      |                                 |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

Integration of Tiptap with React Email using the Static Renderer:

```
User Edits in Tiptap
        │
        ▼
TiptapEditor → editor.getJSON() → JSONContent stored
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
   Canvas Preview                    Email Export
   @tiptap/html                      @tiptap/static-renderer
   → HTML for display                → React Email components
                                     → render() → .html
```

| Layer       | Technology                            | Purpose                                   |
| :---------- | :------------------------------------ | :---------------------------------------- |
| **Editing** | Tiptap                                | WYSIWYG rich-text editor with JSON output |
| **Preview** | @tiptap/html                          | Convert JSON → HTML for canvas display    |
| **Export**  | @tiptap/static-renderer + React Email | Map Tiptap nodes → React Email components |

## Block Types

| Block            | Description                        |
| :--------------- | :--------------------------------- |
| **Heading**      | H1/H2/H3 with alignment and color  |
| **Text**         | Paragraph with full formatting     |
| **Image**        | Images with src, alt, dimensions   |
| **Button**       | CTA buttons with links and styling |
| **Header**       | Brand header with logo             |
| **Columns**      | 2 or 3 column layouts              |
| **Divider**      | Horizontal rules                   |
| **Spacer**       | Vertical spacing                   |
| **Social Links** | Social media icons                 |
| **Footer**       | Footer text with formatting        |

## Tech Stack

| Frontend       | Editor                  | Email           |
| :------------- | :---------------------- | :-------------- |
| Next.js 16     | Tiptap 3.15             | React Email 1.0 |
| Radix UI       | @tiptap/static-renderer |                 |
| Tailwind CSS 4 |                         |                 |

## Roadmap

### Completed

- [x] Dark mode support for templates and blocks
- [x] Design systems picker fix

### In Progress

- [ ] Move project to pnpm
- [ ] Create tiptap-to-react-email package
- [ ] Add auth and database for persistent data
- [ ] Add canvas support
- [ ] Add react drag for dragging blocks
- [ ] Add output format preview (HTML, React Email, etc.)
- [ ] Multiple export formats (PDF, SVG, image, HTML, React Email)
- [ ] Keyboard shortcuts (delete key to remove blocks)
- [ ] All 18 React Email blocks support
- [ ] Proper email widths according to standards
- [ ] OG tags for metadata/thumbnails
- [ ] SVG animations for better UX
- [ ] Real font and asset management
- [ ] Auto design system maker (similar to new.email)
- [ ] Fix Column block behavior

### Planned

- [ ] Template gallery from community
- [ ] Email strategizer/mapper (AI-powered template generation)
- [ ] Multiple languages support (i18n)
- [ ] Auto brand/kit design system configuration
- [ ] Multiple template designs in one shot
- [ ] Template branching/duplication/variants
- [ ] Advanced templates (carousels, GIF animations)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
