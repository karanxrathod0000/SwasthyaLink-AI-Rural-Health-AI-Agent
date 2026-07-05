import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  History, 
  Check, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Medicine, RestockRecommendation, Facility } from '../types';

interface InventoryTabProps {
  facilities: Facility[];
  inventory: Medicine[];
  recommendations: RestockRecommendation[];
  movements: any[];
  onAddStock: (medicineId: string, quantity: number, notes?: string) => Promise<void>;
  onTriggerReorder: (orders: { medicineId: string; quantity: number }[]) => Promise<void>;
}

export default function InventoryTab({
  facilities,
  inventory,
  recommendations,
  movements,
  onAddStock,
  onTriggerReorder
}: InventoryTabProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'SC-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'essential' | 'critical' | 'general'>('ALL');
  
  // Stock adjustment modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [addQty, setAddQty] = useState<number>(50);
  const [addNotes, setAddNotes] = useState<string>('Routine restock audit');
  const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);
  
  // AI selections state
  const [selectedRecommendations, setSelectedRecommendations] = useState<Record<string, boolean>>({});
  const [isReordering, setIsReordering] = useState(false);

  // Initialize recommendations checklist
  React.useEffect(() => {
    const initial: Record<string, boolean> = {};
    recommendations.forEach(r => {
      initial[r.medicineId] = true;
    });
    setSelectedRecommendations(initial);
  }, [recommendations]);

  const filteredInventory = inventory.filter(item => {
    const matchesFacility = item.facilityId === selectedFacilityId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesFacility && matchesSearch && matchesCategory;
  });

  const criticalAlerts = inventory.filter(item => 
    item.facilityId === selectedFacilityId && 
    (item.currentStock === 0 || item.currentStock < item.minimumThreshold)
  );

  const handleOpenAddModal = (medId: string) => {
    setSelectedMedId(medId);
    setShowAddModal(true);
  };

  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId) return;
    setIsSubmittingAdjustment(true);
    try {
      await onAddStock(selectedMedId, addQty, addNotes);
      setShowAddModal(false);
      setAddQty(50);
      setAddNotes('Routine restock audit');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAdjustment(false);
    }
  };

  const handleAcceptRecommendations = async () => {
    const ordersToSubmit = recommendations
      .filter(r => selectedRecommendations[r.medicineId])
      .map(r => ({
        medicineId: r.medicineId,
        quantity: r.recommendedOrder
      }));

    if (ordersToSubmit.length === 0) {
      alert('Please select at least one recommendation to order.');
      return;
    }

    setIsReordering(true);
    try {
      await onTriggerReorder(ordersToSubmit);
      alert('📦 AI Restock Orders successfully dispatched to suppliers!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsReordering(false);
    }
  };

  const toggleRecommendation = (medId: string) => {
    setSelectedRecommendations(prev => ({
      ...prev,
      [medId]: !prev[medId]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER STATEMENT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <Package className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inventory & Supply Management</h1>
            <p className="text-xs text-slate-500 font-mono">Real-time essential medicine catalogs and early stock-out warnings</p>
          </div>
        </div>
        
        {/* Facility Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-mono">FACILITY:</span>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-3xs cursor-pointer"
          >
            {facilities.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* CRITICAL STOCK-OUT ALERTS */}
      {criticalAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>🚨 CRITICAL OUT-OF-STOCK & LOW THRESHOLD ALERTS ({criticalAlerts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalAlerts.map(item => (
              <div 
                key={item.id} 
                className="bg-white border border-rose-100 p-3 rounded-lg flex items-center justify-between text-xs hover:shadow-2xs transition"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Stock: <strong className={item.currentStock === 0 ? "text-rose-600" : "text-amber-600"}>{item.currentStock}</strong> / Min: {item.minimumThreshold} {item.unit}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddModal(item.id)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2 py-1 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Restock</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID: MEDICINE LIST AND AI RECOMMENDATIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* MEDICINE CATALOG & INVENTORY TABLE */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Essential Medicine Catalog</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Adjust stocks, view expiry dates, and track quantities</p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 placeholder-slate-400"
                  />
                </div>
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="critical">Critical</option>
                    <option value="essential">Essential</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Medicine Info</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Preferred Supplier</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-mono">
                        No medicines matched search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map(item => {
                      let statusBadge = '';
                      if (item.currentStock === 0) {
                        statusBadge = 'bg-rose-100 text-rose-800 border-rose-200';
                      } else if (item.currentStock < item.minimumThreshold) {
                        statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                      } else {
                        statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                      }

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                              Category: {item.category} • Batch: {item.batchNumber}
                            </p>
                          </td>
                          <td className="p-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{item.currentStock} {item.unit}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${statusBadge}`}>
                                {item.currentStock === 0 ? 'Out' : item.currentStock < item.minimumThreshold ? 'Low' : 'In Stock'}
                              </span>
                            </div>
                            <div className="w-24 bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div 
                                className={`h-full ${item.currentStock === 0 ? 'bg-rose-500' : item.currentStock < item.minimumThreshold ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (item.currentStock / item.maximumThreshold) * 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-slate-500">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-slate-700">{item.supplier}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}</p>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenAddModal(item.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold border border-indigo-200 hover:border-indigo-300 bg-white px-2 py-1 rounded shadow-3xs cursor-pointer text-[10px]"
                            >
                              Add Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center font-mono text-[10px] text-slate-400">
            Database sync verified • Audit trail records automatically compiled
          </div>
        </div>

        {/* AI RESTOCK RECOMMENDATIONS & MOVEMENT LOG */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* AI RESTOCK CARD */}
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between border-l-4 border-l-indigo-600">
            <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Restock Recommendations</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed">
                Gemini analyzes historical consumption, local outbreaks, and expiry profiles to suggest optimal restock sizes.
              </p>
            </div>

            <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
              {recommendations.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-mono">
                  No restock recommendations available. All stock levels are sufficient.
                </div>
              ) : (
                recommendations.map(r => (
                  <div 
                    key={r.medicineId}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-100/50 transition cursor-pointer flex items-start gap-2.5"
                    onClick={() => toggleRecommendation(r.medicineId)}
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRecommendations[r.medicineId]}
                      onChange={() => {}} // toggled by parent div click
                      className="mt-0.5 shrink-0 rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <div className="flex-1 font-sans">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-900">{r.medicineName}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                          r.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : r.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.priority}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        Usage: {r.weeklyConsumption}/wk • Current Stock: {r.currentStock} {r.unit}
                      </p>
                      <p className="text-xs font-bold text-indigo-700 mt-1">
                        Recommend Order: {r.recommendedOrder} {r.unit}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-400">
                {Object.values(selectedRecommendations).filter(Boolean).length} of {recommendations.length} Selected
              </span>
              <button
                onClick={handleAcceptRecommendations}
                disabled={isReordering}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>{isReordering ? 'Ordering...' : 'Order Restock'}</span>
              </button>
            </div>
          </div>

          {/* STOCK MOVEMENT AUDIT TRAIL */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-5 text-slate-700 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Stock Movement Audit Log</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Real-time ledger entries of supply additions and transfers</p>
            </div>

            <div className="p-5 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {movements.length === 0 ? (
                <p className="text-center py-6 text-slate-400 font-mono text-xs">No stock movements registered yet.</p>
              ) : (
                movements.map(m => (
                  <div key={m.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-bold text-slate-800">{m.medicineName}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        m.type === 'ADDITION' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        m.type === 'TRANSFER' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {m.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Qty: {m.quantity > 0 ? `+${m.quantity}` : m.quantity}</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {m.notes && <p className="text-[10px] text-slate-500 mt-1 italic font-sans">Notes: {m.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ADJUST STOCK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <form 
            onSubmit={handleAddStockSubmit}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-200"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Modify Medicine Ledger</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Adjust stock quantities for medicine ID: {selectedMedId}</p>
            </div>
            
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Adjustment Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={addQty}
                  onChange={(e) => setAddQty(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Ledger Notes</label>
                <textarea
                  rows={3}
                  required
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Reason for stock level change..."
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingAdjustment}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm cursor-pointer"
              >
                {isSubmittingAdjustment ? 'Saving...' : 'Confirm Stock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
