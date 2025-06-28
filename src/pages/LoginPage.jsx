import React, { useState } from 'react';
import { login } from '../services/api';
import NumericKeypad from '../components/NumericKeypad';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(name, pin);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      if (res.data.role === 'admin' || res.data.role === 'menaxher') navigate('/admin');
      else navigate('/tables');
    } catch (err) {
      setError('PIN ose emër i gabuar');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl mb-6 font-bold text-blue-600">SekeSoft</h1>
      <input
        type="text"
        placeholder="Emri"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 border rounded w-64 text-center text-xl"
      />
      <input
        type="password"
        value={pin}
        placeholder="PIN"
        readOnly
        className="mb-4 p-2 border rounded w-64 text-center text-xl"
      />

      <NumericKeypad
        onDigit={(d) => setPin((prev) => prev + d)}
        onDelete={() => setPin((prev) => prev.slice(0, -1))}
        onSubmit={handleLogin}
      />

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default LoginPage;
