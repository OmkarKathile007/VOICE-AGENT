'use client';

import React from 'react';
import { PageHeader } from '@/components/shg/primitives';
import { ListingQueue } from '@/components/shg/ListingQueue';
import { PackageX } from 'lucide-react';

export default function RejectedPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={PackageX}
        title="Rejected Products"
        subtitle="Listings returned to farmers for correction, with reasons."
      />
      <ListingQueue kind="rejected" />
    </div>
  );
}
