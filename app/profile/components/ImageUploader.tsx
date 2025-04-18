'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, UploadIcon, Loader2 } from 'lucide-react';
import { createModel } from '@/lib/actions/replicate';
import { toast } from 'sonner';
import { useProfileQuery } from '@/lib/hooks/queries/use-profile-query';
import { useUploadFileMutation } from '@/lib/hooks/queries/use-upload-file-mutation';

interface ImageUploaderProps {
  onUpload?: (publicUrl: string) => void;
  onFilesSelected?: (files: File[]) => void;
}

export interface ImageUploaderRef {
  resetFiles: () => void;
}

export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ onFilesSelected }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [isCreatingModel, setIsCreatingModel] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: profile, isLoading: isLoadingProfile } = useProfileQuery();
    const { isPending: isUploading } = useUploadFileMutation();

    useImperativeHandle(ref, () => ({
      resetFiles: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFiles([]);
      }
    }));

    const validateFiles = (newFiles: File[]) => {
      setError('');

      // Check total size (15MB = 15 * 1024 * 1024 bytes)
      const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 15 * 1024 * 1024;
      if (totalSize > maxSize) {
        setError('Total file size must not exceed 15MB');
        return false;
      }

      // Check file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const hasInvalidType = newFiles.some(
        (file) => !validTypes.includes(file.type)
      );
      if (hasInvalidType) {
        setError('Only JPEG, PNG, and GIF files are allowed');
        return false;
      }

      return true;
    };

    const generatePreviews = (selectedFiles: File[]) => {
      if (validateFiles(selectedFiles)) {
        setFiles(selectedFiles);
        onFilesSelected?.(selectedFiles);
      }
    };

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
        const newFiles = Array.from(e.dataTransfer.files);
        generatePreviews(newFiles);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        generatePreviews(newFiles);
      }
    };

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    const handleCreateModel = async () => {
      setIsCreatingModel(true);
      setError('');

      try {
        await createModel();
        toast.success('Model created successfully');
      } catch (err) {
        console.error('Error creating model:', err);
        setError('Failed to create model. Please try again.');
      } finally {
        setIsCreatingModel(false);
      }
    };

    if (isLoadingProfile) {
      return (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
        </div>
      );
    }

    if (!profile?.model_url) {
      return (
        <div className='space-y-4 text-center py-12'>
          <h3 className='text-lg font-medium text-gray-200'>
            Create Your Model
          </h3>
          <p className='text-sm text-gray-400'>
            You need to create a model before uploading training images
          </p>
          <Button
            onClick={handleCreateModel}
            disabled={isCreatingModel}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {isCreatingModel ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Creating Model...
              </>
            ) : (
              'Create Model'
            )}
          </Button>
          {error && <p className='text-sm text-red-400'>{error}</p>}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        <div
          className={`border border-dashed rounded-lg py-12 text-center transition-colors bg-gray-900 ${
            dragActive ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600'
          } ${error ? 'border-red-500' : ''}`}
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
              Drop your images here
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
              ref={fileInputRef}
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
              <p>Maximum total size: 15MB</p>
              <p>You'll need at least 4 images to train the model</p>
              {isUploading && (
                <p className='text-blue-400 mt-2'>
                  Processing ${files.length} files...
                </p>
              )}
              {error && <p className='text-red-400 mt-2'>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
