import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LotCard from '../components/cards/LotCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Search, MapPin, Filter } from 'lucide-react';

const BrowseLots = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering parameter keys
  const [cropName, setCropName] = useState('');
  const [location, setLocation] = useState('');

  const fetchAvailableLots = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/lots?cropName=${cropName}&location=${location}`);
      setLots(data || []);
    } catch (error) {
      console.error('Failed aggregating crop marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAvailableLots();
    }, 400); // 400ms filter throttling interface delay

    return () => clearTimeout(delayDebounceFn);
  }, [cropName, location]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-800">Browse Crop Harvests</h2>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
          Discover verified farm inventory lots available for real-time procurement procurement bidding.
        </p>
      </div>

      {/* Responsive Filter Architecture Dashboard Panel */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 md:grid-cols-3 items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="Search crop name (e.g., Wheat, Rice)..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
            <MapPin className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter location (e.g., Punjab, Nashik)..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold sm:col-span-2 md:col-span-1 justify-end px-2">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Active Context Filters Matrix</span>
        </div>
      </div>

      {/* Grid Execution Layer */}
      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader size="lg" /></div>
      ) : lots.length === 0 ? (
        <EmptyState title="No crops match your active parameters" description="Try editing search spellings or expanding geographical locations." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => (
            <LotCard key={lot._id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseLots;
