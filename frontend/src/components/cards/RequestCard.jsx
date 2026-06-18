import React from 'react';
import { Scale, IndianRupee, Clock, Check, X } from 'lucide-react';

const RequestCard = ({ request, role, onStatusUpdate, loading = false }) => {
  const isPending = request.status === 'pending';
  const displayUser = role === 'farmer' ? request.buyer : request.farmer;

  const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase block mb-0.5">
            Target Crop Lot
          </span>
          <h4 className="text-sm font-bold text-neutral-800">{request.lot?.title || 'Unknown Crop Lot'}</h4>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            {role === 'farmer' ? 'Buyer' : 'Farmer'}: <span className="text-neutral-700 font-bold">{displayUser?.name || 'Unknown User'}</span> ({displayUser?.phone || 'No Contact'})
          </p>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[request.status]}`}>
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-neutral-50 rounded-xl p-3 text-neutral-700">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-neutral-400" />
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Volume Offer</p>
            <p className="text-xs font-bold text-neutral-800">{request.quantityRequested} Qtls</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Bidded Value</p>
            <p className="text-xs font-black text-emerald-700">₹{request.offeredPrice}/Qtl</p>
          </div>
        </div>
      </div>

      {request.note && (
        <div className="rounded-xl border border-neutral-100 bg-white p-2.5 text-xs text-neutral-600 italic">
          "{request.note}"
        </div>
      )}

      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-neutral-400">
        <span className="flex items-center gap-1 text-[11px] font-medium">
          <Clock className="h-3.5 w-3.5" />
          {new Date(request.createdAt).toLocaleDateString()}
        </span>

        {role === 'farmer' && isPending && (
          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={() => onStatusUpdate(request._id, 'rejected')}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 transition shadow-sm disabled:opacity-50"
              title="Reject Offer"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              disabled={loading}
              onClick={() => onStatusUpdate(request._id, 'accepted')}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
              title="Accept Offer"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
