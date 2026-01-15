import { render } from "@react-email/render";
import { generateHTML } from "@tiptap/html";
import { EmailTemplate } from "./email-template";
import { emailEditorExtensions } from "./tiptap-extensions";
import type { EmailDocument, EmailBlock } from "@/types/email-builder";

/**
 * Renders an EmailDocument to email-client-compatible HTML using React Email
 */
export async function renderEmailToHtml(
  document: EmailDocument
): Promise<string> {
  const html = await render(<EmailTemplate document={document} />);
  return html;
}

/**
 * Generates React Email template code (TSX) from an EmailDocument
 */
export function generateEmailTemplateCode(document: EmailDocument): string {
  const blocks = document.blocks
    .map((block) => generateBlockCode(block))
    .join("\n        ");

  return `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Img,
  Hr,
  Link,
  Preview,
} from "@react-email/components"

export function EmailTemplate() {
  return (
    <Html lang="en">
      <Head />
      ${document.settings.previewText ? `<Preview>${escapeJsx(document.settings.previewText)}</Preview>` : ""}
      <Body
        style={{
          backgroundColor: "${document.settings.backgroundColor}",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: ${document.settings.contentWidth},
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 24,
          }}
        >
        ${blocks}
        </Container>
      </Body>
    </Html>
  )
}

export default EmailTemplate
`;
}

function generateBlockCode(block: EmailBlock): string {
  switch (block.type) {
    case "heading":
      const headingHtml = generateHTML(block.content, emailEditorExtensions);
      return `<Text
          style={{
            fontSize: ${block.level === 1 ? 30 : block.level === 2 ? 24 : 20},
            fontWeight: "bold",
            color: "${block.color}",
            textAlign: "${block.align}",
            margin: "0 0 16px 0",
          }}
        >
          ${escapeJsx(headingHtml)}
        </Text>`;

    case "text":
      const textHtml = generateHTML(block.content, emailEditorExtensions);
      return `<Text
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "${block.color}",
            textAlign: "${block.align}",
            margin: "0 0 16px 0",
          }}
        >
          ${escapeJsx(textHtml)}
        </Text>`;

    case "image":
      if (!block.src) {
        return `<Section style={{ textAlign: "${block.align}", marginBottom: 16 }}>
          <div
            style={{
              width: ${block.width},
              height: ${block.height},
              backgroundColor: "#f3f4f6",
              borderRadius: 4,
              display: "inline-block",
            }}
          />
        </Section>`;
      }
      return `<Section style={{ textAlign: "${block.align}", marginBottom: 16 }}>
          <Img
            src="${escapeJsx(block.src)}"
            alt="${escapeJsx(block.alt)}"
            width={${block.width}}
            style={{
              borderRadius: 4,
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Section>`;

    case "button":
      return `<Section style={{ textAlign: "${block.align}", marginBottom: 16 }}>
          <Button
            href="${escapeJsx(block.url)}"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 500,
              color: "${block.textColor}",
              backgroundColor: "${block.backgroundColor}",
              textDecoration: "none",
              borderRadius: ${block.borderRadius},
            }}
          >
            ${escapeJsx(block.text)}
          </Button>
        </Section>`;

    case "header":
      return `<Section style={{ marginBottom: 16 }}>
          <Row>
            <Column style={{ width: 52 }}>
              ${
                block.logoSrc
                  ? `<Img
                src="${escapeJsx(block.logoSrc)}"
                alt="${escapeJsx(block.brandName)}"
                width={40}
                height={40}
                style={{ borderRadius: 4, objectFit: "cover" }}
              />`
                  : `<div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 4,
                }}
              />`
              }
            </Column>
            <Column style={{ paddingLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                }}
              >
                ${escapeJsx(block.brandName)}
              </Text>
            </Column>
          </Row>
        </Section>`;

    case "columns":
      const columns = block.content
        .map(
          (_, index) => `<Column
              style={{
                padding: 16,
                border: "2px dashed #e5e7eb",
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <Text style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                Column ${index + 1}
              </Text>
            </Column>`
        )
        .join("\n            ");
      return `<Section style={{ marginBottom: 16 }}>
          <Row>
            ${columns}
          </Row>
        </Section>`;

    case "divider":
      return `<Hr
          style={{
            border: "none",
            borderTop: "${block.thickness}px ${block.style} ${block.color}",
            margin: "0 0 16px 0",
          }}
        />`;

    case "spacer":
      return `<Section style={{ height: ${block.height} }}>
          <Text style={{ margin: 0, fontSize: 0, lineHeight: 0 }}>&nbsp;</Text>
        </Section>`;

    case "social-links":
      const links = block.links
        .map(
          (link) => `<Column style={{ width: "auto", padding: "0 8px" }}>
              <Link
                href="${escapeJsx(link.url)}"
                style={{
                  display: "inline-block",
                  width: ${block.iconSize + 16},
                  height: ${block.iconSize + 16},
                  backgroundColor: "#f3f4f6",
                  borderRadius: 4,
                  textAlign: "center",
                  lineHeight: "${block.iconSize + 16}px",
                  color: "#6b7280",
                }}
              >
                {/* ${link.platform} icon */}
              </Link>
            </Column>`
        )
        .join("\n            ");
      return `<Section style={{ textAlign: "${block.align}", marginBottom: 16 }}>
          <Row>
            ${links}
          </Row>
        </Section>`;

    case "footer":
      const footerHtml = generateHTML(block.content, emailEditorExtensions);
      return `<Text
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "${block.color}",
            textAlign: "${block.align}",
            margin: "0 0 16px 0",
          }}
        >
          ${escapeJsx(footerHtml)}
        </Text>`;

    default:
      return "";
  }
}

function escapeJsx(str: string): string {
  return str.replace(/[{}<>]/g, (char) => {
    switch (char) {
      case "{":
        return "&#123;";
      case "}":
        return "&#125;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return char;
    }
  });
}
