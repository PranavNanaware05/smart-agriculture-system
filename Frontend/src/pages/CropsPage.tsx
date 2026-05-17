import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { useFarmer } from '../context/FarmerContext';
import { cropService } from '../services/cropService';
import type { CropRequest, CropResponse, CropStatus } from '../types';
import { getErrorMessage } from '../utils/error';

const CROP_STATUSES: CropStatus[] = [
  'PLANNED',
  'SOWING',
  'GROWING',
  'READY_TO_HARVEST',
  'HARVESTED',
  'FAILED',
];

const emptyForm = (): Omit<CropRequest, 'farmerId'> => ({
  cropName: '',
  cropType: '',
  sowingDate: new Date().toISOString().slice(0, 10),
  harvestingDate: null,
  cropStatus: 'GROWING',
});

export default function CropsPage() {
  const { selectedFarmerId } = useFarmer();
  const [crops, setCrops] = useState<CropResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CropResponse | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!selectedFarmerId) {
      setCrops([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cropService.listByFarmer(selectedFarmerId);
      setCrops(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [selectedFarmerId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (crop: CropResponse) => {
    setEditing(crop);
    setForm({
      cropName: crop.cropName,
      cropType: crop.cropType,
      sowingDate: crop.sowingDate,
      harvestingDate: crop.harvestingDate ?? null,
      cropStatus: crop.cropStatus,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId) {
      toast.error('Select or create a farmer profile first');
      return;
    }
    setSubmitting(true);
    try {
      const payload: CropRequest = { ...form, farmerId: selectedFarmerId };
      if (editing) {
        await cropService.update(editing.id, payload);
        toast.success('Crop updated');
      } else {
        await cropService.create(payload);
        toast.success('Crop added');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this crop?')) return;
    try {
      await cropService.delete(id);
      toast.success('Crop deleted');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!selectedFarmerId) {
    return (
      <EmptyState
        title="No farmer selected"
        description="Create or select a farmer profile to manage crops."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Crop Management</h1>
          <p className="text-slate-600">Track sowing, growth, and harvest status</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Add crop
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : crops.length === 0 ? (
        <EmptyState title="No crops" description="Add your first crop record." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Sowing</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">{crop.cropName}</td>
                  <td className="px-4 py-3">{crop.cropType}</td>
                  <td className="px-4 py-3">{crop.sowingDate}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-xs font-medium text-leaf-800">
                      {crop.cropStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="text-leaf-700 hover:underline" onClick={() => openEdit(crop)}>
                        Edit
                      </button>
                      <button type="button" className="text-red-600 hover:underline" onClick={() => handleDelete(crop.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit crop' : 'Add crop'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Crop name</label>
            <input className="input-field" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} required />
          </div>
          <div>
            <label className="label-field">Crop type</label>
            <input className="input-field" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Sowing date</label>
              <input type="date" className="input-field" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} required />
            </div>
            <div>
              <label className="label-field">Harvest date (optional)</label>
              <input type="date" className="input-field" value={form.harvestingDate ?? ''} onChange={(e) => setForm({ ...form, harvestingDate: e.target.value || null })} />
            </div>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select className="input-field" value={form.cropStatus} onChange={(e) => setForm({ ...form, cropStatus: e.target.value as CropStatus })}>
              {CROP_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
