'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any | null>(null);

  useEffect(() => {
    supabase.from('assignments').select('*').single().then(({ data }) => {
      if (data) setAssignments(data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Homepage Assignments</h1>
      <pre>{JSON.stringify(assignments, null, 2)}</pre>
    </div>
  );
}