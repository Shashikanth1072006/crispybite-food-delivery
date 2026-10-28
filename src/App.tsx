import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DealsPage } from './pages/DealsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Product } from './types';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-neutral-900 selection:bg-red-600 selection:text-white">
      <ScrollToTop />
      
      {/* Primary Sticky Header */}
      <Navbar onOpenLocationModal={() => setLocationModalOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage onOpenProductModal={(p) => setSelectedProductForModal(p)} />}
          />
          <Route
            path="/menu"
            element={<MenuPage onOpenProductModal={(p) => setSelectedProductForModal(p)} />}
          />
          <Route
            path="/deals"
            element={<DealsPage onOpenProductModal={(p) => setSelectedProductForModal(p)} />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/track/:orderId" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="*"
            element={<HomePage onOpenProductModal={(p) => setSelectedProductForModal(p)} />}
          />
        </Routes>
      </main>

      {/* Reusable Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      <CartDrawer />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
