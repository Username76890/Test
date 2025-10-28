import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const OrderConfirmation = ({ order }) => {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    socket.on('order_status_update', (updatedOrder) => {
      if (currentOrder && currentOrder.id === updatedOrder.id) {
        setCurrentOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order_status_update');
    };
  }, [currentOrder]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h2 className="text-3xl font-bold mb-4 text-text">Order Placed! 🎉</h2>
      <p className="text-lg mb-8 text-text">Your order ID is: {currentOrder.id}</p>
      <p className="text-text">Estimated waiting time: 10 minutes</p>
      <p className="mt-4 text-xl text-text">Status: <span className="font-bold text-primary">{currentOrder.status}</span></p>
    </div>
  );
};

export default OrderConfirmation;
