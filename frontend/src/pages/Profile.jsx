import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProfileCard from '../components/cards/ProfileCard';
import Loader from '../components/common/Loader';
import {
  Save,
  Camera,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ImagePlus,
  Sparkles,
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfileState } = useContext(AuthContext);
  
  // Data state parameters 
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  
  // Auxiliary UI state variables
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const fileInputRef = useRef(null);

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const dataPayload = new FormData();
    dataPayload.append('image', file);
    dataPayload.append('folder', 'profiles');

    try {
      setUploading(true);
      setMessage({ text: '', type: '' });
      
      const { data } = await api.post('/uploads', dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfileImage(data.url);
      setMessage({ text: 'Media file uploaded successfully. Save changes to finalize layout.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Storage service image transfer failed.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setMessage({ text: 'All record validation fields must be populated.', type: 'error' });
      return;
    }

    try {
      setUpdating(true);
      setMessage({ text: '', type: '' });
      const result = await updateProfileState({ name, phone, profileImage });
      
      if (result.success) {
        setMessage({ text: 'Identity workspace layout configurations successfully updated.', type: 'success' });
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Fatal workflow structural failure update rejected.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Profile Workspace
          </div>
          <h2 className="mt-1 text-2xl font-black text-neutral-900">Account Identity</h2>
          <p className="mt-1 text-sm font-medium text-neutral-500">
            Keep your contact details and marketplace avatar ready for buyers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="font-black text-emerald-800">Role</p>
            <p className="mt-1 font-semibold uppercase tracking-wider text-emerald-600">{user?.role}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="font-black text-neutral-800">Status</p>
            <p className="mt-1 font-semibold text-neutral-500">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <ProfileCard profileData={{ name, phone, email: user?.email, role: user?.role, profileImage }} />

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-lg font-black text-neutral-900">Edit Profile</h3>
                <p className="mt-1 text-sm font-medium text-neutral-500">Update how your account appears across AgroLink.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Live Preview
              </span>
            </div>
          </div>

          {message.text && (
            <div className={`mx-6 mt-5 flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              <p>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="p-6">
            <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 text-left"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-500">
                      <ImagePlus className="h-8 w-8 text-emerald-600" />
                      <span className="text-xs font-black uppercase tracking-wider">Upload Avatar</span>
                    </div>
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-neutral-900/45 opacity-0 transition group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-neutral-800 shadow-sm">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </span>
                  </span>

                  {uploading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <Loader size="sm" />
                    </span>
                  )}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-wider">Login Email</span>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-neutral-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                      <User className="h-3.5 w-3.5" />
                      Full Name
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                      <Phone className="h-3.5 w-3.5" />
                      Contact Number
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Avatar</p>
                    <p className="mt-2 text-sm font-black text-neutral-900">{profileImage ? 'Ready' : 'Missing'}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Phone</p>
                    <p className="mt-2 text-sm font-black text-neutral-900">{phone ? 'Added' : 'Missing'}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Email</p>
                    <p className="mt-2 text-sm font-black text-neutral-900">Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-neutral-400">Changes apply across lots, messages, and offers.</p>
              <button
                type="submit"
                disabled={updating || uploading}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {updating ? 'Saving Configuration...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
