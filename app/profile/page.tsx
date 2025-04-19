import { ProfileTabs } from './components/ProfileTabs';

export default async function ProfilePage() {
  return (
    <div className='min-h-screen bg-black p-8'>
      <ProfileTabs />
    </div>
  );
}
