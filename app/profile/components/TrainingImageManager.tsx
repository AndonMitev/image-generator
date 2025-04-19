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
  file: File;
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
    const hasMinimumImages = selectedFiles.length >= MIN_TRAINING_IMAGES;
    return {
      isTriggerWordValid: isValidTriggerWord(triggerWord),
      hasMinimumImages,
      errorMessage: !triggerWord.trim()
        ? 'Trigger word is required'
        : !isValidTriggerWord(triggerWord)
        ? `Trigger word must be at least ${MIN_TRIGGER_WORD_LENGTH} letters long and contain only letters`
        : !hasMinimumImages
        ? `Need at least ${MIN_TRAINING_IMAGES} images to train`
        : null
    };
  }, [triggerWord, selectedFiles.length]);

  const handleFilesSelected = (newPreviews: ImagePreview[]) => {
    setPreviews(newPreviews);
    setSelectedFiles(newPreviews.map((preview) => preview.file));
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

      console.log('[TrainingImageManager] result:', result);
      return;
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

  const handleRemovePreview = (previewId: string) => {
    const updatedPreviews = previews.filter((p) => p.id !== previewId);
    setPreviews(updatedPreviews);
    setSelectedFiles(updatedPreviews.map((preview) => preview.file));

    // Reset the file input to allow re-uploading the same files
    uploaderRef.current?.resetFiles();

    // If we removed the last image, clean up everything
    if (updatedPreviews.length === 0) {
      handleClearAll();
    }
  };

  const handleClearAll = () => {
    setPreviews([]);
    setSelectedFiles([]);
    setTriggerWord('');
    // Reset the file input using the ref
    uploaderRef.current?.resetFiles();
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
              !validationState.hasMinimumImages ||
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
              !validationState.hasMinimumImages ||
              !validationState.isTriggerWordValid
            }
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {validationState.hasMinimumImages
              ? 'Start Training'
              : `Add ${MIN_TRAINING_IMAGES - selectedFiles.length} More Images`}
          </Button>
        );
    }
  };

  return (
    <div className='relative'>
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
