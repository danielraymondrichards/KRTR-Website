// lib/useIsAdmin.ts
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from './supabaseClient';

export function useIsAdmin() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('clerk_id', user.id)
        .single();

      if (error) {
        console.error(error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin || false);
      }

      setChecking(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, checking };
}
