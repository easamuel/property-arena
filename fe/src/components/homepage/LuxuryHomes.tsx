import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface LuxuryHome {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
}

const luxuryHomes: LuxuryHome[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Oceanfront Mansion",
    price: "$5,000,000",
    location: "Malibu",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Penthouse Suite",
    price: "$3,200,000",
    location: "New York",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Mountain Retreat",
    price: "$2,500,000",
    location: "Aspen",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "City Loft",
    price: "$1,800,000",
    location: "Chicago",
  },
];

const LuxuryHomes: React.FC = () => {
  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Luxury Homes</h2>
        <button className="text-red-600 font-semibold hover:underline">See All</button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        loop
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {luxuryHomes.map(({ id, image, title, price, location }) => (
          <SwiperSlide key={id}>
            <div className="rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
              <img src={image} alt={title} className="w-full h-48 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-red-600 font-bold">{price}</p>
                <p className="text-gray-600">{location}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LuxuryHomes;
