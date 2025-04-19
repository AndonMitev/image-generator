'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingImageManager } from './TrainingImageManager';
import { PromptImageHistory } from './PromptImageHistory';
import { PromptImageGenerator } from './PromptImageGenerator';

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue='prompts' className='w-full'>
      <TabsList className='grid w-full grid-cols-2 bg-gray-900'>
        <TabsTrigger
          value='prompts'
          className='data-[state=active]:bg-gray-800'
        >
          Prompt Generation
        </TabsTrigger>
        <TabsTrigger
          value='training'
          className='data-[state=active]:bg-gray-800'
        >
          Model Training
        </TabsTrigger>
      </TabsList>

      <TabsContent value='prompts' className='mt-4 space-y-8'>
        <PromptImageGenerator />
        <PromptImageHistory />
      </TabsContent>

      <TabsContent value='training' className='mt-4'>
        <TrainingImageManager />
      </TabsContent>
    </Tabs>
  );
};
