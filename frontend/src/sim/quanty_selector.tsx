import React, { useState } from 'react';

const FileSelector: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        setFileName(event.target.files[0].name);
      }
    };

    const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilePath(event.target.value);
    };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      <input
        type="text"
        value={filePath}
        onChange={handlePathChange}
        placeholder="Enter file path"
      />
      {filePath && <p>Entered file path: {filePath}</p>}
    </div>
  );
};

export default FileSelector;