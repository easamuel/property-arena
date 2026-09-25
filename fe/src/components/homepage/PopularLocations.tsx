import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Location {
  id: number;
  image: string;
  name: string;
}

const popularLocations: Location[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Lekki Phase 1",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Ikoyi",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Ibadan",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Port Harcourt",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Ikeja",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "",
  },
];

const PopularLocations: React.FC = () => {
  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Popular Locations</h2>
        <button className="text-red-600 font-semibold hover:underline">See All</button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {popularLocations.map(({ id, image, name }) => (
          <SwiperSlide key={id} className="relative rounded overflow-hidden cursor-pointer">
            <img src={image} alt={name} className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/20 bg-opacity-50 p-2 text-white text-center font-semibold text-lg">
              {name}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularLocations;
