import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useFarmer } from '../context/FarmerContext';
import { farmerService } from '../services/farmerService';
import { isFarmerAlreadyExistsError, resolveFarmerForUser } from '../services/farmerResolver';
import type { FarmerRequest, FarmerResponse } from '../types';
import { storage } from '../utils/storage';
import { getErrorMessage } from '../utils/error';

const emptyForm: FarmerRequest = {
  farmerName: '',
  village: '',
  district: '',
  state: '',
  landArea: 0,
  soilType: '',
};

export default function FarmersPage() {
  const { user } = useAuth();
  const {
    farmers,
    hasFarmerProfile,
    refreshFarmers,
    setSelectedFarmerId,
    loading: ctxLoading,
  } = useFarmer();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FarmerResponse | null>(null);
  const [form, setForm] = useState<FarmerRequest>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const displayList = user?.role === 'ADMIN' ? farmers : farmers;
  const canCreate =
    user?.role === 'ADMIN' ? true : !hasFarmerProfile;

  const openCreate = () => {
    if (user?.role === 'FARMER' && hasFarmerProfile) {
      toast.error('You already have a farmer profile');
      return;
    }
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (farmer: FarmerResponse) => {
    setEditing(farmer);
    setForm({
      farmerName: farmer.farmerName,
      village: farmer.village,
      district: farmer.district,
      state: farmer.state,
      landArea: farmer.landArea,
      soilType: farmer.soilType,
    });
    setModalOpen(true);
  };

  const loadExistingProfile = async () => {
    if (!user) return;
    const farmer = await resolveFarmerForUser(user.id);
    if (farmer) {
      await refreshFarmers();
      toast.success('Farmer profile loaded');
    } else {
      toast.error('No farmer profile found for your account');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.landArea <= 0) {
      toast.error('Land area must be greater than zero');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await farmerService.update(editing.id, form);
        toast.success('Farmer updated');
        setModalOpen(false);
        await refreshFarmers();
      } else {
        if (user?.role === 'FARMER' && hasFarmerProfile) {
          toast.error('Farmer profile already exists for your account');
          return;
        }

        const payload: FarmerRequest = { ...form };
        if (user?.role === 'FARMER') {
          payload.userId = null;
        } else if (!payload.userId) {
          toast.error('User ID is required for admin-created farmers');
          return;
        }

        try {
          const { data } = await farmerService.create(payload);
          if (user) storage.setFarmerIdForUser(user.id, data.id);
          setSelectedFarmerId(data.id);
          toast.success('Farmer profile created');
          setModalOpen(false);
          await refreshFarmers();
        } catch (createErr) {
          if (user?.role === 'FARMER' && isFarmerAlreadyExistsError(createErr)) {
            const existing = await resolveFarmerForUser(user.id);
            if (existing) {
              setSelectedFarmerId(existing.id);
              await refreshFarmers();
              setModalOpen(false);
              toast.success('Farmer profile already exists — loaded your profile');
              return;
            }
          }
          throw createErr;
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this farmer profile?')) return;
    try {
      await farmerService.delete(id);
      if (user) storage.clearFarmerIdForUser(user.id);
      toast.success('Farmer deleted');
      await refreshFarmers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farmer Management</h1>
          <p className="text-slate-600">
            {user?.role === 'ADMIN' ? 'Manage all registered farmers' : 'Your farmer profile'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user?.role === 'FARMER' && !hasFarmerProfile && !ctxLoading ? (
            <button type="button" className="btn-secondary" onClick={() => void loadExistingProfile()}>
              Load existing profile
            </button>
          ) : null}
          {canCreate ? (
            <button type="button" className="btn-primary" onClick={openCreate}>
              {displayList.length === 0 ? 'Create profile' : 'Add farmer'}
            </button>
          ) : null}
        </div>
      </div>

      {ctxLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayList.length === 0 ? (
        <EmptyState
          title="No farmers yet"
          description={
            user?.role === 'FARMER'
              ? 'Create a farmer profile, or use "Load existing profile" if you already registered one.'
              : 'Create a farmer profile to start managing crops and sensors.'
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayList.map((farmer) => (
            <Card key={farmer.id} title={farmer.farmerName} subtitle={`${farmer.village}, ${farmer.district}`}>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">State</dt>
                  <dd className="font-medium">{farmer.state}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Land area</dt>
                  <dd className="font-medium">{farmer.landArea} acres</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Soil</dt>
                  <dd className="font-medium">{farmer.soilType}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-secondary flex-1 py-2" onClick={() => openEdit(farmer)}>
                  Edit
                </button>
                <button type="button" className="btn-danger flex-1 py-2" onClick={() => handleDelete(farmer.id)}>
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit farmer' : 'Add farmer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user?.role === 'ADMIN' && !editing ? (
            <div>
              <label className="label-field">User ID (FARMER account)</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={form.userId ?? ''}
                onChange={(e) =>
                  setForm({ ...form, userId: e.target.value ? Number(e.target.value) : undefined })
                }
                required
              />
            </div>
          ) : null}
          <div>
            <label className="label-field">Farmer name</label>
            <input
              className="input-field"
              value={form.farmerName}
              onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Village</label>
              <input
                className="input-field"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">District</label>
              <input
                className="input-field"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label-field">State</label>
            <input
              className="input-field"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Land area (acres)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="input-field"
                value={form.landArea || ''}
                onChange={(e) => setForm({ ...form, landArea: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="label-field">Soil type</label>
              <input
                className="input-field"
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
