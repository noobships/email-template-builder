import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Img,
  Hr,
  Link,
  Preview,
} from "@react-email/components";
import type {
  EmailDocument,
  EmailBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  HeaderBlock,
  ColumnsBlock,
  DividerBlock,
  SpacerBlock,
  SocialLinksBlock,
  FooterBlock,
} from "@/types/email-builder";
import { renderTiptapToReactEmail } from "./tiptap-react-email-renderer";

interface EmailTemplateProps {
  document: EmailDocument;
}

export function EmailTemplate({ document }: EmailTemplateProps) {
  return (
    <Html lang="en">
      <Head />
      {document.settings.previewText && (
        <Preview>{document.settings.previewText}</Preview>
      )}
      <Body
        style={{
          backgroundColor: document.settings.backgroundColor,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: document.settings.contentWidth,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 24,
          }}
        >
          {document.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </Container>
      </Body>
    </Html>
  );
}

function BlockRenderer({ block }: { block: EmailBlock }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlockRenderer block={block} />;
    case "text":
      return <TextBlockRenderer block={block} />;
    case "image":
      return <ImageBlockRenderer block={block} />;
    case "button":
      return <ButtonBlockRenderer block={block} />;
    case "header":
      return <HeaderBlockRenderer block={block} />;
    case "columns":
      return <ColumnsBlockRenderer block={block} />;
    case "divider":
      return <DividerBlockRenderer block={block} />;
    case "spacer":
      return <SpacerBlockRenderer block={block} />;
    case "social-links":
      return <SocialLinksBlockRenderer block={block} />;
    case "footer":
      return <FooterBlockRenderer block={block} />;
    default:
      return null;
  }
}

function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const fontSize = block.level === 1 ? 30 : block.level === 2 ? 24 : 20;

  return (
    <Section style={{ marginBottom: 16 }}>
      {renderTiptapToReactEmail(block.content, {
        textColor: block.color,
        textAlign: block.align,
        fontSize,
      })}
    </Section>
  );
}

function TextBlockRenderer({ block }: { block: TextBlock }) {
  return (
    <Section style={{ marginBottom: 16 }}>
      {renderTiptapToReactEmail(block.content, {
        textColor: block.color,
        textAlign: block.align,
      })}
    </Section>
  );
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  if (!block.src) {
    return (
      <Section style={{ textAlign: block.align, marginBottom: 16 }}>
        <div
          style={{
            width: block.width,
            height: block.height,
            backgroundColor: "#f3f4f6",
            borderRadius: 4,
            display: "inline-block",
          }}
        />
      </Section>
    );
  }

  return (
    <Section style={{ textAlign: block.align, marginBottom: 16 }}>
      <Img
        src={block.src}
        alt={block.alt}
        width={block.width}
        style={{
          borderRadius: 4,
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </Section>
  );
}

function ButtonBlockRenderer({ block }: { block: ButtonBlock }) {
  return (
    <Section style={{ textAlign: block.align, marginBottom: 16 }}>
      <Button
        href={block.url}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 500,
          color: block.textColor,
          backgroundColor: block.backgroundColor,
          textDecoration: "none",
          borderRadius: block.borderRadius,
        }}
      >
        {block.text}
      </Button>
    </Section>
  );
}

function HeaderBlockRenderer({ block }: { block: HeaderBlock }) {
  return (
    <Section style={{ marginBottom: 16 }}>
      <Row>
        <Column style={{ width: 52 }}>
          {block.logoSrc ? (
            <Img
              src={block.logoSrc}
              alt={block.brandName}
              width={40}
              height={40}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#f3f4f6",
                borderRadius: 4,
              }}
            />
          )}
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
            {block.brandName}
          </Text>
        </Column>
        {block.showBadge && (
          <Column style={{ textAlign: "right" }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#06b6d4",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
          </Column>
        )}
      </Row>
    </Section>
  );
}

function ColumnsBlockRenderer({ block }: { block: ColumnsBlock }) {
  return (
    <Section style={{ marginBottom: 16 }}>
      <Row>
        {block.content.map((_, index) => (
          <Column
            key={index}
            style={{
              padding: 16,
              border: "2px dashed #e5e7eb",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Text style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              Column {index + 1}
            </Text>
          </Column>
        ))}
      </Row>
    </Section>
  );
}

function DividerBlockRenderer({ block }: { block: DividerBlock }) {
  return (
    <Hr
      style={{
        border: "none",
        borderTop: `${block.thickness}px ${block.style} ${block.color}`,
        margin: "0 0 16px 0",
      }}
    />
  );
}

function SpacerBlockRenderer({ block }: { block: SpacerBlock }) {
  return (
    <Section style={{ height: block.height }}>
      <Text style={{ margin: 0, fontSize: 0, lineHeight: 0 }}>&nbsp;</Text>
    </Section>
  );
}

const socialIcons: Record<string, string> = {
  twitter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  instagram: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  linkedin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  youtube: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

function SocialLinksBlockRenderer({ block }: { block: SocialLinksBlock }) {
  return (
    <Section style={{ textAlign: block.align, marginBottom: 16 }}>
      <Row>
        {block.links.map((link, index) => (
          <Column key={index} style={{ width: "auto", padding: "0 8px" }}>
            <Link
              href={link.url}
              style={{
                display: "inline-block",
                width: block.iconSize + 16,
                height: block.iconSize + 16,
                backgroundColor: "#f3f4f6",
                borderRadius: 4,
                textAlign: "center",
                lineHeight: `${block.iconSize + 16}px`,
                color: "#6b7280",
              }}
              dangerouslySetInnerHTML={{
                __html: socialIcons[link.platform] || "",
              }}
            />
          </Column>
        ))}
      </Row>
    </Section>
  );
}

function FooterBlockRenderer({ block }: { block: FooterBlock }) {
  return (
    <Section style={{ marginBottom: 16 }}>
      {renderTiptapToReactEmail(block.content, {
        textColor: block.color,
        textAlign: block.align,
        fontSize: 14,
      })}
    </Section>
  );
}
