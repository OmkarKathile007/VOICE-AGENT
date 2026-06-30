'use client';

import React from 'react';
import { PageHeader } from '@/components/shg/primitives';
import { ListingQueue } from '@/components/shg/ListingQueue';
import { PackageCheck } from 'lucide-react';

export default function ApprovedPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={PackageCheck}
        title="Approved Products"
        subtitle="Listings you verified — now live on the marketplace."
      />
      <ListingQueue kind="approved" />
    </div>
  );
}
