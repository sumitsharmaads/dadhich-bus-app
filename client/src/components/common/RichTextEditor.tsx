"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
};

const RichTextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  readOnly,
  minHeight = 120,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Safety: clear any previous children to avoid duplicate toolbars/editors
    containerRef.current.innerHTML = "";
    editorRef.current = document.createElement("div");
    containerRef.current.appendChild(editorRef.current);

    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly,
        placeholder,
        modules: {
          toolbar: readOnly
            ? false
            : [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
        },
      });
      if (value) {
        const delta = quillRef.current.clipboard.convert({ html: value });
        quillRef.current.setContents(delta, "silent");
      }
      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root?.innerHTML || "";
        onChange(html);
      });
    }

    return () => {
      // Quill has no explicit destroy; remove DOM to cleanup
      if (containerRef.current && editorRef.current) {
        containerRef.current.innerHTML = "";
      }
      quillRef.current = null;
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value != null) {
      const currentHtml = quillRef.current.root.innerHTML || "";
      if (currentHtml !== value) {
        const selection = quillRef.current.getSelection();
        const delta = quillRef.current.clipboard.convert({ html: value || "" });
        quillRef.current.setContents(delta, "silent");
        if (selection) quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return <div ref={containerRef} style={{ minHeight }} />;
};

export default RichTextEditor;
