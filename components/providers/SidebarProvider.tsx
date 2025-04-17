'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  Image as ImageIcon,
  Moon,
  Sun,
  LogIn,
  LogOut
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from './AuthProvider';
import { AuthenticationDialog } from '@/components/auth/AuthenticationDialog';
import { toast } from 'sonner';

const sidebarVariants = {
  open: {
    width: '280px',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25
    }
  },
  closed: {
    width: '72px',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25
    }
  }
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Initialize with true to avoid hydration mismatch
  const [isOpen, setIsOpen] = useState(true);
  // Add loading state to prevent UI flicker
  const [isLoading, setIsLoading] = useState(true);
  // Auth dialog state
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const { user, signOut } = useAuth();

  // Load the saved state from localStorage on the client side only
  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setIsOpen(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const toggle = () => {
    setIsOpen((prevState: boolean) => {
      const newState = !prevState;
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {!isLoading && (
        <div className='flex h-screen'>
          <motion.aside
            initial={isOpen ? 'open' : 'closed'}
            animate={isOpen ? 'open' : 'closed'}
            variants={sidebarVariants}
            className='fixed left-0 top-0 z-50 h-full bg-background/95 text-foreground shadow-lg backdrop-blur-2xl border-r border-border'
          >
            {/* Animated background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:via-background dark:to-accent/20' />

            <div className='relative flex h-20 items-center justify-between px-5 border-b border-border'>
              <Logo isOpen={isOpen} />
              <ToggleButton isOpen={isOpen} toggle={toggle} />
            </div>

            <div className='relative px-3 py-4'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={isOpen ? 'expanded' : 'collapsed'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeButton isOpen={isOpen} />
                  <NavigationMenu isOpen={isOpen} />

                  {/* Auth Button */}
                  {user ? (
                    <AuthButton
                      isOpen={isOpen}
                      icon={LogOut}
                      label='Sign Out'
                      onClick={handleSignOut}
                    />
                  ) : (
                    <AuthButton
                      isOpen={isOpen}
                      icon={LogIn}
                      label='Sign In'
                      onClick={() => setIsAuthDialogOpen(true)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <StorageUsed isOpen={isOpen} />
          </motion.aside>

          <main
            className={`flex-1 transition-all duration-300 ${
              isOpen ? 'ml-[280px]' : 'ml-[72px]'
            }`}
          >
            {children}
          </main>

          <AuthenticationDialog
            isOpen={isAuthDialogOpen}
            onClose={() => setIsAuthDialogOpen(false)}
          />
        </div>
      )}
      {isLoading && (
        <div className='h-screen w-screen flex items-center justify-center'>
          {/* Simple loading state - you could add a spinner here if desired */}
        </div>
      )}
    </SidebarContext.Provider>
  );
}

const SidebarContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: false,
  toggle: () => {}
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: ImageIcon, label: 'Generate', href: '/generate', isPro: true }
];

// Logo Component
const Logo = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence mode='wait'>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className='flex items-center gap-3'
      >
        <div className='relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 p-[1px] group cursor-pointer overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-50 group-hover:opacity-100 transition-opacity duration-500' />
          <div className='relative h-full w-full rounded-xl bg-background/95 flex items-center justify-center backdrop-blur-xl'>
            <ImageIcon className='h-5 w-5 text-primary' />
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='text-lg font-semibold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent'>
            ImageGen
          </span>
          <span className='text-xs text-muted-foreground'>
            AI Image Generator
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Toggle Button Component
const ToggleButton = ({
  isOpen,
  toggle
}: {
  isOpen: boolean;
  toggle: () => void;
}) => (
  <motion.button
    onClick={toggle}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`absolute ${
      isOpen ? 'right-5' : 'right-4'
    } h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 hover:from-primary/40 hover:to-accent/40 transition-all duration-300`}
  >
    <div className='absolute inset-[1px] rounded-xl bg-background/95 flex items-center justify-center backdrop-blur-xl cursor-pointer'>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {isOpen ? (
          <X className='h-4 w-4 text-primary' />
        ) : (
          <Menu className='h-4 w-4 text-primary' />
        )}
      </motion.div>
    </div>
  </motion.button>
);

// Theme Button Component
const ThemeButton = ({ isOpen }: { isOpen: boolean }) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='w-full mb-4 relative group cursor-pointer'
    >
      <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl' />
      <div className='relative h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 p-[1px] overflow-hidden'>
        <div className='h-full w-full rounded-xl bg-background/95 flex items-center gap-3 px-4 backdrop-blur-xl group-hover:bg-background/80 transition-colors duration-300'>
          <div className='flex items-center gap-3 relative z-10 w-full justify-between'>
            <div className='flex items-center gap-3'>
              {theme === 'dark' ? (
                <Moon className='h-4 w-4 text-primary' />
              ) : (
                <Sun className='h-4 w-4 text-primary' />
              )}
              <AnimatePresence mode='wait'>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <span className='text-sm font-medium whitespace-nowrap text-foreground'>
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// Navigation Menu Component
const NavigationMenu = ({ isOpen }: { isOpen: boolean }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className='space-y-1.5'>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className='block'>
          <motion.div
            whileHover={{
              scale: 1.02,
              backgroundColor: 'rgba(var(--primary), 0.1)'
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            className={`group flex items-center rounded-xl px-4 py-3 text-sm relative overflow-hidden`}
            onHoverStart={() => setHoveredItem(item.href)}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <motion.div
              initial={false}
              animate={{
                opacity: hoveredItem === item.href ? 1 : 0
              }}
              className='absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 dark:from-primary/20 dark:via-accent/20 dark:to-primary/20'
            />

            <div className='relative z-10 flex items-center gap-3 w-full'>
              <motion.div
                className='relative flex items-center justify-center w-8 h-8'
                whileHover={{ scale: 1.1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17
                }}
              >
                <item.icon className='h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors' />
              </motion.div>

              <AnimatePresence mode='wait'>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className='flex items-center justify-between flex-1 whitespace-nowrap'
                  >
                    <span className='font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
                      {item.label}
                    </span>
                    {item.isPro && (
                      <motion.span
                        initial={{ opacity: 0.8, scale: 0.95 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className='text-xs px-2 py-0.5 rounded-md bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30'
                      >
                        PRO
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Link>
      ))}
    </nav>
  );
};

// Storage Used Component
const StorageUsed = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence mode='wait'>
    <motion.div
      key={isOpen ? 'expanded' : 'collapsed'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className='absolute bottom-0 left-0 right-0 p-4'
    >
      <div className='rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 border border-border backdrop-blur-xl'>
        {isOpen ? (
          <div className='space-y-3'>
            <p className='text-xs text-muted-foreground'>Storage Used</p>
            <div className='h-1.5 w-full bg-background/70 rounded-full overflow-hidden backdrop-blur-xl'>
              <motion.div
                className='h-full bg-gradient-to-r from-primary/80 to-accent/80'
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-xs text-foreground'>3.2GB of 5GB used</p>
              <span className='text-[10px] text-muted-foreground'>65%</span>
            </div>
          </div>
        ) : (
          <div className='flex justify-center'>
            <div className='h-1.5 w-8 bg-background/70 rounded-full overflow-hidden backdrop-blur-xl'>
              <motion.div
                className='h-full bg-gradient-to-r from-primary/80 to-accent/80'
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  </AnimatePresence>
);

// Auth Button Component
const AuthButton = ({
  isOpen,
  icon: Icon,
  label,
  onClick
}: {
  isOpen: boolean;
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className='w-full mt-4 relative group cursor-pointer'
    >
      <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl' />
      <div className='relative h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 p-[1px] overflow-hidden'>
        <div className='h-full w-full rounded-xl bg-background/95 flex items-center gap-3 px-4 backdrop-blur-xl group-hover:bg-background/80 transition-colors duration-300'>
          <div className='flex items-center gap-3 relative z-10 w-full justify-between'>
            <div className='flex items-center gap-3'>
              <Icon className='h-4 w-4 text-primary' />
              <AnimatePresence mode='wait'>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <span className='text-sm font-medium whitespace-nowrap text-foreground'>
                      {label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
