'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ImageItem {
  id: string;
  url: string;
  name: string;
  status: 'uploading' | 'complete' | 'error';
}

export function ProfileImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Create placeholder entries with uploading status
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      status: 'uploading' as const
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Simulate upload process for each file
    // In a real app, this would be an actual API call to your backend
    const uploadPromises = newImages.map(async (image, index) => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500 * (index + 1)));

        // Update the image status to complete
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: 'complete' as const } : img
          )
        );

        return { success: true, id: image.id };
      } catch (error) {
        // Update the image status to error
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: 'error' as const } : img
          )
        );

        return { success: false, id: image.id };
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    const successCount = results.filter((r) => r.success).length;

    if (successCount > 0) {
      toast.success('Images uploaded', {
        description: `Successfully uploaded ${successCount} of ${files.length} images.`
      });
    } else {
      toast.error('Upload failed', {
        description: 'Failed to upload images. Please try again.'
      });
    }

    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    // Remove image preview
    setImages((prev) => prev.filter((image) => image.id !== id));

    // In a real app, you would also call an API to remove the image from storage
    toast.success('Image removed', {
      description: 'The image has been removed from your profile.'
    });
  };

  const removeAllImages = () => {
    // Clear all images
    setImages([]);

    // In a real app, you would also call an API to remove all images from storage
    toast.success('All images removed', {
      description: 'All images have been removed from your profile.'
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const successfulUploads = images.filter(
    (img) => img.status === 'complete'
  ).length;

  return (
    <div className='relative'>
      <div className='bg-gray-900 py-5 px-4 flex justify-between items-center'>
        <h2 className='text-xl font-bold text-white'>Your Images</h2>
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

      <div className='p-4'>
        <ImageUploader onUpload={handleUpload} isUploading={isUploading} />

        {successfulUploads > 0 && (
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-300'>
              {successfulUploads} {successfulUploads === 1 ? 'image' : 'images'}{' '}
              uploaded
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((image) => (
              <div
                key={image.id}
                className='relative group border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800'
              >
                <div className='aspect-square relative'>
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className='object-cover'
                  />
                  {image.status === 'uploading' && (
                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                      <Loader2 className='h-8 w-8 text-white animate-spin' />
                    </div>
                  )}
                  {image.status === 'error' && (
                    <div className='absolute inset-0 bg-red-500/20 flex items-center justify-center'>
                      <div className='bg-red-900/50 p-2 rounded-full'>
                        <X className='h-6 w-6 text-red-500' />
                      </div>
                    </div>
                  )}
                </div>
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant='destructive'
                    size='icon'
                    className='h-8 w-8 rounded-full'
                    onClick={() => removeImage(image.id)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
                <div className='p-2 text-sm truncate bg-gray-700 text-gray-200 flex justify-between items-center'>
                  <span className='truncate max-w-[80%]'>{image.name}</span>
                  {image.status === 'complete' && (
                    <span className='text-xs text-green-400 font-medium'>
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className='mt-4 flex justify-center'>
            <Button
              onClick={removeAllImages}
              variant='outline'
              size='sm'
              className='bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
