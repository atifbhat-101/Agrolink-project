import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, color = 'emerald' }) => {
  const colorProfiles = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-black text-neutral-800">{value}</h4>
        {description && <p className="text-[11px] text-neutral-500 font-medium">{description}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${colorProfiles[color] || colorProfiles.emerald}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
