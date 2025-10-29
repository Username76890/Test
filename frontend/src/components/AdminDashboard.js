import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const statusColors = {
    New: 'bg-blue-500',
    Preparing: 'bg-yellow-500',
    Finished: 'bg-green-500',
    'Not Available': 'bg-red-500',
  };

  useEffect(() => {
    if (loggedIn) {
      fetch('http://localhost:3001/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data));

      socket.on('new_order', (newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
      });

      socket.on('order_status_update', (updatedOrder) => {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      });
    }

    return () => {
      socket.off('new_order');
      socket.off('order_status_update');
    };
  }, [loggedIn]);

  const updateOrderStatus = (id, status) => {
    fetch(`http://localhost:3001/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-text-dark">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border rounded-lg"
          />
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Café Admin</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="block p-4 text-gray-600 hover:bg-gray-200">Live Orders</a>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-text-dark">Live Orders</h1>
        <div className="bg-white rounded-2xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-6 text-left font-semibold text-gray-600">Order ID</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-600">Items</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-600">Timestamp</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{order.id}</td>
                  <td className="py-4 px-6">{order.items.map(i => i.name).join(', ')}</td>
                  <td className="py-4 px-6">{new Date(order.timestamp).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="p-2 border rounded-lg"
                    >
                      <option value="New">New</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Finished">Finished</option>
                      <option value="Not Available">Not Available</option>
                    </select>
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

export default AdminDashboard;
