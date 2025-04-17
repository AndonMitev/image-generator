// Auth related constants
export enum AuthProvider {
  MAGIC_LINK = 'magic-link',
  GOOGLE = 'google',
  TWITTER = 'twitter'
}

export enum Routes {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  PROFILE = '/profile',
  GENERATE = '/generate'
}

// Protected routes that require authentication
export const PROTECTED_ROUTES = [Routes.GENERATE, Routes.PROFILE];
