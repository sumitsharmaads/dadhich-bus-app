"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const quillRef = useRef<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Dynamic import Quill
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;

      quillRef.current = new Quill(containerRef.current!, {
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

      // Set initial content
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Handle text changes
      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      quillRef.current = null;
    };
  }, [isClient, readOnly, placeholder]);

  if (!isClient) {
    return (
      <div style={{ minHeight, border: "1px solid #ccc", padding: "8px" }}>
        Loading editor...
      </div>
    );
  }

  return <div ref={containerRef} style={{ minHeight }} />;
};

export default RichTextEditor;
