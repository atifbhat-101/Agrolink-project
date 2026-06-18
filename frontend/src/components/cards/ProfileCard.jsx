import React from 'react';
import { User, Phone, Mail, Award, ShieldCheck, BadgeCheck } from 'lucide-react';

const ProfileCard = ({ profileData }) => {
  return (
    <aside className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative bg-emerald-700 px-6 pb-16 pt-6">
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(135deg,#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            {profileData?.role}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col items-center text-center">
          <div className="relative">
            {profileData?.profileImage ? (
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-emerald-50 text-emerald-700 shadow-md">
                <User className="h-10 w-10" />
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border-4 border-white bg-emerald-600 text-white">
              <BadgeCheck className="h-4 w-4" />
            </span>
          </div>

          <h3 className="mt-4 text-lg font-black text-neutral-900">{profileData?.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-500">
            <Award className="h-3.5 w-3.5 text-emerald-500" />
            Authorized Platform Agent
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex items-center gap-2 text-neutral-600">
              <Mail className="h-4 w-4 text-emerald-600" />
              <span className="truncate text-xs font-semibold">{profileData?.email}</span>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex items-center gap-2 text-neutral-600">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold">{profileData?.phone || 'Not Configured'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileCard;
