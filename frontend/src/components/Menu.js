import React from 'react';
import { menuItems } from '../menuData';

const Menu = ({ addToCart }) => {
  return (
    <div className="container mx-auto p-4 bg-background">
      <h2 className="text-3xl font-bold mb-4 text-text">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow-md">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded-md" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-text">{item.name}</h3>
              <p className="text-lg text-text">${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="mt-4 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
