import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Landing from './components/Landing';
import Menu from './components/Menu';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import VoiceInteraction from './components/VoiceInteraction';
import AdminDashboard from './components/AdminDashboard';
import RobotFace from './components/RobotFace';
import { menuItems } from './menuData';

const socket = io('http://localhost:3001');

function App() {
  const [step, setStep]_useState('landing'); // landing, ordering, confirmed
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);


  useEffect(() => {
    socket.on('order_status_update', (updatedOrder) => {
      if (order && order.id === updatedOrder.id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order_status_update');
    };
  }, [order]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === itemToRemove.id);
      if (index > -1) {
        const newCart = [...prevCart];
        newCart.splice(index, 1);
        return newCart;
      }
      return prevCart;
    });
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
        <div className="flex flex-col h-screen">
          <RobotFace isListening={isListening} />
          <div className="flex-grow overflow-y-auto pb-24">
            <div className="container mx-auto p-4 flex">
              <div className="w-2/3">
                <Menu addToCart={addToCart} />
              </div>
              <div className="w-1/3 pl-6">
                <Cart cart={cart} removeFromCart={removeFromCart} onConfirmOrder={confirmOrder} />
              </div>
            </div>
          </div>
          <VoiceInteraction setTranscript={setTranscript} setIsListening={setIsListening} />
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
