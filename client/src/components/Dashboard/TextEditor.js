import React from 'react';
import Editor from '@monaco-editor/react';

const TextEditor = ({ value, onChange }) => {
  return (
    <Editor
      height="300px"
      defaultLanguage="plaintext"
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on'
      }}
    />
  );
};

export default TextEditor;
