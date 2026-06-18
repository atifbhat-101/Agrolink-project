import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RequestCard from '../components/cards/RequestCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const BuyerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIncomingOffersList = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests/farmer');
      setRequests(data || []);
    } catch (error) {
      console.error('Failed collecting incoming bidded sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingOffersList();
  }, []);

  const handleProcessOfferStatus = async (offerId, targetStatus) => {
    try {
      setActionLoading(true);
      await api.put(`/requests/${offerId}/status`, { status: targetStatus });
      setRequests((prev) =>
        prev.map((r) => (r._id === offerId ? { ...r, status: targetStatus } : r))
      );
    } catch (err) {
      console.error('Bargaining pipeline step transition error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-800">Incoming Buyer Proposals</h2>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
          Review, accept, or decline incoming crop procurement bids sent by merchants.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No incoming offers registered" description="Your published stock lots have not received merchant bids yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              role="farmer"
              onStatusUpdate={handleProcessOfferStatus}
              loading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerRequests;
