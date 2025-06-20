'use client';

import { useState, useEffect } from 'react';
import { useIsAdmin } from '@/lib/useIsAdmin';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPanel() {
  const isAdmin = useIsAdmin();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      const loadUsers = async () => {
        const { data, error } = await supabase.from('users').select('*');
        if (!error) setUsers(data);
      };
      loadUsers();
    }
  }, [isAdmin]);

  const promoteUser = async (id: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', id);

    if (!error) {
      setUsers(users.map((u) => (u.id === id ? { ...u, is_admin: true } : u)));
    }
  };

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h1>Admin Panel</h1>
        {isAdmin ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.email} — Admin: {user.is_admin ? 'Yes' : 'No'}
                {!user.is_admin && (
                  <button onClick={() => promoteUser(user.id)}>Promote</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You do not have admin access.</p>
        )}
      </SignedIn>
    </div>
  );
}
