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



// 'use client';

// import React, { useState, useEffect } from 'react';
// import { api, Listing } from '@/lib/api'; 
// import { ListingCard } from '@/components/ListingCard';
// import { NeonButton } from '@/components/NeonButton';
// import { GlassCard } from '@/components/GlassCard';
// import { Plus, X, Sprout, Loader2, Trash2, Database, AlertCircle } from 'lucide-react';

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
//     <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
//       {/* ========================================
//         HEADER SECTION (HUD STYLE)
//         ======================================== */}
//       <div className="relative border-b border-cyan-900/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
//         <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        
//         <div className="relative z-10 flex items-center gap-4">
//           <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
//             <Database className="w-7 h-7 text-cyan-400" />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
//           </div>
//           <div>
//             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
//               Active Listings
//             </h1>
//             <p className="text-cyan-500/80 font-mono text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//               Inventory Grid Online
//             </p>
//           </div>
//         </div>
        
//         {!showForm && (
//           <div className="relative z-10 w-full md:w-auto">
//             <NeonButton onClick={() => setShowForm(true)} className="w-full md:w-auto group">
//               <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
//               Initialize New Entry
//             </NeonButton>
//           </div>
//         )}
//       </div>

//       {/* ========================================
//         CREATION FORM (DATA TERMINAL)
//         ======================================== */}
//       {showForm && (
//         <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/40 via-slate-900/20 to-blue-500/30 p-[1px] shadow-[0_0_40px_-10px_rgba(8,145,178,0.25)] mb-10 animate-in zoom-in-95 duration-500">
//           <GlassCard className="relative bg-[#030712]/95 backdrop-blur-2xl border-none rounded-2xl p-6 md:p-8 overflow-hidden">
            
//             {/* Cyber HUD accents */}
//             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] pointer-events-none" />
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-[80px] pointer-events-none" />

//             <div className="flex justify-between items-center mb-8 pb-4 border-b border-cyan-900/30">
//               <h3 className="text-xl font-semibold text-white flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/50">
//                   <Sprout className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
//                 </div>
//                 Data Entry Protocol
//               </h3>
//               <button 
//                 onClick={() => setShowForm(false)} 
//                 className="p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white hover:bg-red-950/50 hover:border-red-900/50 border border-transparent transition-all group"
//               >
//                 <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//               </button>
//             </div>

//             <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
//               {/* Form Input fields formatted like Terminal lines */}
//               <div className="space-y-2 group">
//                 <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
//                   <span className="text-cyan-700">{'>'}</span> Specie / Crop Name
//                 </label>
//                 <input 
//                   required
//                   type="text" 
//                   placeholder="e.g. Basmati Rice"
//                   className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
//                   value={formData.crop}
//                   onChange={e => setFormData({...formData, crop: e.target.value})}
//                 />
//               </div>
              
//               <div className="space-y-2 group">
//                 <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
//                   <span className="text-cyan-700">{'>'}</span> Yield Quantity
//                 </label>
//                 <input 
//                   required
//                   type="text" 
//                   placeholder="e.g. 100 kg"
//                   className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
//                   value={formData.quantity}
//                   onChange={e => setFormData({...formData, quantity: e.target.value})}
//                 />
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
//                   <span className="text-cyan-700">{'>'}</span> Market Value (₹)
//                 </label>
//                 <input 
//                   required
//                   type="number" 
//                   placeholder="e.g. 5000"
//                   className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
//                   value={formData.price}
//                   onChange={e => setFormData({...formData, price: e.target.value})}
//                 />
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-xs font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
//                   <span className="text-cyan-700">{'>'}</span> Grid Location
//                 </label>
//                 <input 
//                   required
//                   type="text" 
//                   placeholder="e.g. Pune Node"
//                   className="w-full bg-[#030712]/60 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 group-hover:border-cyan-800"
//                   value={formData.location}
//                   onChange={e => setFormData({...formData, location: e.target.value})}
//                 />
//               </div>

//               <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-cyan-900/30 mt-2">
//                 <button 
//                   type="button" 
//                   className="px-6 py-2.5 rounded-lg border border-cyan-900/50 text-cyan-400 font-mono text-sm tracking-wider hover:bg-cyan-950/30 transition-colors"
//                   onClick={() => setShowForm(false)}
//                 >
//                   ABORT
//                 </button>
//                 <NeonButton type="submit" disabled={submitting} isLoading={submitting}>
//                   {submitting ? 'Transmitting...' : 'Execute Upload'}
//                 </NeonButton>
//               </div>
//             </form>
//           </GlassCard>
//         </div>
//       )}

