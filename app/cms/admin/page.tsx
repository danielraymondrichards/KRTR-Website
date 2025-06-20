// cms/admin/page.tsx
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



  const removeUser = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) setUsers(users.filter((u) => u.id !== id));
  };

  if (isAdmin === null) return <p>Checking access…</p>;
  if (!isAdmin) return <p className="text-red-600">Access denied: Admins only.</p>;

  return (
    <SignedIn>
      <div>
        <h1 className="cms-title">Admin Panel</h1>

        <div className="my-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + Add New User
          </button>
        </div>

        <table className="w-full table-auto border-collapse border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Name</th>
              <th className="text-left p-2 border">Email</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2 border">{u.name || 'N/A'}</td>
                <td className="p-2 border">
  <button className="text-blue-600 mr-4">Reset Password</button>
  {!u.is_admin && (
    <button
      className="text-green-600 mr-4"
      onClick={() => promoteUser(u.id)}
    >
      Promote to Admin
    </button>
  )}
  <button className="text-red-600" onClick={() => removeUser(u.id)}>
    Delete
  </button>
</td>

                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-4">Reset Password</button>
                  <button className="text-red-600" onClick={() => removeUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SignedIn>
  );
}
