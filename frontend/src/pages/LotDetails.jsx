import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { Scale, IndianRupee, MapPin, User, MessageCircle, Gavel, CheckCircle, AlertCircle } from 'lucide-react';

const LotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [biddingPrice, setBiddingPrice] = useState('');
  const [biddingQuantity, setBiddingQuantity] = useState('');
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchLot = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/lots/${id}`);
        setLot(data);

        if (data) {
          setBiddingPrice(data.pricePerUnit);
          setBiddingQuantity(data.quantity);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLot();
  }, [id]);

  const handleInitiateChatChannel = async () => {
    try {
      await api.post('/messages', {
        recipientId: lot.farmer._id,
        text: `Hello, interested in: ${lot.title}`
      });

      navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostBiddingOffer = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      setFeedback({ text: '', type: '' });

      await api.post('/requests', {
        lotId: lot._id,
        offeredPrice: Number(biddingPrice),
        quantityRequested: Number(biddingQuantity),
        note
      });

      setFeedback({
        text: 'Bid submitted successfully',
        type: 'success'
      });

      setTimeout(() => {
        setModalOpen(false);
        navigate('/my-requests');
      }, 1200);

    } catch (err) {
      setFeedback({
        text: err.response?.data?.message || 'Failed to submit bid',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
  if (!lot) return <div className="text-center py-10">Lot not found</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-4">

        <div className="rounded-xl overflow-hidden border">
          {lot.images ? (
            <img src={lot.images} alt="lot" className="w-full h-96 object-cover" />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 border rounded-xl">
          <h1 className="text-xl font-bold">{lot.title}</h1>
          <p className="text-sm text-gray-500">{lot.description}</p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-4">

        <div className="border rounded-xl p-4 space-y-3">
          <p>Stock: {lot.quantity} Qtl</p>
          <p>Price: ₹{lot.pricePerUnit}</p>
          <p>Farmer: {lot.farmer?.name}</p>

          {user?._id !== lot.farmer?._id && lot.status === 'available' && (
            <>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Place Offer
              </button>

              <button
                onClick={handleInitiateChatChannel}
                className="w-full border py-2 rounded"
              >
                Chat Farmer
              </button>
            </>
          )}
        </div>

      </div>

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Place Bid">

        <form onSubmit={handlePostBiddingOffer} className="space-y-3">

          {feedback.text && (
            <div className={`p-2 text-xs rounded ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {feedback.text}
            </div>
          )}

          <input
            type="number"
            value={biddingPrice}
            onChange={(e) => setBiddingPrice(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Price per Kg"
          />

          <input
            type="number"
            value={biddingQuantity}
            max={lot.quantity}
            onChange={(e) => setBiddingQuantity(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Quantity"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Note"
          />

          {/* BUTTONS */}
          <div className="flex gap-2 justify-end pt-2">

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {actionLoading ? 'Submitting...' : 'Submit Bid'}
            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default LotDetails;