'use server';

import { profileService } from '@/lib/services/ProfileService';
import { Profile } from '@/lib/types/profile';

export async function getProfile() {
  return profileService.getProfile();
}

export async function updateProfile(data: Profile) {
  return profileService.updateProfile(data);
}
