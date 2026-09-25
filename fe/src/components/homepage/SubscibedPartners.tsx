import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const partnerLogos = [
  "https://logo.clearbit.com/zillow.com",
  "https://logo.clearbit.com/redfin.com",
  "https://logo.clearbit.com/realtor.com",
  "https://logo.clearbit.com/loopnet.com",
  "https://logo.clearbit.com/compass.com",
  "https://logo.clearbit.com/realestate.com.au",
  "https://logo.clearbit.com/bumblebee.space",
  "https://logo.clearbit.com/marfeel.com",
];


const SubscribedPartners: React.FC = () => {
  return (
    <section className="my-12 relative">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">Subscribed Partners</h2>
        <button className="text-red-600 font-semibold hover:underline">
          See All
        </button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}  // 1rem gap
        slidesPerView={4}  // default, can tweak with breakpoints
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },  // add 5 or 6 on big screens
          1280: { slidesPerView: 6 },
        }}
        className="pb-4"
      >
        {partnerLogos.map((logo, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center">
            <img
              src={logo}
              alt={`Partner ${idx + 1}`}
              className="max-h-20 object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
};

export default SubscribedPartners;
