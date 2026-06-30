'use client';

import React from 'react';
import { PageHeader } from '@/components/shg/primitives';
import { ListingQueue } from '@/components/shg/ListingQueue';
import { ClipboardCheck } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={ClipboardCheck}
        title="Pending Verification"
        subtitle="Review AI-extracted details and approve or reject each farmer listing."
      />
      <ListingQueue kind="pending" />
    </div>
  );
}
