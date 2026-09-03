import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Paperclip,
  Undo,
  Redo,
  Strikethrough,
  Quote,
  Code,
} from "lucide-react";

// Font size extension via marks on TextStyle
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const FONT_FAMILIES = [
  { label: "Default", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
];

const FONT_SIZES = [
  "10px", "11px", "12px", "14px", "16px", "18px", "20px",
  "22px", "24px", "28px", "32px", "36px", "48px", "64px",
];

export interface RichTextAttachment {
  file: File;
  type: "file" | "media";
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  attachments?: RichTextAttachment[];
  onAttachmentsChange?: (attachments: RichTextAttachment[]) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  attachments = [],
  onAttachmentsChange,
  placeholder = "Write your message here...",
  minHeight = 280,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const imageInlineRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,      // we use our own Heading with all 6 levels
        underline: false,    // we use @tiptap/extension-underline
        link: false,         // we use @tiptap/extension-link
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. when editing an existing campaign)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const setFontFamily = (val: string) => {
    if (val === "inherit") {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(val).run();
    }
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const setHeading = (val: string) => {
    if (val === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(val) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const currentHeading = () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      if (editor.isActive("heading", { level })) return String(level);
    }
    return "paragraph";
  };

  // Convert any CSS color (rgba, hsl, etc.) to a 6-digit hex string safe for <input type="color">
  const toHexColor = (color: string | undefined): string => {
    if (!color) return "#000000";
    // Already a plain hex
    if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
    if (/^#[0-9a-fA-F]{3}$/.test(color)) {
      const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    // Use a canvas to resolve any CSS color string
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    } catch {
      return "#000000";
    }
  };

  const currentColor = toHexColor(editor.getAttributes("textStyle").color);

  const insertLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertInlineImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !onAttachmentsChange) return;
    onAttachmentsChange([
      ...attachments,
      ...files.map((f) => ({ file: f, type: "file" as const })),
    ]);
    e.target.value = "";
  };

  const handleMediaAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !onAttachmentsChange) return;
    onAttachmentsChange([
      ...attachments,
      ...files.map((f) => ({ file: f, type: "media" as const })),
    ]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    if (!onAttachmentsChange) return;
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  const toolbarBtn = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    title: string
  ) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-foreground"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/40 select-none">

        {/* Undo / Redo */}
        {toolbarBtn(false, () => editor.chain().focus().undo().run(), <Undo className="w-3.5 h-3.5" />, "Undo")}
        {toolbarBtn(false, () => editor.chain().focus().redo().run(), <Redo className="w-3.5 h-3.5" />, "Redo")}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Heading style */}
        <Select value={currentHeading()} onValueChange={setHeading}>
          <SelectTrigger className="h-7 w-[110px] text-xs px-2 border-input">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="1">Heading 1</SelectItem>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
            <SelectItem value="4">Heading 4</SelectItem>
            <SelectItem value="5">Heading 5</SelectItem>
            <SelectItem value="6">Heading 6</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Font family */}
        <Select
          value={editor.getAttributes("textStyle").fontFamily ?? "inherit"}
          onValueChange={setFontFamily}
        >
          <SelectTrigger className="h-7 w-[130px] text-xs px-2 border-input">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((f) => (
              <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font size */}
        <Select
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onValueChange={setFontSize}
        >
          <SelectTrigger className="h-7 w-[80px] text-xs px-2 border-input">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Text colour */}
        <div className="relative" title="Text colour">
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-muted flex flex-col items-center"
          >
            <span className="text-xs font-bold leading-none" style={{ color: currentColor }}>A</span>
            <span
              className="block w-3.5 h-1 rounded-sm mt-0.5"
              style={{ backgroundColor: currentColor }}
            />
          </button>
          <input
            ref={colorInputRef}
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={currentColor}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Bold / Italic / Underline / Strikethrough */}
        {toolbarBtn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="w-3.5 h-3.5" />, "Bold (Ctrl+B)")}
        {toolbarBtn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="w-3.5 h-3.5" />, "Italic (Ctrl+I)")}
        {toolbarBtn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="w-3.5 h-3.5" />, "Underline (Ctrl+U)")}
        {toolbarBtn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <Strikethrough className="w-3.5 h-3.5" />, "Strikethrough")}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Alignment */}
        {toolbarBtn(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="w-3.5 h-3.5" />, "Align left")}
        {toolbarBtn(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="w-3.5 h-3.5" />, "Align center")}
        {toolbarBtn(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="w-3.5 h-3.5" />, "Align right")}
        {toolbarBtn(editor.isActive({ textAlign: "justify" }), () => editor.chain().focus().setTextAlign("justify").run(), <AlignJustify className="w-3.5 h-3.5" />, "Justify")}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists */}
        {toolbarBtn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="w-3.5 h-3.5" />, "Bullet list")}
        {toolbarBtn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="w-3.5 h-3.5" />, "Numbered list")}
        {toolbarBtn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="w-3.5 h-3.5" />, "Blockquote")}
        {toolbarBtn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), <Code className="w-3.5 h-3.5" />, "Inline code")}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link */}
        {toolbarBtn(editor.isActive("link"), insertLink, <LinkIcon className="w-3.5 h-3.5" />, "Insert link")}

        {/* Inline image */}
        <button
          type="button"
          title="Insert inline image"
          onClick={() => imageInlineRef.current?.click()}
          className="p-1.5 rounded hover:bg-muted text-foreground transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <input ref={imageInlineRef} type="file" accept="image/*" className="hidden" onChange={insertInlineImage} />

        {onAttachmentsChange && (
          <>
            <div className="w-px h-5 bg-border mx-1" />

            {/* Attach file */}
            <button
              type="button"
              title="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-muted text-foreground transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileAttach}
            />

            {/* Attach media (video/audio) */}
            <button
              type="button"
              title="Attach multimedia"
              onClick={() => mediaInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-muted text-foreground transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <span className="text-[10px]">🎬</span>
            </button>
            <input
              ref={mediaInputRef}
              type="file"
              multiple
              accept="video/*,audio/*"
              className="hidden"
              onChange={handleMediaAttach}
            />
          </>
        )}
      </div>

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none dark:prose-invert px-4 py-3 focus:outline-none"
        style={{ minHeight }}
      />

      {/* ── Attachments list ── */}
      {attachments.length > 0 && (
        <div className="border-t bg-muted/30 px-3 py-2 flex flex-wrap gap-2">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-background border rounded px-2 py-1 text-xs"
            >
              <span>{att.type === "media" ? "🎬" : "📎"}</span>
              <span className="max-w-[140px] truncate">{att.file.name}</span>
              <span className="text-muted-foreground">
                ({(att.file.size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="ml-1 text-destructive hover:text-destructive/70 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
