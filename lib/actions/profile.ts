'use server';

import { profileService } from '../services/ProfileService';
import { Profile } from '../types/profile';

export async function getProfile() {
  return profileService.getProfile();
}

export async function updateProfile(data: Profile) {
  return profileService.updateProfile(data);
}
