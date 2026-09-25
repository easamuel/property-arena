import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Partner {
  id: number;
  image: string;
  name: string;
}

const partners: Partner[] = [
  { id: 1, image: "https://logo.clearbit.com/airbnb.com", name: "Airbnb" },
  { id: 2, image: "https://logo.clearbit.com/uber.com", name: "Uber" },
  { id: 3, image: "https://logo.clearbit.com/netflix.com", name: "Netflix" },
  { id: 4, image: "https://logo.clearbit.com/slack.com", name: "Slack" },
  { id: 5, image: "https://logo.clearbit.com/dropbox.com", name: "Dropbox" },
  { id: 6, image: "https://logo.clearbit.com/shopify.com", name: "Shopify" },
];

const RealEstatePartners: React.FC = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="my-12 px-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Real Estate Partners</h2>
        <button className="text-red-600 font-semibold hover:underline">See All</button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16} // 1rem gap
        slidesPerView="auto" // auto width slides
        loop
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {partners.map(({ id, image, name }) => (
          <SwiperSlide
            key={id}
            className="flex flex-col items-center"
            style={{
              flex: "0 0 auto",
              width: "minmax(15rem, 18rem)",
              maxWidth: "18rem",
              minWidth: "15rem",
            }}
          >
            <img
              src={image}
              alt={name}
              className="object-contain w-full"
              style={{ maxHeight: "fit-content" }} // keep consistent height
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons below */}
      <div className="flex justify-center gap-6 mt-4">
        <button
          ref={prevRef}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 transition"
          aria-label="Previous"
        >
          {/* Left arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          ref={nextRef}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 transition"
          aria-label="Next"
        >
          {/* Right arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default RealEstatePartners;