//       {/* ========================================
//         MAIN CONTENT AREA (DATA GRID)
//         ======================================== */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-32 space-y-4">
//           <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950/20 border border-cyan-500/20 shadow-[0_0_30px_rgba(8,145,178,0.15)]">
//             <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
//             <div className="absolute inset-0 rounded-full border-t-2 border-cyan-300 animate-[spin_2s_linear_infinite]" />
//           </div>
//           <p className="text-cyan-500 font-mono text-sm tracking-widest uppercase animate-pulse">
//             Querying Grid Database...
//           </p>
//         </div>
//       ) : listings.length === 0 ? (
        
//         /* Empty State */
//         <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl border-2 border-dashed border-cyan-900/40 bg-cyan-950/10 backdrop-blur-sm relative overflow-hidden group">
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
//           <AlertCircle className="w-12 h-12 text-cyan-700 mb-4" />
//           <h3 className="text-xl font-mono text-cyan-300 uppercase tracking-widest mb-2">No Records Found</h3>
//           <p className="text-cyan-600/80 max-w-md">
//             The inventory grid is currently empty. Initialize a manual entry or transmit data via the Voice Assistant protocol.
//           </p>
//         </div>

//       ) : (
        
//         /* Grid of Listings */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//           {listings.map((item) => (
//             <div key={item.id} className="relative group/card animate-in fade-in zoom-in-95 duration-500">
              
//               {/* Wrapped the existing ListingCard to retain its internal structure, 
//                   but allowing the wrapper to handle the hover/delete mechanics */}
//               <div className="transition-transform duration-300 group-hover/card:-translate-y-1">
//                 <ListingCard data={item} />
//               </div>
              
//               {/* Delete Button (High-Tech Red Warning Style) */}
//               <button 
//                 onClick={() => item.id && handleDelete(item.id)}
//                 className="absolute top-3 right-3 p-2.5 bg-slate-950/80 border border-red-900/50 text-red-500 rounded-lg opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 hover:bg-red-950 hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] z-20 backdrop-blur-md flex items-center justify-center"
//                 title="Purge Record"
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
import {
  Plus, X, Sprout, Loader2, Trash2, Database,
  AlertCircle, MapPin, Package, IndianRupee, Leaf,
  TrendingUp, Wheat, Filter, Search
} from 'lucide-react';

