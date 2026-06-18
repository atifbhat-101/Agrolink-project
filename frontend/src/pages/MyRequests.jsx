import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RequestCard from '../components/cards/RequestCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentOffersList = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/requests/buyer');
        setRequests(data || []);
      } catch (error) {
        console.error('Failed collecting sent procurement ledgers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSentOffersList();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-800">My Sent Bidding Proposals</h2>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
          Monitor your dispatched procurement offers and workflow validation states.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No active bids placed" description="Browse the harvest lot catalogue to send transaction offers." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <RequestCard key={req._id} request={req} role="buyer" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
