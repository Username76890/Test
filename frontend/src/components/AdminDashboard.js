import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="p-4 border rounded">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Items</th>
            <th className="py-2">Timestamp</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="py-2 text-center">{order.id}</td>
              <td className="py-2 text-center">{order.items.map(i => i.name).join(', ')}</td>
              <td className="py-2 text-center">{new Date(order.timestamp).toLocaleString()}</td>
              <td className="py-2 text-center">{order.status}</td>
              <td className="py-2 text-center">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="p-2 border"
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
  );
};

export default AdminDashboard;
