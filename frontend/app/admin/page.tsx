import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from './dashboard';
import { getBaseUrl } from '@/lib/utils';


async function checkAdmin() {
  const url = new URL('/api/auth/admin', getBaseUrl());
  const res = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: 'no-store',
  });


  if (!res.ok) {
    redirect('/login');
  }

  const authData = await res.json();

  if (!authData.is_admin) {
    redirect('/');
  }

  return authData;
}

export default async function AdminPage() {
  await checkAdmin();

  return <AdminDashboard />;
}
