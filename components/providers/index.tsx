import { AuthProvider } from './AuthProvider';
import { QueryClientProvider } from './QueryClientProvider';
import { SidebarProvider } from './SidebarProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider defaultTheme='dark' storageKey='imagegen-theme'>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
