import React from 'react';

const Cart = ({ cart, removeFromCart, onConfirmOrder }) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-text">Your Order</h2>
      {cart.length === 0 ? (
        <p className="text-text">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-text">{item.name}</p>
              <p className="text-text">${item.price.toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
              >
                Remove
              </button>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between items-center font-bold">
            <p className="text-text">Total:</p>
            <p className="text-text">${total.toFixed(2)}</p>
          </div>
          <button
            onClick={onConfirmOrder}
            className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Confirm Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
