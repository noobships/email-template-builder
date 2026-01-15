# Email Template Builder

A visual, drag-and-drop email builder that combines **Tiptap** for rich-text editing with **React Email** for generating cross-client compatible HTML.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React Email](https://img.shields.io/badge/React%20Email-1.0-purple)](https://react.email/)
[![Tiptap](https://img.shields.io/badge/Tiptap-3.15-orange)](https://tiptap.dev/)

---

## ✨ Features

- **Visual Block Editor** — Drag-and-drop blocks: headings, text, images, buttons, columns, dividers, social links, and footers
- **Rich Text Editing** — Full formatting toolbar (bold, italic, underline, links, lists) powered by Tiptap
- **Email-Safe Output** — All content rendered through React Email components for cross-client compatibility
- **Multiple Export Options** — Export as HTML or as a reusable React Email `.tsx` template
- **Dark Mode Preview** — Toggle between light/dark mode to preview how emails will render
- **Undo/Redo History** — Full editing history with keyboard shortcuts

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture

This project demonstrates the **proper integration** of Tiptap with React Email using the [Static Renderer](https://tiptap.dev/docs/editor/api/utilities/static-renderer).

### Why Static Renderer?

Instead of using `dangerouslySetInnerHTML` (which bypasses React Email's benefits), we use Tiptap's static renderer to map editor nodes directly to React Email components:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Edits in Tiptap                     │
│                                                             │
│   TiptapEditor → editor.getJSON() → JSONContent stored      │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────────┐
│     Canvas Preview      │    │      Email Export           │
│                         │    │                             │
│  generateHTML() from    │    │  renderTiptapToReactEmail() │
│  @tiptap/html           │    │  → React Email components   │
│  → dangerouslySetHTML   │    │  → render() → .html         │
└─────────────────────────┘    └─────────────────────────────┘
```

### Key Integration Points

| Layer       | Technology                              | Purpose                                   |
| ----------- | --------------------------------------- | ----------------------------------------- |
| **Editing** | Tiptap                                  | WYSIWYG rich-text editor with JSON output |
| **Preview** | `@tiptap/html`                          | Convert JSON → HTML for canvas display    |
| **Export**  | `@tiptap/static-renderer` + React Email | Map Tiptap nodes → React Email components |

---

## 📁 Project Structure

```
├── app/
│   └── page.tsx                        # Entry point
│
├── components/email-builder/           # Email builder UI
│   ├── email-builder.tsx               # Main component, state management
│   ├── header.tsx                      # Top bar: preview, export buttons
│   ├── elements-sidebar.tsx            # Left panel: block palette
│   ├── email-canvas.tsx                # Center: preview area
│   ├── block-renderer.tsx              # Renders blocks visually
│   ├── properties-panel.tsx            # Right panel: block settings
│   ├── tiptap-editor.tsx               # Rich text editor (Tiptap)
│   └── social-icon.tsx                 # Social media icons
│
├── lib/                                # Core utilities
│   ├── tiptap-extensions.ts            # Shared Tiptap extension config
│   ├── tiptap-react-email-renderer.tsx # Tiptap → React Email mapping
│   ├── email-template.tsx              # React Email template component
│   ├── email-renderer.tsx              # Export functions (HTML & .tsx)
│   ├── email-builder-utils.ts          # Block factory (createBlock)
│   └── utils.ts                        # General utilities
│
├── types/
│   └── email-builder.ts                # TypeScript types (uses JSONContent)
│
└── docs/tiptap/                        # Tiptap documentation reference
```

---

## 🔧 Key Files

### Tiptap + React Email Integration

| File                                                                         | Purpose                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`lib/tiptap-extensions.ts`](lib/tiptap-extensions.ts)                       | Shared extension config used by both editor and static renderer |
| [`lib/tiptap-react-email-renderer.tsx`](lib/tiptap-react-email-renderer.tsx) | Maps Tiptap nodes/marks to React Email components               |

```tsx
// Example: Mapping Tiptap paragraph → React Email Text
nodeMapping: {
  paragraph: ({ children }) => (
    <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
      {children}
    </Text>
  ),
}
```

### Editing Layer

| File                                                                | Purpose                                  |
| ------------------------------------------------------------------- | ---------------------------------------- |
| [`tiptap-editor.tsx`](components/email-builder/tiptap-editor.tsx)   | Rich text editor with formatting toolbar |
| [`block-renderer.tsx`](components/email-builder/block-renderer.tsx) | Visual preview of blocks in canvas       |

### Export Layer

| File                                           | Purpose                                                 |
| ---------------------------------------------- | ------------------------------------------------------- |
| [`email-template.tsx`](lib/email-template.tsx) | React Email component using static renderer             |
| [`email-renderer.tsx`](lib/email-renderer.tsx) | `renderEmailToHtml()` and `generateEmailTemplateCode()` |

---

## 📦 Block Types

| Block            | Description                       | Content Type              |
| ---------------- | --------------------------------- | ------------------------- |
| **Heading**      | H1/H2/H3 with alignment and color | `JSONContent` (rich text) |
| **Text**         | Paragraph with formatting         | `JSONContent` (rich text) |
| **Image**        | Image with src, alt, dimensions   | Static props              |
| **Button**       | CTA button with link and styling  | Static props              |
| **Header**       | Brand header with logo and name   | Static props              |
| **Columns**      | 2 or 3 column layout              | Container                 |
| **Divider**      | Horizontal rule with styling      | Static props              |
| **Spacer**       | Vertical spacing                  | Static props              |
| **Social Links** | Social media icon links           | Static props              |
| **Footer**       | Footer text with formatting       | `JSONContent` (rich text) |

---

## 📤 Export Options

| Button              | Output       | Use Case                               |
| ------------------- | ------------ | -------------------------------------- |
| **Export HTML**     | `.html` file | Send via ESP, paste into email service |
| **Export Template** | `.tsx` file  | Reusable React Email component         |

---

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org/)** — React framework with App Router
- **[Tiptap 3.15](https://tiptap.dev/)** — Headless rich-text editor
- **[React Email 1.0](https://react.email/)** — Email-compatible React components
- **[@tiptap/static-renderer](https://tiptap.dev/docs/editor/api/utilities/static-renderer)** — Render Tiptap JSON to React
- **[Radix UI](https://www.radix-ui.com/)** — Accessible UI primitives
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type safety

---

## 📚 Documentation

Tiptap documentation is included locally in [`docs/tiptap/`](docs/tiptap/) for LLM context. Key references:

- [Static Renderer](docs/tiptap/api/utilities/static-renderer.md) — Core integration technique
- [Persistence](docs/tiptap/core-concepts/persistance.md) — Why JSON over HTML
- [Extensions](docs/tiptap/core-concepts/extensions.md) — How Tiptap extensions work

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. Code passes TypeScript checks: `npx tsc --noEmit`
2. Code passes linting: `npx oxlint .`
3. Build succeeds: `npm run build`

---

## 📄 License

MIT
