import { useEditor, EditorContent, Extension, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";
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

// ── Font size extension ───────────────────────────────────────────────────────
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

// ── Toolbar button ────────────────────────────────────────────────────────────
// Defined outside the component so it never gets re-created.
function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        // Prevent the editor from losing focus when clicking toolbar buttons
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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
      StarterKit.configure({ heading: false }),
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

  // ── Reactive editor state (re-renders toolbar on every selection/mark change) ──
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isUnderline: ctx.editor?.isActive("underline") ?? false,
      isStrike: ctx.editor?.isActive("strike") ?? false,
      isCode: ctx.editor?.isActive("code") ?? false,
      isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
      isLink: ctx.editor?.isActive("link") ?? false,
      isAlignLeft: ctx.editor?.isActive({ textAlign: "left" }) ?? false,
      isAlignCenter: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
      isAlignRight: ctx.editor?.isActive({ textAlign: "right" }) ?? false,
      isAlignJustify: ctx.editor?.isActive({ textAlign: "justify" }) ?? false,
      heading: (() => {
        for (const level of [1, 2, 3, 4, 5, 6] as const) {
          if (ctx.editor?.isActive("heading", { level })) return String(level);
        }
        return "paragraph";
      })(),
      fontFamily: ctx.editor?.getAttributes("textStyle").fontFamily ?? "inherit",
      fontSize: ctx.editor?.getAttributes("textStyle").fontSize ?? "",
      color: ctx.editor?.getAttributes("textStyle").color ?? "#000000",
    }),
  });

  // Sync external value changes (e.g. when editing an existing campaign)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  // ── Command helpers ───────────────────────────────────────────────────────

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/40 select-none">

        {/* Undo / Redo */}
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Heading style */}
        <Select value={editorState?.heading ?? "paragraph"} onValueChange={setHeading}>
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
        <Select value={editorState?.fontFamily ?? "inherit"} onValueChange={setFontFamily}>
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
        <Select value={editorState?.fontSize ?? ""} onValueChange={setFontSize}>
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
            onMouseDown={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
            className="p-1.5 rounded hover:bg-muted flex flex-col items-center"
          >
            <span className="text-xs font-bold leading-none" style={{ color: editorState?.color ?? "#000000" }}>A</span>
            <span
              className="block w-3.5 h-1 rounded-sm mt-0.5"
              style={{ backgroundColor: editorState?.color ?? "#000000" }}
            />
          </button>
          <input
            ref={colorInputRef}
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={editorState?.color ?? "#000000"}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Bold / Italic / Underline / Strikethrough */}
        <ToolbarBtn active={editorState?.isBold ?? false} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isItalic ?? false} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isUnderline ?? false} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isStrike ?? false} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Alignment */}
        <ToolbarBtn active={editorState?.isAlignLeft ?? false} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isAlignCenter ?? false} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isAlignRight ?? false} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isAlignJustify ?? false} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">
          <AlignJustify className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists */}
        <ToolbarBtn active={editorState?.isBulletList ?? false} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isOrderedList ?? false} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isBlockquote ?? false} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn active={editorState?.isCode ?? false} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
          <Code className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link */}
        <ToolbarBtn active={editorState?.isLink ?? false} onClick={insertLink} title="Insert link">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>

        {/* Inline image */}
        <button
          type="button"
          title="Insert inline image"
          onMouseDown={(e) => { e.preventDefault(); imageInlineRef.current?.click(); }}
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
              onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
              className="p-1.5 rounded hover:bg-muted text-foreground transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileAttach} />

            {/* Attach multimedia */}
            <button
              type="button"
              title="Attach multimedia (video/audio)"
              onMouseDown={(e) => { e.preventDefault(); mediaInputRef.current?.click(); }}
              className="p-1.5 rounded hover:bg-muted text-foreground transition-colors text-[11px] leading-none"
            >
              🎬
            </button>
            <input ref={mediaInputRef} type="file" multiple accept="video/*,audio/*" className="hidden" onChange={handleMediaAttach} />
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
            <div key={i} className="flex items-center gap-1.5 bg-background border rounded px-2 py-1 text-xs">
              <span>{att.type === "media" ? "🎬" : "📎"}</span>
              <span className="max-w-[140px] truncate">{att.file.name}</span>
              <span className="text-muted-foreground">({(att.file.size / 1024).toFixed(0)} KB)</span>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); removeAttachment(i); }}
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