/* ─── Stat pill ──────────────────────────────────────────────────────────── */
function StatPill({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: any; color: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${color} bg-white/60 backdrop-blur-sm`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold ml-1">{value}</span>
    </div>
  );
}

/* ─── Listing card (redesigned) ─────────────────────────────────────────── */
function CropCard({ item, onDelete }: { item: Listing; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const isVoice = item.source === 'voice';

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
        boxShadow: hovered
          ? '0 20px 60px -10px rgba(21,128,61,0.25), 0 4px 20px rgba(0,0,0,0.08)'
          : '0 2px 16px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card bg with grain texture */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-500"
        style={{
          background: hovered
            ? 'linear-gradient(90deg, #15803d, #84cc16, #ca8a04)'
            : 'linear-gradient(90deg, #15803d, #16a34a)',
        }}
      />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: hovered ? '#f0fdf4' : '#f7fee7',
                border: '1.5px solid',
                borderColor: hovered ? '#86efac' : '#d9f99d',
              }}
            >
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight capitalize">{item.crop}</h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5 inline-block"
                style={{
                  background: isVoice ? '#fef3c7' : '#f0f9ff',
                  color: isVoice ? '#92400e' : '#075985',
                }}
              >
                {isVoice ? '🎙 Voice' : '✏️ Manual'}
              </span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => { e.stopPropagation(); item.id && onDelete(item.id); }}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-50 text-gray-300 hover:text-red-500"
            title="Remove listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Price — hero element */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-5 h-5 text-green-700 mb-0.5" />
            <span
              className="text-3xl font-black tracking-tight"
              style={{ color: '#15803d', fontVariantNumeric: 'tabular-nums' }}
            >
              {Number(item.price).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 ml-1 font-medium">per unit</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-4" />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Package className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-gray-600">{item.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-gray-600">{item.location}</span>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: '#f0fdf4', color: '#16a34a' }}
          >
            <TrendingUp className="w-3 h-3" />
            Live
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-green-800 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = `w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-800
  placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
  transition-all duration-200 text-sm font-medium`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ListingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ crop: '', quantity: '', price: '', location: '' });

  useEffect(() => { loadListings(); }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await api.getListings();
    setListings(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const newItem = await api.createListing({ ...formData, source: 'manual' });
    if (newItem) {
      setListings([newItem, ...listings]);
      setFormData({ crop: '', quantity: '', price: '', location: '' });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this listing?')) return;
    const success = await api.deleteListing(id);
    if (success) setListings(listings.filter(l => l.id !== id));
  };

  const filtered = listings.filter(l =>
    !search || l.crop?.toLowerCase().includes(search.toLowerCase()) || l.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: 'linear-gradient(160deg, #f0fdf4 0%, #fefce8 45%, #f7fee7 100%)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .card-stagger:nth-child(1) { animation-delay: 0ms; }
        .card-stagger:nth-child(2) { animation-delay: 60ms; }
        .card-stagger:nth-child(3) { animation-delay: 120ms; }
        .card-stagger:nth-child(4) { animation-delay: 180ms; }
        .card-stagger:nth-child(5) { animation-delay: 240ms; }
        .card-stagger:nth-child(6) { animation-delay: 300ms; }
        .shimmer-text {
          background: linear-gradient(90deg, #15803d 0%, #4ade80 40%, #ca8a04 60%, #15803d 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ── Hero Header ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          {/* Decorative leaf bg */}
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
            style={{
              background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 70%, #16a34a 100%)',
              boxShadow: '0 24px 80px -12px rgba(21,128,61,0.4)',
            }}
          >
            {/* SVG leaf pattern bg */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 5 C20 5 5 20 5 40 C5 20 20 5 40 5 Z M40 5 C60 5 75 20 75 40 C75 20 60 5 40 5Z' fill='white'/%3E%3Cpath d='M40 75 C20 75 5 60 5 40 C5 60 20 75 40 75 Z M40 75 C60 75 75 60 75 40 C75 60 60 75 40 75Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '80px',
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-green-100 text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
                    Market Live
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-green-200 text-[11px] font-bold uppercase tracking-widest">
                    <Wheat className="w-3 h-3" />
                    Kharif Season 2025
                  </span>
                </div>
                <h1
                  className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight mb-2"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Active Listings
                </h1>
                <p className="text-green-200 text-sm font-medium">
                  {listings.length} crops listed across {[...new Set(listings.map(l => l.location))].length} markets
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-white">{listings.length}</span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Total</span>
                </div>
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-lime-300">
                    {listings.filter(l => l.source === 'voice').length}
                  </span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Voice</span>
                </div>
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-amber-300">
                    {[...new Set(listings.map(l => l.location))].length}
                  </span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Markets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crop or market..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-green-200 bg-white text-gray-700 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-600 text-sm font-semibold hover:border-green-400 hover:text-green-700 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                  boxShadow: '0 4px 20px rgba(21,128,61,0.35)',
                }}
              >
                <Plus className="w-4 h-4" />
                New Listing
              </button>
            )}
          </div>
        </div>

        {/* ── Create Form ── */}
        {showForm && (
          <div className="animate-scale-in rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: '0 24px 80px -12px rgba(21,128,61,0.2)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-lime-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base" style={{ fontFamily: "'Lora', serif" }}>
                    Add New Crop Listing
                  </h3>
                  <p className="text-green-300 text-xs">Fill in your produce details</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-6 md:p-8">
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Field label="Crop / Produce Name">
                    <input required type="text" placeholder="e.g. Basmati Rice" className={inputCls}
                      value={formData.crop} onChange={e => setFormData({ ...formData, crop: e.target.value })} />
                  </Field>
                  <Field label="Quantity Available">
                    <input required type="text" placeholder="e.g. 100 kg" className={inputCls}
                      value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                  </Field>
                  <Field label="Price per Unit (₹)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-sm">₹</span>
                      <input required type="number" placeholder="5000" className={`${inputCls} pl-8`}
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                  </Field>
                  <Field label="Market Location">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                      <input required type="text" placeholder="e.g. Pune APMC" className={`${inputCls} pl-10`}
                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                  </Field>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 hover:text-gray-700 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)', boxShadow: '0 4px 16px rgba(21,128,61,0.3)' }}
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Sprout className="w-4 h-4" /> Publish Listing</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
              <Leaf className="absolute inset-0 m-auto w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-semibold">Loading market data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-green-200 bg-white/50 text-center animate-fade-up"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
              <Sprout className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: "'Lora', serif" }}>
              {search ? 'No crops found' : 'No listings yet'}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              {search
                ? `No results for "${search}". Try a different crop or market name.`
                : 'Start by adding your first crop listing or use the Voice Assistant to dictate it.'}
            </p>
            {!search && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
              >
                <Plus className="w-4 h-4" /> Add First Listing
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-up card-stagger"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CropCard item={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {/* ── Footer note ── */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 font-medium pb-4">
            Showing {filtered.length} of {listings.length} listings · Prices in INR · Updated live
          </p>
        )}
      </div>
    </div>
  );
}