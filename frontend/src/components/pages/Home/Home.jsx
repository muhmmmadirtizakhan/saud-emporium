// src/components/pages/Home/Home.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../../sections/Hero/Hero';
import Categories from '../../sections/Categories/Categories';
import BestSellers from '../../sections/BestSellers/BestSellers';
import NewArrivals from '../../sections/NewArrivals/NewArrivals';
import PromoSlider from '../../sections/PromoSlider/PromoSlider';
import Testimonials from '../../sections/Testimonials/Testimonials';


const Home = () => {
  return (
    <div className="page active">
      <Helmet>
        <title>Saud Emporium | Premium Ladies Fashion — Sarees, Suits & Jewelry</title>
        <meta name="description" content="Shop premium sarees, suits, maxi dresses and jewelry at Saud Emporium. Elegant fashion crafted with timeless beauty for every occasion." />
      </Helmet>
      <Hero />
      <Categories />
      <BestSellers />
      <PromoSlider />
      <NewArrivals />
      <Testimonials />
  
    </div>
  );
};

export default Home;