import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Landing from './components/Landing';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import VoiceInteraction from './components/VoiceInteraction';
import AdminDashboard from './components/AdminDashboard';
import { menuItems } from './menuData';

const socket = io('http://localhost:3001');

function App() {
  const [step, setStep] = useState('landing'); // landing, ordering, confirmed
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [transcript, setTranscript] = useState('');


  useEffect(() => {
    socket.on('order_status_update', (updatedOrder) => {
      if (order && order._id === updatedOrder._id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order_status_update');
    };
  }, [order]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart(cart.filter((item) => item.id !== itemToRemove.id));
  };

  const confirmOrder = async () => {
    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart, timestamp: new Date().toISOString() }),
      });
      const newOrder = await response.json();
      setOrder(newOrder);
      setStep('confirmed');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  useEffect(() => {
    if (transcript) {
      const item = menuItems.find(i => transcript.toLowerCase().includes(i.name.toLowerCase()));
      if (item) {
        addToCart(item);
        setTranscript('');
      }
    }
  }, [transcript]);

  const CustomerApp = () => (
    <>
      {step === 'landing' && <Landing onStartOrder={() => setStep('ordering')} />}
      {step === 'ordering' && (
        <div className="container mx-auto p-4 flex">
          <div className="w-2/3">
            <Menu addToCart={addToCart} />
            <VoiceInteraction setTranscript={setTranscript} />
          </div>
          <div className="w-1/3">
            <Cart cart={cart} removeFromCart={removeFromCart} onConfirmOrder={confirmOrder} />
          </div>
        </div>
      )}
      {step === 'confirmed' && <OrderConfirmation order={order} />}
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
