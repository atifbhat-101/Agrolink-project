import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserRoundCheck, Trash2 } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import StatCard from '../components/cards/StatCard';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, usersRes] = await Promise.all([api.get('/admin/overview'), api.get('/admin/users')]);
      setOverview(overviewRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdminData(); }, []);

  const deleteUser = async (user) => {
    if (!window.confirm(`Remove ${user.name}'s account? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      setUsers((current) => current.filter((item) => item._id !== user._id));
      setOverview((current) => ({ ...current, users: current.users - 1, [user.role === 'farmer' ? 'farmers' : 'buyers']: current[user.role === 'farmer' ? 'farmers' : 'buyers'] - 1 }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove this user.');
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader size="lg" /></div>;
  if (error && !overview) return <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-neutral-800">Administrator Dashboard</h2>
        <p className="mt-1 text-sm text-neutral-500">Manage platform user accounts and access.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Registered Users" value={overview.users} icon={Users} color="emerald" />
        <StatCard title="Farmers" value={overview.farmers} icon={UserRoundCheck} color="blue" />
        <StatCard title="Buyers" value={overview.buyers} icon={ShieldCheck} color="amber" />
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-5 py-4">
          <div>
            <h3 className="font-black text-neutral-800">User Management</h3>
            <p className="text-xs text-neutral-500">Review and manage registered platform accounts.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4"><p className="font-bold text-neutral-800">{user.name}</p><p className="text-xs text-neutral-500">{user.email}</p></td>
                  <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700">{user.role}</span></td>
                  <td className="px-5 py-4 text-neutral-600">{user.phone}</td>
                  <td className="px-5 py-4 text-neutral-600">{user.isVerified ? 'Verified' : 'Pending verification'}</td>
                  <td className="px-5 py-4 text-right">{user.role !== 'admin' && <button onClick={() => deleteUser(user)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Remove</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
