import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/cards/StatCard';
import LotCard from '../components/cards/LotCard';
import RequestCard from '../components/cards/RequestCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Sprout, TrendingUp, Handshake, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLots: 0, pendingOffers: 0, dealsClosed: 0 });
  const [recentLots, setRecentLots] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  const [lotPage, setLotPage] = useState(1);
  const [offerPage, setOfferPage] = useState(1);
  const LOTS_PER_PAGE = 4;
  const OFFERS_PER_PAGE = 4;

  useEffect(() => {
    const fetchDashboardContent = async () => {
      try {
        setLoading(true);
        if (user.role === 'farmer') {
          const lotsRes = await api.get('/lots/my-lots');
          const requestsRes = await api.get('/requests/farmer');
          
          const lotsData = lotsRes.data || [];
          const offersData = requestsRes.data || [];

          setRecentLots(lotsData);
          setRecentOffers(offersData);
          setLotPage(1);
          setOfferPage(1);
          setStats({
            totalLots: lotsData.length,
            pendingOffers: offersData.filter(o => o.status === 'pending').length,
            dealsClosed: lotsData.filter(l => l.status === 'sold').length
          });
        } else {
          const lotsRes = await api.get('/lots');
          const requestsRes = await api.get('/requests/buyer');
          
          const lotsData = lotsRes.data || [];
          const offersData = requestsRes.data || [];

          setRecentLots(lotsData);
          setRecentOffers(offersData);
          setLotPage(1);
          setOfferPage(1);
          setStats({
            totalLots: lotsData.length,
            pendingOffers: offersData.filter(o => o.status === 'pending').length,
            dealsClosed: offersData.filter(o => o.status === 'accepted').length
          });
        }
      } catch (error) {
        console.error('Operational dashboard aggregation error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardContent();
  }, [user]);

  const handleOfferStatusUpdate = async (offerId, nextStatus) => {
    try {
      await api.put(`/requests/${offerId}/status`, { status: nextStatus });
      // Reactive local visual correction refresh
      setRecentOffers(prev => prev.map(o => o._id === offerId ? { ...o, status: nextStatus } : o));
      if (nextStatus === 'accepted') {
        setStats(prev => ({ ...prev, pendingOffers: Math.max(0, prev.pendingOffers - 1), dealsClosed: prev.dealsClosed + 1 }));
      } else {
        setStats(prev => ({ ...prev, pendingOffers: Math.max(0, prev.pendingOffers - 1) }));
      }
    } catch (err) {
      console.error('Bargaining validation operational flow update mutation rejected:', err);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

  const totalLotPages = Math.ceil(recentLots.length / LOTS_PER_PAGE) || 1;
  const totalOfferPages = Math.ceil(recentOffers.length / OFFERS_PER_PAGE) || 1;
  const paginatedLots = recentLots.slice((lotPage - 1) * LOTS_PER_PAGE, lotPage * LOTS_PER_PAGE);
  const paginatedOffers = recentOffers.slice((offerPage - 1) * OFFERS_PER_PAGE, offerPage * OFFERS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-neutral-800">Hello, {user?.name} 👋</h2>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
          Workspace Account Role Architecture: <span className="text-emerald-600 font-bold">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard 
          title={user.role === 'farmer' ? 'My Listed Harvests' : 'Available Crop Lots'} 
          value={stats.totalLots} 
          icon={Sprout} 
          color="emerald" 
        />
        <StatCard 
          title="Active Pending Offers" 
          value={stats.pendingOffers} 
          icon={TrendingUp} 
          color="amber" 
        />
        <StatCard 
          title="Completed Transactions" 
          value={stats.dealsClosed} 
          icon={Handshake} 
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-neutral-700 tracking-tight uppercase">
            {user.role === 'farmer' ? 'My Recent Harvest Listings' : 'Recent Market Opportunities'}
          </h3>
          {recentLots.length === 0 ? (
            <EmptyState title="No harvest records found" description="List your crop lots to begin tracking market interactions." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {paginatedLots.map(lot => <LotCard key={lot._id} lot={lot} />)}
              </div>
              {totalLotPages > 1 && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-sm">
                  <button
                    type="button"
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setLotPage(prev => Math.max(1, prev - 1))}
                    disabled={lotPage === 1}
                  >
                    Previous
                  </button>
                  <span className="font-semibold text-neutral-600">Page {lotPage} of {totalLotPages}</span>
                  <button
                    type="button"
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setLotPage(prev => Math.min(totalLotPages, prev + 1))}
                    disabled={lotPage === totalLotPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-700 tracking-tight uppercase">
            {user.role === 'farmer' ? 'Incoming Procurement Requests' : 'My Recent Sent Procurement Bids'}
          </h3>
          {recentOffers.length === 0 ? (
            <EmptyState title="No offers monitored" description="Bargaining dialogs and contract sheets will appear here." />
          ) : (
            <>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {paginatedOffers.map(offer => (
                  <RequestCard 
                    key={offer._id} 
                    request={offer} 
                    role={user.role} 
                    onStatusUpdate={handleOfferStatusUpdate} 
                  />
                ))}
              </div>
              {totalOfferPages > 1 && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-sm">
                  <button
                    type="button"
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setOfferPage(prev => Math.max(1, prev - 1))}
                    disabled={offerPage === 1}
                  >
                    Previous
                  </button>
                  <span className="font-semibold text-neutral-600">Page {offerPage} of {totalOfferPages}</span>
                  <button
                    type="button"
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setOfferPage(prev => Math.min(totalOfferPages, prev + 1))}
                    disabled={offerPage === totalOfferPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
