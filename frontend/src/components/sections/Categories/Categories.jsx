import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 1,
      tag: 'Timeless Sarees',
      title: 'Shop By Collection',
      description: 'Discover elegant sarees crafted with premium fabrics for every celebration.',
      image: 'https://neel.pk/cdn/shop/files/51_7cc29573-1080-41b1-ba5d-9d13d6fc9484.jpg?v=1733340954',
      link: '/sarees'
    },
    {
      id: 2,
      tag: 'Elegant Suits',
      title: 'Shop By Collection',
      description: 'Discover beautifully crafted 2-piece and 3-piece suits for every occasion.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrUfSTF-ANL7WyXQ-XVHNmZJoFQPxfQRIZuCWy403swt69QwnIW9M4BSA&s=10',
      link: '/suits'
    },
    {
      id: 3,
      tag: 'Trending',
      title: 'Maxi Dress Collection',
      description: 'Discover elegant maxi dresses crafted for effortless style and comfort.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAxhbXO5S6AEeF2U7KAHem3xXJLXRiWFtIKX1Mvy5xeRtrzPOhgmzxYO8&s=10',
      link: '/maxi'
    },
    {
      id: 4,
      tag: 'Jewelry',
      title: 'Shop By Collection',
      description: 'Discover exquisite jewelry pieces that add a touch of elegance to your look.',
      image: 'https://cpimg.tistatic.com/06679071/b/4/Ladies-Fashionable-Jewellery-Set.jpg',
      link: '/jewelry'
    },
    {
      id: 5,
      tag: 'Exclusive',
      title: 'Signature Collection',
      description: 'Explore elegant fashion designed with premium fabrics and timeless beauty.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_02-OG6skPVQ85HSBcXortd-ImYtMucdq85kDyRhkhizhQxurA3Ijp0xv&s=10',
      link: '/collections'
    }
  ];

  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link key={cat.id} to={cat.link} className="category-card premium-category-card">
            <img src={cat.image} alt={cat.title} />
            <div className="premium-category-overlay"></div>
            <div className="premium-category-content">
              <span>{cat.tag}</span>
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;