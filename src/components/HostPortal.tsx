// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Store, Plus, ArrowLeft } from 'lucide-react';
import { StayOption } from '../types';

interface HostPortalProps {
  currentStays: StayOption[];
  onBackToApp: () => void;
}

export const HostPortal: React.FC<HostPortalProps> = ({ currentStays, onBackToApp }) => {
  const [inventory, setInventory] = useState(
    currentStays.map(s => ({
      id: s.id,
      name: s.name,
      host: s.hostName,
      location: s.location,
      price: s.price,
      status: 'Available',
      directEarnings: Math.round(s.price * 4.5)
    }))
  );

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('2800');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleStatus = (id: string) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Available' ? 'Sold Out' : 'Available' }
          : item
      )
    );
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;

    const newItem = {
      id: 'inv-' + Date.now(),
      name: newRoomName,
      host: 'You (Verified Host)',
      location: 'Destination Core',
      price: Number(newRoomPrice) || 2500,
      status: 'Available',
      directEarnings: 0
    };

    setInventory(prev => [newItem, ...prev]);
    setNewRoomName('');
    setShowAddForm(false);
  };

  const totalEarnings = inventory.reduce((acc, curr) => acc + curr.directEarnings, 0);

  return (
    <div id="host-portal-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToApp}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Return to Traveler View"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
              Direct Settlement Engine
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl text-slate-950 flex items-center gap-2.5">
            <Store className="w-7 h-7 text-slate-900" />
            <span>Homestay Host & Driver Partner Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            0% platform commission. 100% of guest payments are credited directly into your verified bank account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Unit</span>
          </button>
          <button
            onClick={onBackToApp}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            Back to Travel View
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Active Inventory</span>
          <div className="text-2xl font-bold font-serif text-slate-950">{inventory.length} Verified Rooms</div>
          <span className="text-[11px] text-emerald-700 font-medium">All listings active</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Total Direct Payouts</span>
          <div className="text-2xl font-bold font-serif text-emerald-800">₹{totalEarnings.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 font-medium">Zero deduction fee (0%)</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Replan Auto-Sync</span>
          <div className="text-2xl font-bold font-serif text-slate-950">Active</div>
          <span className="text-[11px] text-slate-500 font-medium">Connected to WhatsApp alerts</span>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAddInventory} className="bg-[#faf8f5] p-5 rounded-2xl border border-slate-300 space-y-4 max-w-xl">
          <h4 className="font-bold text-sm text-slate-900">Add New Homestay Room or Heritage Cottage</h4>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Room or Suite Name:</label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g. Backwater Sunrise Deluxe Cottage"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nightly Tariff (₹):</label>
              <input
                type="number"
                value={newRoomPrice}
                onChange={(e) => setNewRoomPrice(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-orange-700 text-white rounded-xl font-bold"
              >
                Save Listing
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle-card">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-950">Active Properties & Live Availability</h3>
          <span className="text-xs text-slate-500">Click status toggle to update room availability instantly</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Property / Stay</th>
                <th className="p-4">Location</th>
                <th className="p-4">Nightly Tariff</th>
                <th className="p-4">Platform Fee</th>
                <th className="p-4">Status & Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <strong className="text-slate-950 block">{item.name}</strong>
                    <span className="text-[11px] text-slate-500">{item.host}</span>
                  </td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4 font-mono font-bold text-slate-950">₹{item.price}</td>
                  <td className="p-4 text-emerald-800 font-bold">₹0 (0%)</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
                        item.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                      <span>{item.status}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
