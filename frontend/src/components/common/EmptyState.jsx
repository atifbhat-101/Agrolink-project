import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No Data Discovered', description = 'Try adjusting filters or checking back later.' }) => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-neutral-200 bg-white rounded-2xl p-8 text-center sm:p-12">
      <div className="rounded-full bg-neutral-50 p-4 mb-4">
        <Inbox className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-sm font-bold text-neutral-800 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
