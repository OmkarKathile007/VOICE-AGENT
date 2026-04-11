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

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { api, Listing } from '@/lib/api'; // Ensure you created lib/api.ts
// import { ListingCard } from '@/components/ListingCard';
// import { NeonButton } from '@/components/NeonButton';
// import { GlassCard } from '@/components/GlassCard';
// import { Plus, X, Sprout, Loader2, Trash2 } from 'lucide-react';

// export default function ListingsPage() {
//   const [showForm, setShowForm] = useState(false);
//   const [listings, setListings] = useState<Listing[]>([]);
  
//   // Loading States
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // 1. Load Data from Backend on Mount
//   useEffect(() => {
//     loadListings();
//   }, []);

//   const loadListings = async () => {
//     setLoading(true);
//     const data = await api.getListings();
//     setListings(data);
//     setLoading(false);
//   };

//   // Form State
//   const [formData, setFormData] = useState({
//     crop: '',
//     quantity: '',
//     price: '',
//     location: ''
//   });

//   // 2. Handle Create (Send to Backend)
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     // Call the API
//     const newItem = await api.createListing({
//       ...formData,
//       source: 'manual'
//     });

//     if (newItem) {
//       // Add to UI immediately
//       setListings([newItem, ...listings]);
//       setFormData({ crop: '', quantity: '', price: '', location: '' });
//       setShowForm(false);
//     }
    
//     setSubmitting(false);
//   };

//   // 3. Handle Delete (Send to Backend)
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this listing?')) return;
    
//     const success = await api.deleteListing(id);
//     if (success) {
//       setListings(listings.filter(l => l.id !== id));
//     }
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
//               <NeonButton type="submit" disabled={submitting} isLoading={submitting}>
//                 {submitting ? 'Saving...' : 'Publish Listing'}
//               </NeonButton>
//             </div>
//           </form>
//         </GlassCard>
//       )}

//       {/* Main Content Area */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="w-8 h-8 text-agri-500 animate-spin" />
//         </div>
//       ) : listings.length === 0 ? (
//         /* Empty State */
//         <div className="text-center py-20 opacity-50">
//           <p className="text-xl text-slate-400">No listings found.</p>
//           <p className="text-sm text-slate-500">Create one manually or ask the Voice Assistant.</p>
//         </div>
//       ) : (
//         /* Grid of Listings */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {listings.map((item) => (
//             <div key={item.id} className="relative group">
//               <ListingCard data={item} />
              
//               {/* Delete Button (Appears on Hover) */}
//               <button 
//                 onClick={() => item.id && handleDelete(item.id)}
//                 className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/40 z-20"
//                 title="Delete Listing"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { api, Listing } from '@/lib/api'; 
import { ListingCard } from '@/components/ListingCard';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import { Plus, X, Sprout, Loader2, Trash2, Database, AlertCircle } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
      {/* ========================================
        HEADER SECTION (HUD STYLE)
        ======================================== */}
      <div className="relative border-b border-cyan-900/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
            <Database className="w-7 h-7 text-cyan-400" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Active Listings
            </h1>
            <p className="text-cyan-500/80 font-mono text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Inventory Grid Online
            </p>
          </div>
        </div>
        
        {!showForm && (
          <div className="relative z-10 w-full md:w-auto">
            <NeonButton onClick={() => setShowForm(true)} className="w-full md:w-auto group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Initialize New Entry
            </NeonButton>
          </div>
        )}
      </div>

      {/* ========================================
        CREATION FORM (DATA TERMINAL)
        ======================================== */}
      {showForm && (
        <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/40 via-slate-900/20 to-blue-500/30 p-[1px] shadow-[0_0_40px_-10px_rgba(8,145,178,0.25)] mb-10 animate-in zoom-in-95 duration-500">
          <GlassCard className="relative bg-[#030712]/95 backdrop-blur-2xl border-none rounded-2xl p-6 md:p-8 overflow-hidden">
            
            {/* Cyber HUD accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-[80px] pointer-events-none" />

            <div className="flex justify-between items-center mb-8 pb-4 border-b border-cyan-900/30">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/50">
                  <Sprout className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
                Data Entry Protocol
              </h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white hover:bg-red-950/50 hover:border-red-900/50 border border-transparent transition-all group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              {/* Form Input fields formatted like Terminal lines */}
              <div className="space-y-2 group">
                <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-cyan-700">{'>'}</span> Specie / Crop Name
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Basmati Rice"
                  className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
                  value={formData.crop}
                  onChange={e => setFormData({...formData, crop: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 group">
                <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-cyan-700">{'>'}</span> Yield Quantity
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 100 kg"
                  className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-cyan-700">{'>'}</span> Market Value (₹)
                </label>
                <input 
                  required
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-cyan-700">{'>'}</span> Grid Location
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Pune Node"
                  className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-cyan-900/30 mt-2">
                <button 
                  type="button" 
                  className="px-6 py-2.5 rounded-lg border border-cyan-900/50 text-cyan-400 font-mono text-sm tracking-wider hover:bg-cyan-950/30 transition-colors"
                  onClick={() => setShowForm(false)}
                >
                  ABORT
                </button>
                <NeonButton type="submit" disabled={submitting} isLoading={submitting}>
                  {submitting ? 'Transmitting...' : 'Execute Upload'}
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ========================================
        MAIN CONTENT AREA (DATA GRID)
        ======================================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950/20 border border-cyan-500/20 shadow-[0_0_30px_rgba(8,145,178,0.15)]">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-300 animate-[spin_2s_linear_infinite]" />
          </div>
          <p className="text-cyan-500 font-mono text-sm tracking-widest uppercase animate-pulse">
            Querying Grid Database...
          </p>
        </div>
      ) : listings.length === 0 ? (
        
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl border-2 border-dashed border-cyan-900/40 bg-cyan-950/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
          <AlertCircle className="w-12 h-12 text-cyan-700 mb-4" />
          <h3 className="text-xl font-mono text-cyan-300 uppercase tracking-widest mb-2">No Records Found</h3>
          <p className="text-cyan-600/80 max-w-md">
            The inventory grid is currently empty. Initialize a manual entry or transmit data via the Voice Assistant protocol.
          </p>
        </div>

      ) : (
        
        /* Grid of Listings */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {listings.map((item) => (
            <div key={item.id} className="relative group/card animate-in fade-in zoom-in-95 duration-500">
              
              {/* Wrapped the existing ListingCard to retain its internal structure, 
                  but allowing the wrapper to handle the hover/delete mechanics */}
              <div className="transition-transform duration-300 group-hover/card:-translate-y-1">
                <ListingCard data={item} />
              </div>
              
              {/* Delete Button (High-Tech Red Warning Style) */}
              <button 
                onClick={() => item.id && handleDelete(item.id)}
                className="absolute top-3 right-3 p-2.5 bg-slate-950/80 border border-red-900/50 text-red-500 rounded-lg opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 hover:bg-red-950 hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] z-20 backdrop-blur-md flex items-center justify-center"
                title="Purge Record"
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