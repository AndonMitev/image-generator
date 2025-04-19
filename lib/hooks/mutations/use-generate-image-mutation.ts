import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateImage } from '@/lib/actions/replicate';
import { createPrompt, updatePrompt } from '@/lib/actions/prompt';
import { toast } from 'sonner';

interface GenerateImageVariables {
  prompt: string;
}

export const useGenerateImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: GenerateImageVariables) => {
      try {
        const trimmedPrompt = variables.prompt.trim();

        if (!trimmedPrompt) {
          throw new Error('Prompt cannot be empty');
        }

        // Run prompt creation and image generation in parallel
        const [promptResult, imageUrl] = await Promise.all([
          createPrompt({ prompt: trimmedPrompt }),
          generateImage({ prompt: trimmedPrompt })
        ]);

        // Update the prompt with the image URL
        if (promptResult?.id && imageUrl) {
          await updatePrompt({
            id: promptResult.id,
            imageUrl
          });
        }

        return imageUrl;
      } catch (error) {
        console.error('[useGenerateImageMutation] Error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to generate image. Please try again.'
        );
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch recent prompts query
      queryClient.invalidateQueries({ queryKey: ['prompts', 'recent'] });
    }
  });
};
