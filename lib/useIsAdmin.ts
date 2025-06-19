'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../pages/api/lib/supabaseClient';

export function useIsAdmin() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data.is_admin);
      }
    };

    checkAdmin();
  }, [user]);

  return isAdmin;
}
