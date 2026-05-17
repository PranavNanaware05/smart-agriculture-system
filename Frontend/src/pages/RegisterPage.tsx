import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string | null => {
    if (form.fullName.trim().length < 2) return 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!/^[+]?[0-9\s\-]{10,20}$/.test(form.phoneNumber.trim()))
      return 'Enter a valid phone number (10–20 digits)';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        role: 'FARMER',
      });
      toast.success('Account created successfully!');
      navigate('/farmers', { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create account" subtitle="Register as a farmer to get started">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}

        <div>
          <label htmlFor="fullName" className="label-field">
            Full name
          </label>
          <input
            id="fullName"
            className="input-field"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label-field">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="label-field">
            Phone number
          </label>
          <input
            id="phone"
            className="input-field"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
            placeholder="+91 9876543210"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label-field">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm" className="label-field">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="input-field"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" /> Creating account…
            </span>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-leaf-700 hover:text-leaf-800">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
