import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { usePropertyStore } from "@/store/propertyStore";

interface Project {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  type: string;
}

const projects: Project[] = [
  {
    id: 1,
    image: "https://plus.unsplash.com/premium_photo-1733760125442-efad43dd88c3?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Modern Family Home",
    price: "$350,000",
    location: "New York",
    type: "House",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1593714604578-d9e41b00c6c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Luxury Apartment",
    price: "$550,000",
    location: "Los Angeles",
    type: "Apartment",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Beachside Villa",
    price: "$1,200,000",
    location: "Miami",
    type: "Villa",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Downtown Condo",
    price: "$430,000",
    location: "Chicago",
    type: "Condo",
  },
];

const FeaturedProjects: React.FC = () => {
  const { featuredListings, fetchFeaturedProperties, loading, error } = usePropertyStore();

  useEffect(() => {
    fetchFeaturedProperties({ page: 1, limit: 6 });
  }, [fetchFeaturedProperties]);

  if (loading) return <p>Loading featured projects...</p>;
  if (error) return <p className="text-red-500">Failed to fetch Featured Properties</p>;

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Featured Projects</h2>
        <button className="text-red-600 font-semibold hover:underline">See All</button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        navigation
        loop
        className="pb-8"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {featuredListings.map((raw) => {
          const item = raw as typeof raw & {
            _id?: string;
            image?: string;
            media?: { url?: string }[];
            address?: string;
            type?: string;
            propertyType?: string;
            price?: number | string;
          };
          const id = item.id || item._id;
          const image = item.image || item.media?.[0]?.url || '';
          const title = item.title;
          const price = typeof item.price === 'number' ? `₦${Number(item.price).toLocaleString()}` : item.price;
          const location = item.location || item.address;
          const type = item.type || item.propertyType;
          return (
          <SwiperSlide key={id} className="flex justify-center">
            {/* Center slide content and max width */}
            <div className="max-w-[25rem] w-full shadow-lg rounded-lg overflow-hidden bg-white">
              <img
                src={image}
                alt={title}
                className="w-full h-64 object-cover" // taller image for more height
              />
              <div className="p-4 shadow-inner">
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-red-600 font-bold mb-1">{price}</p>
                <p className="text-gray-600 text-sm mb-1">{location}</p>
                <p className="text-gray-500 text-sm italic">{type}</p>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default FeaturedProjects;