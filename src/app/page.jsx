'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BootSequence from '../components/BootSequence';

export default function RootLoaderPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const router = useRouter();

  // If boot completes, redirect to immersive view.
  useEffect(() => {
    if (bootComplete) {
      router.push('/immersive');
    }
  }, [bootComplete, router]);

  return (
    <main style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <BootSequence onComplete={() => setBootComplete(true)} />
    </main>
  );
}
