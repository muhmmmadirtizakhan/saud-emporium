// src/components/pages/Home/Home.jsx
import React from 'react';
import Hero from '../../sections/Hero/Hero';
import Categories from '../../sections/Categories/Categories';
import BestSellers from '../../sections/BestSellers/BestSellers';
import NewArrivals from '../../sections/NewArrivals/NewArrivals';
import PromoSlider from '../../sections/PromoSlider/PromoSlider';
import Testimonials from '../../sections/Testimonials/Testimonials';


const Home = () => {
  return (
    <div className="page active">
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