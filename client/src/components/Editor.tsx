import React, { useEffect, useRef } from "react";

interface EditorProps {
  onChange: (data: React.SetStateAction<string>) => void;
  editorLoaded: boolean;
  name: string;
  value: string;
}

export default function Editor({
  onChange,
  editorLoaded,
  name,
  value,
}: EditorProps) {
  const editorRef = useRef<any>();
  const { CKEditor, DocumentEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      DocumentEditor: require("@ckeditor/ckeditor5-build-decoupled-document"),
    };
  }, []);

  const config = {
    toolbar: {
      items: [
        "bold",
        "italic",
        "link",
        "strikethrough",
        "underline",
        "|",
        "heading",
        "bulletedList",
        "numberedList",
        "insertTable",
        "blockQuote",
      ],
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "http://",
    },
    placeholder: "Text (optional)",
  };

  return editorLoaded ? (
    <CKEditor
      editor={DocumentEditor}
      config={config}
      type=""
      name={name}
      data={value}
      onReady={(editor) => {
        // Insert the toolbar before the editable area.
        editor.ui.view.editable.element.parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.view.editable.element
        );
      }}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  ) : (
    <div className="loader">Editor loading</div>
  );
}
