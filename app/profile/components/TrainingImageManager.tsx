'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { TrainingImageUploader } from './TrainingImageUploader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUploadFileMutation } from '@/lib/hooks/mutations/use-upload-file-mutation';
import JSZip from 'jszip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileQuery } from '@/lib/hooks/queries/use-profile-query';
import { updateProfile } from '@/lib/actions/profile';
import { trainModel } from '@/lib/actions/replicate';

interface ImagePreview {
  id: string;
  url: string;
}

const MIN_TRAINING_IMAGES = 4;
const MAX_TRAINING_IMAGES = 10;
const MAX_TRAINING_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
const MIN_TRIGGER_WORD_LENGTH = 3;

// Validate trigger word - only letters and minimum length
const isValidTriggerWord = (word: string) => {
  const trimmedWord = word.trim();
  return (
    trimmedWord.length >= MIN_TRIGGER_WORD_LENGTH &&
    /^[a-zA-Z]+$/.test(trimmedWord)
  );
};

export const TrainingImageManager = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [triggerWord, setTriggerWord] = useState('');
  const [trainingStatus, setTrainingStatus] = useState<
    'idle' | 'starting' | 'training' | 'error'
  >('idle');
  const router = useRouter();
  const { mutateAsync: uploadFile } = useUploadFileMutation();
  const uploaderRef = useRef<{ resetFiles: () => void } | null>(null);
  const { data: profile } = useProfileQuery();

  // Calculate validation states
  const validationState = useMemo(() => {
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const isTriggerWordValid = isValidTriggerWord(triggerWord);

    return {
      isValidCount:
        selectedFiles.length >= MIN_TRAINING_IMAGES &&
        selectedFiles.length <= MAX_TRAINING_IMAGES,
      isValidSize: totalSize <= MAX_TRAINING_IMAGE_SIZE,
      isTriggerWordValid,
      errorMessage: !selectedFiles.length
        ? 'No files selected'
        : selectedFiles.length < MIN_TRAINING_IMAGES
        ? `Add at least ${MIN_TRAINING_IMAGES} images`
        : selectedFiles.length > MAX_TRAINING_IMAGES
        ? `Maximum ${MAX_TRAINING_IMAGES} images allowed`
        : totalSize > MAX_TRAINING_IMAGE_SIZE
        ? `Total size exceeds ${MAX_TRAINING_IMAGE_SIZE / 1024 / 1024}MB`
        : !triggerWord.trim()
        ? 'Trigger word is required'
        : !isTriggerWordValid
        ? `Trigger word must be at least ${MIN_TRIGGER_WORD_LENGTH} letters long and contain only letters`
        : null
    };
  }, [selectedFiles, triggerWord]);

  const handleFilesSelected = (files: File[]) => {
    // Filter out duplicates based on file names
    const newUniqueFiles = files.filter(
      (newFile) =>
        !selectedFiles.some(
          (existingFile) => existingFile.name === newFile.name
        )
    );

    // If all files were duplicates, show a message
    if (newUniqueFiles.length === 0) {
      toast.warning('These images have already been added');
      return;
    }

    // If some files were duplicates, show a message
    if (newUniqueFiles.length < files.length) {
      toast.warning('Some duplicate images were skipped');
    }

    // Combine existing files with new unique files
    const newFiles = [...selectedFiles, ...newUniqueFiles];
    setSelectedFiles(newFiles);

    // Create previews for new unique files only
    const newPreviews = newUniqueFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file)
    }));

    // Add new previews to existing ones
    setPreviews((current) => [...current, ...newPreviews]);
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0 || !triggerWord.trim()) return;

    setIsUploading(true);
    setTrainingStatus('idle');
    try {
      // Create zip file
      const zip = new JSZip();
      selectedFiles.forEach((file, index) => {
        zip.file(
          `image-${index + 1}${file.name.substring(
            file.name.lastIndexOf('.')
          )}`,
          file
        );
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const fileName = `training-${Date.now()}.zip`;
      const zipFile = new File([zipBlob], fileName, {
        type: 'application/zip'
      });

      // Upload zip file
      const result = await uploadFile({
        file: zipFile,
        path: fileName
      });

      if (result?.publicUrl) {
        // Run update profile and train model in parallel
        const [_, trainingResult] = await Promise.all([
          updateProfile({ triggerWord }),
          trainModel({
            zipUrl: result.publicUrl,
            triggerWord,
            destination: profile!.model_url!
          })
        ]);

        // Update training status based on response
        if (trainingResult?.status) {
          setTrainingStatus(trainingResult.status);

          if (trainingResult.status === 'starting') {
            toast.success('Training started successfully!');
          }
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload images');
      setTrainingStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  // Render different button states based on training status
  const renderActionButton = () => {
    if (isUploading) {
      return (
        <Button disabled className='bg-blue-600 hover:bg-blue-700 text-white'>
          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          Uploading...
        </Button>
      );
    }

    switch (trainingStatus) {
      case 'starting':
        return (
          <Button disabled className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Starting Training...
          </Button>
        );
      case 'training':
        return (
          <Button disabled className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Training in Progress...
          </Button>
        );
      case 'error':
        return (
          <Button
            variant='destructive'
            onClick={handleConfirmUpload}
            disabled={
              !validationState.isValidCount ||
              !validationState.isValidSize ||
              !validationState.isTriggerWordValid
            }
          >
            Retry Training
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleConfirmUpload}
            disabled={
              isUploading ||
              !validationState.isValidCount ||
              !validationState.isValidSize ||
              !validationState.isTriggerWordValid
            }
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            Confirm Upload
          </Button>
        );
    }
  };

  const handleRemovePreview = (previewId: string) => {
    // Find the preview to remove
    const previewToRemove = previews.find((p) => p.id === previewId);
    if (previewToRemove) {
      // Revoke the URL for the removed preview
      URL.revokeObjectURL(previewToRemove.url);
    }

    // Update previews
    setPreviews((current) => current.filter((p) => p.id !== previewId));

    // Update selected files
    const newFiles = selectedFiles.filter((_, index) => {
      const preview = previews[index];
      return preview && preview.id !== previewId;
    });
    setSelectedFiles(newFiles);

    // Reset the file input to allow re-uploading the same files
    uploaderRef.current?.resetFiles();

    // If we removed the last image, clean up everything
    if (newFiles.length === 0) {
      handleClearAll();
    }
  };

  const handleClearAll = () => {
    // Clean up preview URLs
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setSelectedFiles([]);
    setTriggerWord('');
    // Reset the file input using the ref
    uploaderRef.current?.resetFiles();
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    router.back();
  };

  return (
    <div className='relative'>
      <div className='bg-gray-900 py-5 px-4 flex justify-between items-center'>
        <h2 className='text-xl font-bold text-white'>Training Images</h2>
        <Button
          variant='ghost'
          className='text-white hover:bg-gray-800 rounded-full'
          size='sm'
          onClick={handleCancel}
        >
          <X className='h-5 w-5' />
          <span className='ml-2'>Cancel</span>
        </Button>
      </div>

      <div className='p-4 space-y-6'>
        <TrainingImageUploader
          ref={uploaderRef}
          onFilesSelected={handleFilesSelected}
        />

        {previews.length > 0 && (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {previews.map((preview) => (
                <ImagePreviewCard
                  key={preview.id}
                  preview={preview}
                  onRemove={handleRemovePreview}
                />
              ))}
            </div>

            <div className='flex flex-col space-y-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='trigger-word'
                  className='text-sm font-medium text-gray-200'
                >
                  Trigger Word
                </Label>
                <Input
                  id='trigger-word'
                  placeholder='Enter a trigger word for your model (letters only)...'
                  value={triggerWord}
                  onChange={(e) => setTriggerWord(e.target.value)}
                  className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-400'
                />
                <p className='text-xs text-gray-400'>
                  Use at least {MIN_TRIGGER_WORD_LENGTH} letters, no numbers or
                  special characters
                </p>
              </div>

              {validationState.errorMessage && (
                <p className='text-sm text-yellow-500 text-right'>
                  {validationState.errorMessage}
                </p>
              )}

              <div className='flex justify-end space-x-4'>
                <ClearAllButton onClear={handleClearAll} />
                {renderActionButton()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components
interface RemovePreviewButtonProps {
  onRemove: () => void;
}

const RemovePreviewButton = ({ onRemove }: RemovePreviewButtonProps) => {
  return (
    <Button
      variant='destructive'
      size='icon'
      className='h-8 w-8 rounded-full'
      onClick={onRemove}
    >
      <X className='h-4 w-4' />
    </Button>
  );
};

interface ClearAllButtonProps {
  onClear: () => void;
}

const ClearAllButton = ({ onClear }: ClearAllButtonProps) => {
  return (
    <Button
      variant='outline'
      onClick={onClear}
      className='text-gray-400 hover:text-gray-300'
    >
      Clear All
    </Button>
  );
};

interface ImagePreviewCardProps {
  preview: ImagePreview;
  onRemove: (previewId: string) => void;
}

const ImagePreviewCard = ({ preview, onRemove }: ImagePreviewCardProps) => {
  return (
    <div className='relative group border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800'>
      <div className='aspect-square relative'>
        <Image
          src={preview.url}
          alt='Training image preview'
          fill
          className='object-cover'
        />
      </div>
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        <RemovePreviewButton onRemove={() => onRemove(preview.id)} />
      </div>
    </div>
  );
};
