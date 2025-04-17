'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, UploadIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
}

export function ImageUploader({
  onUpload,
  isUploading = false
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileCount, setFileCount] = useState<number>(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setFileCount(files.length);
      onUpload(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFileCount(files.length);
      onUpload(files);
    }
  };

  const handleBrowseClick = () => {
    // Manually trigger the input click
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      className={`border border-dashed border-gray-600 rounded-lg py-12 text-center transition-colors bg-gray-900 ${
        dragActive ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='bg-gray-800 rounded-full p-3'>
          <ImageIcon className='h-10 w-10 text-blue-500' />
        </div>
        <p className='text-gray-200 font-medium text-lg'>
          Drop multiple images here
        </p>
        <p className='text-sm text-gray-400'>or</p>

        <Button
          type='button'
          variant='outline'
          className='bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
          disabled={isUploading}
          onClick={handleBrowseClick}
        >
          <UploadIcon className='h-4 w-4 mr-2 text-blue-500' />
          Browse Files
        </Button>

        <input
          id='file-upload'
          name='file-upload'
          type='file'
          className='hidden'
          multiple
          accept='image/*'
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className='text-xs text-gray-400 max-w-xs'>
          <p>Supported formats: JPEG, PNG, GIF</p>
          {isUploading && (
            <p className='text-blue-400 mt-2'>Uploading {fileCount} files...</p>
          )}
        </div>
      </div>
    </div>
  );
}
