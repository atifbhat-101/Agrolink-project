import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LotCard from '../components/cards/LotCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  PlusCircle,
  ImagePlus,
  Save,
  AlertCircle,
  Type,
  Wheat,
  MapPin,
  Scale,
  IndianRupee,
  FileText,
  Pencil,
} from 'lucide-react';

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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [editingLot, setEditingLot] = useState(null);
  const [error, setError] = useState('');

  const resetLotForm = () => {
    setTitle('');
    setCropName('');
    setQuantity('');
    setPricePerUnit('');
    setLocation('');
    setDescription('');
    setImages('');
    setError('');
  };

  const openCreateModal = () => {
    setEditingLot(null);
    resetLotForm();
    setModalOpen(true);
  };

  const openEditModal = (lot) => {
    setEditingLot(lot);
    setTitle(lot.title || '');
    setCropName(lot.cropName || '');
    setQuantity(String(lot.quantity || ''));
    setPricePerUnit(String(lot.pricePerUnit || ''));
    setLocation(lot.location || '');
    setDescription(lot.description || '');
    setImages(lot.images?.[0] || '');
    setError('');
    setModalOpen(true);
  };

  const closeLotModal = () => {
    setModalOpen(false);
    setEditingLot(null);
    resetLotForm();
  };

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
      setError(err?.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveHarvestLot = async (e) => {
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

      const payload = {
        title,
        cropName,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit),
        location,
        description,
        images,
      };

      if (editingLot) {
        const { data } = await api.put(`/lots/${editingLot._id}`, payload);

        setLots((currentLots) =>
          currentLots.map((lot) =>
            lot._id === data._id ? data : lot
          )
        );
      } else {
        await api.post('/lots', payload);
        await fetchFarmerStockLogs();
      }

      closeLotModal();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          `Failed to ${editingLot ? 'update' : 'create'} listing.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHarvestLot = async () => {
    if (!selectedLot) return;

    try {
      setDeleteLoading(true);
      setError('');

      await api.delete(`/lots/${selectedLot._id}`);

      setLots((currentLots) =>
        currentLots.filter((lot) => lot._id !== selectedLot._id)
      );
      setSelectedLot(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to delete lot.');
    } finally {
      setDeleteLoading(false);
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
          onClick={openCreateModal}
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
            <LotCard
              key={lot._id}
              lot={lot}
              onEdit={openEditModal}
              onDelete={setSelectedLot}
              deleting={deleteLoading && selectedLot?._id === lot._id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeLotModal}
        title={editingLot ? 'Edit Lot' : 'Create New Lot'}
        size="lg"
      >
        <form
          onSubmit={handleSaveHarvestLot}
          className="space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <div className="space-y-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                {images ? (
                  <img
                    src={images}
                    alt="Lot"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-neutral-500">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                      <ImagePlus className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-neutral-700">Crop Image</p>
                      <p className="text-xs font-medium text-neutral-400">JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryMediaUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                    <Loader size="sm" />
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  {editingLot ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <PlusCircle className="h-4 w-4" />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider">
                    {editingLot ? 'Editing Lot' : 'New Lot'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <Type className="h-3.5 w-3.5" />
                  Title
                </span>
                <input
                  type="text"
                  placeholder="Fresh organic tomatoes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </label>

              <label className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <Wheat className="h-3.5 w-3.5" />
                  Crop
                </span>
                <input
                  type="text"
                  placeholder="Tomato"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </label>

              <label className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </span>
                <input
                  type="text"
                  placeholder="Pune"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </label>

              <label className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <Scale className="h-3.5 w-3.5" />
                  Quantity
                </span>
                <input
                  type="number"
                  placeholder="25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </label>

              <label className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Price / Qtl
                </span>
                <input
                  type="number"
                  placeholder="1800"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </span>
                <textarea
                  rows={4}
                  placeholder="Add crop quality, harvest date, packaging, or delivery notes"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeLotModal}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading || uploading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {actionLoading ? 'Saving...' : editingLot ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(selectedLot)}
        onClose={() => setSelectedLot(null)}
        onConfirm={handleDeleteHarvestLot}
        title="Delete Lot"
        message={`Delete "${selectedLot?.title || 'this lot'}"? This cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default MyLots;
