import React from 'react';
import { User, Phone, Mail, Award } from 'lucide-react';

const ProfileCard = ({ profileData }) => {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
      <div className="relative mb-4">
        {profileData?.profileImage ? (
          <img 
            src={profileData.profileImage} 
            alt={profileData.name} 
            className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500" 
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-100">
            <User className="h-10 w-10" />
          </div>
        )}
        <span className="absolute bottom-0 right-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-black tracking-wide text-white uppercase shadow-sm">
          {profileData?.role}
        </span>
      </div>

      <h3 className="text-base font-bold text-neutral-800">{profileData?.name}</h3>
      <p className="text-xs text-neutral-400 font-medium mb-4 flex items-center gap-1">
        <Award className="h-3 w-3 text-emerald-500" /> Authorized Platform Agent
      </p>

      <div className="w-full border-t border-neutral-100 pt-4 space-y-2 text-left">
        <div className="flex items-center gap-2 text-neutral-600">
          <Mail className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs truncate">{profileData?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <Phone className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs">{profileData?.phone || 'Not Configured'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
