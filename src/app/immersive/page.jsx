// app/immersive/page.jsx - Async Server Component
// -----------------------------------------------------------------
import React from 'react';
import ImmersiveClient from '../../components/ImmersiveClient';
import { fetchGithubRepos } from '../../lib/github';

export const dynamic = 'force-dynamic';

export default async function ImmersivePage() {
  // Fetch data server-side at request time (with ISR caching)
  const githubRepos = await fetchGithubRepos();

  return <ImmersiveClient githubRepos={githubRepos} />;
}
