import React from 'react';

const Loader = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${dimensions[size] || dimensions.md} animate-spin rounded-full border-neutral-200 border-t-emerald-600`} />
    </div>
  );
};

export default Loader;
