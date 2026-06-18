import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LotCard from '../components/cards/LotCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { PlusCircle, ImagePlus, Save, AlertCircle } from 'lucide-react';

const MyLots = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');

  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFarmerStockLogs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/lots/my-lots');

      if (Array.isArray(data)) {
        setLots(data);
      } else if (data?.lots) {
        setLots(data.lots);
      } else {
        setLots([]);
      }
    } catch (err) {
      console.error('Failed reading farmer ledger sheets:', err);
      setLots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerStockLogs();
  }, []);

  const handleGalleryMediaUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const dataPayload = new FormData();
    dataPayload.append('image', file);

    try {
      setUploading(true);
      setError('');

      const { data } = await api.post('/uploads', dataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImages(data.url || '');
    } catch (err) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateHarvestLot = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !cropName ||
      !quantity ||
      !pricePerUnit ||
      !location
    ) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setActionLoading(true);
      setError('');

      await api.post('/lots', {
        title,
        cropName,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit),
        location,
        description,
        images,
      });

      setTitle('');
      setCropName('');
      setQuantity('');
      setPricePerUnit('');
      setLocation('');
      setDescription('');
      setImages('');

      setModalOpen(false);

      await fetchFarmerStockLogs();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          'Failed to create listing.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-800">
            My Harvest Lots
          </h2>
          <p className="text-xs text-neutral-400">
            Manage your crop listings.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Lot
        </button>
      </div>

      {lots.length === 0 ? (
        <EmptyState
          title="No Lots Found"
          description="Create your first lot."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => (
            <LotCard key={lot._id} lot={lot} />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Lot"
      >
        <form
          onSubmit={handleCreateHarvestLot}
          className="space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="relative border-2 border-dashed rounded-xl p-4">
            {images ? (
              <img
                src={images}
                alt="Lot"
                className="h-32 w-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-6 w-6" />
                <p>Select Image</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryMediaUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader size="sm" />
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl p-2"
            required
          />

          <input
            type="text"
            placeholder="Crop Name"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full border rounded-xl p-2"
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-xl p-2"
            required
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded-xl p-2"
            required
          />

          <input
            type="number"
            placeholder="Price Per Unit"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full border rounded-xl p-2"
            required
          />

          <textarea
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl p-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="border rounded-xl px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading || uploading}
              className="bg-emerald-600 text-white rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {actionLoading ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyLots;