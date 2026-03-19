/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import productsData from './data/products.json';
import { Product, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products: Product[] = productsData;

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight">LUMINA</span>
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-600 hover:text-emerald-600 transition-colors"
              id="cart-button"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Featured Collection</h1>
          <p className="text-stone-500 max-w-2xl">
            Discover our curated selection of premium essentials designed for modern living.
          </p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              id={`product-${product.id}`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full border border-stone-200">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
                  <span className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-stone-500 text-sm mb-6 line-clamp-2">
                  {product.description}
                </p>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
              id="cart-sidebar"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Your Cart <span className="text-stone-400 font-normal">({cartCount})</span>
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                    <ShoppingBag className="w-12 h-12 opacity-20" />
                    <p>Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-emerald-600 font-medium hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm truncate pr-4">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-emerald-600 font-bold text-sm mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-stone-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-stone-50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-stone-50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
                  <div className="flex justify-between items-center text-stone-500 text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 mt-4 active:scale-[0.98]">
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-stone-200 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span className="text-lg font-bold tracking-tight">LUMINA</span>
          </div>
          <p className="text-stone-400 text-sm">
            © 2026 Lumina Essentials. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
