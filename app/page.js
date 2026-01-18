import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const token = cookies().get('spv_session');
  if (token?.value) {
    redirect('/chat');
  }
  redirect('/login');
}