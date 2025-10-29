import React from 'react';
import { menuItems } from '../menuData';

const Menu = ({ addToCart }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-text-dark">{item.name}</h3>
                <p className="text-lg font-semibold text-mocha">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="w-full mt-2 bg-primary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
