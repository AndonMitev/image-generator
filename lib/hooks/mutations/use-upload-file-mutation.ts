import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/clients/supabase/supabaseBrowserClient';

interface UploadFileVariables {
  file: File;
  path: string;
}

export function useUploadFileMutation() {
  return useMutation({
    mutationFn: async ({ file, path }: UploadFileVariables) => {
      const supabase = createClient();

      // Get the current user session
      const {
        data: { session },
        error: authError
      } = await supabase.auth.getSession();

      if (authError || !session) {
        throw new Error('You must be authenticated to upload files');
      }

      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from('training-files')
        .upload(path, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from('training-files').getPublicUrl(path);

      console.log('publicUrl', publicUrl);
      console.log('data', data);
      return { data, publicUrl };
    }
  });
}
