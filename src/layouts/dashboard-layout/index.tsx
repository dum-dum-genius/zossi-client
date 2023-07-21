import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/buttons/button';
import { AuthContext } from '@/contexts/auth-context';
import { UserAvatar } from '@/components/avatars/user-avatar';
import { Text } from '@/components/texts/text';
import { UserContext } from '@/contexts/user-context';

type Props = {
  children: JSX.Element;
};

export function DashboardLayout({ children }: Props) {
  const { signOut } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const handleLogoutClick = () => {
    signOut();
  };

  return (
    <div className="h-screen flex flex-row">
      <div className="bg-stone-800 basis-60 shrink-0 h-full flex flex-col">
        <div className="grow p-5 flex flex-col">
          <Link href="/dashboard/account/profile" className="mt-3">
            <div className="flex items-center">
              {user && <UserAvatar user={user} />}
              <div className="ml-2">
                <Text>{user?.getUsername() || ''}</Text>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/worlds" className="mt-4">
            <Button text="My worlds" fullWidth />
          </Link>
        </div>
        <div className="shrink-0 p-5 flex flex-col">
          <Button text="Logout" onClick={handleLogoutClick} />
        </div>
      </div>
      <div className="grow h-full bg-[#1E1E1E] px-6 py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
