'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border border-black">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">Admin Login</h1>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-black mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
