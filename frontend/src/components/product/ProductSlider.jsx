import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import './ProductSlider.css';

const ProductSlider = ({ title, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="product-slider-section">
      <div className="container">
        {title && <h2 className="product-slider-title">{title}</h2>}
        
        <div className="product-slider-container">
          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="product-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id || product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
