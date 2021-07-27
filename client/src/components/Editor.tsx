import React, { useState, useEffect, useRef } from "react";

function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef<any>();
  const { CKEditor, ClassicEditor, DocumentEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      // ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
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
        "blockQuote",
        "mediaEmbed",
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
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
        console.log(Array.from(editor.ui.componentFactory.names()));
        // Insert the toolbar before the editable area.
        editor.ui.view.editable.element.parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.view.editable.element
        );
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  ) : (
    <div>Editor loading</div>
  );
}

export default Editor;
