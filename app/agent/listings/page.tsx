'use client';

import React, { useState } from 'react';
import { Listing } from '@/types';
import { ListingCard } from '@/components/ListingCard';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import { Plus, X, Sprout } from 'lucide-react';

export default function ListingsPage() {
  const [showForm, setShowForm] = useState(false);
  
  // MOCK DATA
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      crop: 'Wheat (Lokwan)',
      quantity: '50 Quintals',
      price: '2400',
      location: 'Pune District',
      source: 'voice',
      createdAt: new Date()
    },
    {
      id: '2',
      crop: 'Onions',
      quantity: '2 Tons',
      price: '1800',
      location: 'Nashik',
      source: 'manual',
      createdAt: new Date()
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    price: '',
    location: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: Listing = {
      id: Date.now().toString(),
      ...formData,
      source: 'manual',
      createdAt: new Date()
    };
    
    setListings([newListing, ...listings]);
    setFormData({ crop: '', quantity: '', price: '', location: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Listings</h1>
          <p className="text-slate-400">Manage your crops and market availability</p>
        </div>
        
        {!showForm && (
          <NeonButton onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            Add New Crop
          </NeonButton>
        )}
      </div>

      {/* Creation Form (Toggles) */}
      {showForm && (
        <GlassCard className="border-agri-500/30 bg-agri-900/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-agri-400 flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              New Listing
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Crop Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Basmati Rice"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
                value={formData.crop}
                onChange={e => setFormData({...formData, crop: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Quantity</label>
              <input 
                required
                type="text" 
                placeholder="e.g. 100 kg"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Price (₹)</label>
              <input 
                required
                type="number" 
                placeholder="e.g. 5000"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Location</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Village Name"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end gap-3">
              <NeonButton type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </NeonButton>
              <NeonButton type="submit">
                Publish Listing
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <ListingCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}