import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Scale, IndianRupee, Tag, Trash2, Pencil } from 'lucide-react';

const LotCard = ({ lot, showActions = true, onEdit, onDelete, deleting = false }) => {
  const isAvailable = lot.status === 'available';

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md flex flex-col h-full">
      <div className="relative aspect-video w-full bg-neutral-100">
        {lot.images && lot.images.length > 0 ? (
          <img 
            src={lot.images[0]} 
            alt={lot.title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400 font-medium text-xs">
            No Crop Media Attached
          </div>
        )}
        <span className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white ${isAvailable ? 'bg-emerald-600' : 'bg-neutral-500'}`}>
          {lot.status}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
            <Tag className="h-3 w-3" />
            {lot.cropName}
          </div>
          <h4 className="text-sm font-bold text-neutral-800 line-clamp-1">{lot.title}</h4>
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{lot.description}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-b border-neutral-50 py-3 text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-xs font-semibold">{lot.quantity} Quintals</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-black text-neutral-800">₹{lot.pricePerUnit}/Qtl</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-neutral-400 min-w-0">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs truncate font-medium">{lot.location}</span>
          </div>
          {showActions && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(lot)}
                  title="Edit lot"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onDelete(lot)}
                  title="Delete lot"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <Link
                to={`/lots/${lot._id}`}
                className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition whitespace-nowrap"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotCard;
