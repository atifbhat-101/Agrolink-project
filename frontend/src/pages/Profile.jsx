import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProfileCard from '../components/cards/ProfileCard';
import Loader from '../components/common/Loader';
import { Save, Camera, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <ProfileCard profileData={{ name, phone, email: user?.email, role: user?.role, profileImage }} />
      </div>

      <div className="md:col-span-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-neutral-800">Edit Profile Account Information</h3>
            <p className="text-xs text-neutral-400 mt-1">Manage system verification details and communication handles.</p>
          </div>

          {message.text && (
            <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              <p>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2 border-b border-neutral-50 pb-5">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="absolute inset-0 bg-neutral-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 z-10">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                {profileImage ? (
                  <img src={profileImage} alt="" className="h-20 w-20 rounded-full object-cover border border-neutral-200" />
                ) : (
                  <div className="h-20 w-20 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center text-xs font-bold border border-neutral-200">
                    No Image
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center z-20">
                    <Loader size="sm" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()} 
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Change Avatar Media
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 px-3.5 text-xs text-neutral-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Contact Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 px-3.5 text-xs text-neutral-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                disabled={updating || uploading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {updating ? 'Saving Configuration...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
