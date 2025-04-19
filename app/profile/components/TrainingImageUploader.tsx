'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, UploadIcon, Loader2 } from 'lucide-react';
import { createModel } from '@/lib/actions/replicate';
import { toast } from 'sonner';
import { useProfileQuery } from '@/lib/hooks/queries/use-profile-query';
import { useUploadFileMutation } from '@/lib/hooks/mutations/use-upload-file-mutation';

interface ImagePreview {
  id: string;
  url: string;
  file: File;
}

interface TrainingImageUploaderProps {
  onUpload?: (publicUrl: string) => void;
  onFilesSelected?: (previews: ImagePreview[]) => void;
  maxFiles?: number;
  minFiles?: number;
}

interface TrainingImageUploaderRef {
  resetFiles: () => void;
}

export const TrainingImageUploader = forwardRef<
  TrainingImageUploaderRef,
  TrainingImageUploaderProps
>(({ onFilesSelected, maxFiles = 10, minFiles = 4 }, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [isCreatingModel, setIsCreatingModel] = useState(false);
  const [existingPreviews, setExistingPreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery();
  const { isPending: isUploading } = useUploadFileMutation();

  useImperativeHandle(ref, () => ({
    resetFiles: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Clean up preview URLs
      existingPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setExistingPreviews([]);
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

    // For new uploads, just check if we're not exceeding max files
    const totalFiles = existingPreviews.length + newFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return false;
    }

    // Show informational message about minimum required images
    if (totalFiles < minFiles) {
      setError(`You'll need at least ${minFiles} images to train the model`);
      // Still return true to allow the upload
      return true;
    }

    return true;
  };

  const generatePreviews = (selectedFiles: File[]) => {
    if (!validateFiles(selectedFiles)) return;

    // Filter out duplicates based on file names
    const newUniqueFiles = selectedFiles.filter(
      (newFile) =>
        !existingPreviews.some(
          (existing) => existing.file.name === newFile.name
        )
    );

    // If all files were duplicates, show a message
    if (newUniqueFiles.length === 0) {
      toast.warning('These images have already been added');
      return;
    }

    // If some files were duplicates, show a message
    if (newUniqueFiles.length < selectedFiles.length) {
      toast.warning('Some duplicate images were skipped');
    }

    // Create previews for new unique files
    const newPreviews = newUniqueFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file
    }));

    const updatedPreviews = [...existingPreviews, ...newPreviews];
    setExistingPreviews(updatedPreviews);
    onFilesSelected?.(updatedPreviews);
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
    return <LoadingView />;
  }

  if (!profile?.model_url) {
    return (
      <CreateModelView
        isCreatingModel={isCreatingModel}
        error={error}
        onCreateModel={handleCreateModel}
      />
    );
  }

  return (
    <DragAndDropView
      dragActive={dragActive}
      error={error}
      files={existingPreviews.map((preview) => preview.file)}
      isUploading={isUploading}
      fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const newFiles = Array.from(e.dataTransfer.files);
          generatePreviews(newFiles);
        }
      }}
      onFileChange={(e) => {
        if (e.target.files && e.target.files.length > 0) {
          const newFiles = Array.from(e.target.files);
          generatePreviews(newFiles);
        }
      }}
    />
  );
});

// Sub-components
const LoadingView = () => {
  return (
    <div className='flex items-center justify-center py-12'>
      <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
    </div>
  );
};

interface CreateModelViewProps {
  isCreatingModel: boolean;
  error: string;
  onCreateModel: () => void;
}

const CreateModelView = ({
  isCreatingModel,
  error,
  onCreateModel
}: CreateModelViewProps) => {
  return (
    <div className='space-y-4 text-center py-12'>
      <h3 className='text-lg font-medium text-gray-200'>Create Your Model</h3>
      <p className='text-sm text-gray-400'>
        You need to create a model before uploading training images
      </p>
      <Button
        onClick={onCreateModel}
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
};

interface DragAndDropViewProps {
  dragActive: boolean;
  error: string;
  files: File[];
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DragAndDropView = ({
  dragActive,
  error,
  files,
  isUploading,
  fileInputRef,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange
}: DragAndDropViewProps) => {
  return (
    <div className='space-y-4'>
      <div
        className={`border border-dashed rounded-lg py-12 text-center transition-colors bg-gray-900 ${
          dragActive ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600'
        } ${error ? 'border-red-500' : ''}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
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
            onClick={() => fileInputRef.current?.click()}
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
            onChange={onFileChange}
            disabled={isUploading}
          />

          <div className='text-xs text-gray-400 max-w-xs'>
            <p>Supported formats: JPEG, PNG, GIF</p>
            <p>Maximum total size: 15MB</p>
            <p>You&apos;ll need at least 4 images to train the model</p>
            {isUploading && (
              <p className='text-blue-400 mt-2'>
                Processing {files.length} files...
              </p>
            )}
            {error && <p className='text-red-400 mt-2'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
