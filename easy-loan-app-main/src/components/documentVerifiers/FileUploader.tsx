
import React from 'react';
import { Upload, Loader } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  isVerifying: boolean;
  isModelLoading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  previewUrl,
  isUploading,
  isVerifying,
  isModelLoading,
  handleFileChange,
  handleRemoveFile
}) => {
  return (
    <div className="mb-6">
      {isModelLoading && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center">
          <Loader className="animate-spin h-5 w-5 mr-2 text-blue-500" />
          <span className="text-blue-700 text-sm">Loading verification models...</span>
        </div>
      )}
      
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            id="document-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isUploading || isVerifying}
          />
          <label 
            htmlFor="document-upload" 
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-sm">PDF, JPG or PNG (max. 5MB)</p>
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Document preview" className="h-40 object-contain mx-auto" />
            ) : (
              <div className="bg-gray-100 h-40 w-full flex items-center justify-center">
                <p className="text-gray-500">PDF Document</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500 truncate max-w-[200px]">{file.name}</span>
            <button 
              onClick={handleRemoveFile}
              className="text-red-500 text-sm"
              disabled={isUploading || isVerifying}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
