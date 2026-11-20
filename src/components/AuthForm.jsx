'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, PasswordInput } from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const router = useRouter();
  const { status, login, register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!isLogin && !values.name.trim()) next.name = 'Enter your name';
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Enter a valid email';
    if (!values.password) next.password = 'Enter your password';
    else if (!isLogin && values.password.length < 8) next.password = 'Use at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isLogin) await login({ email: values.email.trim(), password: values.password });
      else await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
      router.replace('/dashboard');
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  const useDemo = () => setValues({ name: '', email: 'demo@doctortracker.com', password: 'Demo@12345' });

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{isLogin ? 'Log in to your account' : 'Create your account'}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {isLogin ? 'Enter your details to open your dashboard.' : 'Each account keeps its own doctors and patients.'}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        {formError && (
          <div role="alert" className="rounded-lg border border-coral-500/30 bg-coral-50 px-3 py-2.5 text-sm font-medium text-coral-600">
            {formError}
          </div>
        )}
        {!isLogin && <Input label="Full name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />}
        <Input label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <PasswordInput
          label="Password"
          type="password"
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          hint={isLogin ? undefined : 'At least 8 characters'}
        />
        <Button type="submit" loading={submitting} className="w-full">
          {isLogin ? 'Log in' : 'Create account'}
        </Button>
      </form>

      {isLogin && (
        <div className="mt-4 rounded-lg border border-dashed border-brand-300 bg-brand-50 p-3 text-sm text-brand-900">
          <p className="font-semibold">Reviewing this project?</p>
          <p className="mt-0.5 text-brand-800">
            Use the demo account to see sample data.{' '}
            <button type="button" onClick={useDemo} className="font-bold underline underline-offset-2 hover:text-brand-600">
              Fill in demo login
            </button>
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? 'New here? ' : 'Already have an account? '}
        <Link href={isLogin ? '/register' : '/login'} className="font-bold text-brand-700 hover:underline">
          {isLogin ? 'Create an account' : 'Log in'}
        </Link>
      </p>
    </div>
  );
}
