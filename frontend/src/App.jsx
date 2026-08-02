import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout/Layout';

// Import Pages
import Home from './components/pages/Home/Home';
import Sarees from './components/pages/Sarees/Sarees';
import Suits from './components/pages/Suits/Suits';
import Maxi from './components/pages/Maxi/Maxi';
import Jewelry from './components/pages/Jewelry/Jewelry';
import Collections from './components/pages/Collections/Collections';
import Wishlist from './components/pages/Wishlist/Wishlist';
import Cart from './components/pages/Cart/Cart';
import Checkout from './components/pages/Checkout/Checkout';
import PaymentInstructions from './components/pages/PaymentInstructions/PaymentInstructions';
import ProductDetail from './components/pages/ProductDetail/ProductDetail';
import NewArrivalsPage from './components/pages/NewArrivalsPage/NewArrivalsPage';
import WhatsAppButton from './components/common/WhatsAppButton/WhatsAppButton';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sarees" element={<Sarees />} />
        <Route path="/suits" element={<Suits />} />
        <Route path="/maxi" element={<Maxi />} />
        <Route path="/jewelry" element={<Jewelry />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-instructions" element={<PaymentInstructions />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        
      </Routes>
         <WhatsAppButton /> 
    </Layout>
  );
}

export default App;