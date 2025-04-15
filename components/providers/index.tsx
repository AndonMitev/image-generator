import { QueryClientProvider } from './QueryClientProvider';
import { SidebarProvider } from './SidebarProvider';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider defaultTheme='dark' storageKey='imagegen-theme'>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
