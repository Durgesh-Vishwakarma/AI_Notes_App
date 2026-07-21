import React from 'react';
import Seo from '../components/Seo';
import NotesDashboard from '../NotesDashboard';

export default function DashboardPage() {
  return (
    <>
      {/* noindex: this route is behind auth and has no public content */}
      <Seo
        title="Your notes"
        description="Your AI Notes dashboard."
        path="/app"
        noindex
      />
      <NotesDashboard />
    </>
  );
}
