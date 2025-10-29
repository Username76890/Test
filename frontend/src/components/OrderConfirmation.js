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
    <div className="flex flex-col items-center justify-center h-screen bg-secondary">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
        <h2 className="text-3xl font-bold mb-2 text-primary">Order Confirmed!</h2>
        <p className="text-5xl mb-4">🎉</p>
        <p className="text-text-dark mb-2">Your order is being prepared.</p>
        <p className="text-gray-500 text-sm mb-4">Order ID: {currentOrder.id}</p>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-lg font-semibold text-text-dark">
            Status: <span className="text-primary">{currentOrder.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
