'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) alert('Check your email for the login link!');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Sign In</h1>
      <input
        type="email"
        className="w-full border p-2 mt-2"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleLogin}>
        Send Magic Link
      </button>
    </div>
  );
}
