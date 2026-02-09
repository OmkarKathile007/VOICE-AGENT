// 'use client';

// import React, { useState } from 'react';
// import { Listing } from '@/types';
// import { ListingCard } from '@/components/ListingCard';
// import { NeonButton } from '@/components/NeonButton';
// import { GlassCard } from '@/components/GlassCard';
// import { Plus, X, Sprout } from 'lucide-react';

// export default function ListingsPage() {
//   const [showForm, setShowForm] = useState(false);
  
//   // MOCK DATA
//   const [listings, setListings] = useState<Listing[]>([
//     {
//       id: '1',
//       crop: 'Wheat (Lokwan)',
//       quantity: '50 Quintals',
//       price: '2400',
//       location: 'Pune District',
//       source: 'voice',
//       createdAt: new Date()
//     },
//     {
//       id: '2',
//       crop: 'Onions',
//       quantity: '2 Tons',
//       price: '1800',
//       location: 'Nashik',
//       source: 'manual',
//       createdAt: new Date()
//     }
//   ]);

//   // Form State
//   const [formData, setFormData] = useState({
//     crop: '',
//     quantity: '',
//     price: '',
//     location: ''
//   });

//   const handleCreate = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newListing: Listing = {
//       id: Date.now().toString(),
//       ...formData,
//       source: 'manual',
//       createdAt: new Date()
//     };
    
//     setListings([newListing, ...listings]);
//     setFormData({ crop: '', quantity: '', price: '', location: '' });
//     setShowForm(false);
//   };

//   return (
//     <div className="space-y-8 animate-in fade-in duration-700">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white">My Listings</h1>
//           <p className="text-slate-400">Manage your crops and market availability</p>
//         </div>
        
//         {!showForm && (
//           <NeonButton onClick={() => setShowForm(true)}>
//             <Plus className="w-4 h-4" />
//             Add New Crop
//           </NeonButton>
//         )}
//       </div>

//       {/* Creation Form (Toggles) */}
//       {showForm && (
//         <GlassCard className="border-agri-500/30 bg-agri-900/20">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-agri-400 flex items-center gap-2">
//               <Sprout className="w-5 h-5" />
//               New Listing
//             </h3>
//             <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm text-slate-400">Crop Name</label>
//               <input 
//                 required
//                 type="text" 
//                 placeholder="e.g. Basmati Rice"
//                 className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
//                 value={formData.crop}
//                 onChange={e => setFormData({...formData, crop: e.target.value})}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm text-slate-400">Quantity</label>
//               <input 
//                 required
//                 type="text" 
//                 placeholder="e.g. 100 kg"
//                 className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
//                 value={formData.quantity}
//                 onChange={e => setFormData({...formData, quantity: e.target.value})}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm text-slate-400">Price (₹)</label>
//               <input 
//                 required
//                 type="number" 
//                 placeholder="e.g. 5000"
//                 className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
//                 value={formData.price}
//                 onChange={e => setFormData({...formData, price: e.target.value})}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm text-slate-400">Location</label>
//               <input 
//                 required
//                 type="text" 
//                 placeholder="e.g. Village Name"
//                 className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-agri-500 focus:outline-none transition-colors"
//                 value={formData.location}
//                 onChange={e => setFormData({...formData, location: e.target.value})}
//               />
//             </div>

//             <div className="md:col-span-2 pt-4 flex justify-end gap-3">
//               <NeonButton type="button" variant="secondary" onClick={() => setShowForm(false)}>
//                 Cancel
//               </NeonButton>
//               <NeonButton type="submit">
//                 Publish Listing
//               </NeonButton>
//             </div>
//           </form>
//         </GlassCard>
//       )}

//       {/* Grid of Listings */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {listings.map((item) => (
//           <ListingCard key={item.id} data={item} />
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { api, Listing } from '@/lib/api'; // Ensure you created lib/api.ts
import { ListingCard } from '@/components/ListingCard';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import { Plus, X, Sprout, Loader2, Trash2 } from 'lucide-react';

export default function ListingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Load Data from Backend on Mount
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await api.getListings();
    setListings(data);
    setLoading(false);
  };

  // Form State
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    price: '',
    location: ''
  });

  // 2. Handle Create (Send to Backend)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Call the API
    const newItem = await api.createListing({
      ...formData,
      source: 'manual'
    });

    if (newItem) {
      // Add to UI immediately
      setListings([newItem, ...listings]);
      setFormData({ crop: '', quantity: '', price: '', location: '' });
      setShowForm(false);
    }
    
    setSubmitting(false);
  };

  // 3. Handle Delete (Send to Backend)
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    const success = await api.deleteListing(id);
    if (success) {
      setListings(listings.filter(l => l.id !== id));
    }
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
              <NeonButton type="submit" disabled={submitting} isLoading={submitting}>
                {submitting ? 'Saving...' : 'Publish Listing'}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-agri-500 animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 opacity-50">
          <p className="text-xl text-slate-400">No listings found.</p>
          <p className="text-sm text-slate-500">Create one manually or ask the Voice Assistant.</p>
        </div>
      ) : (
        /* Grid of Listings */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="relative group">
              <ListingCard data={item} />
              
              {/* Delete Button (Appears on Hover) */}
              <button 
                onClick={() => item.id && handleDelete(item.id)}
                className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/40 z-20"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}