/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import AgentContactCard from './AgentContactCard';

interface SidePageProps {
  property: Record<string, any> | null;
}

const SidePage: React.FC<SidePageProps> = ({ property }) => {
  return (
    <div className="side-page flex flex-col gap-4">
      <div className="side-con-price shadow-md rounded-xl p-4 bg-white flex flex-col gap-2">
        <div className="side-con-price-inner flex gap-4">
          <h1 className='text-primary-red font-bold text-3xl' >{property?.price.toLocaleString() || NaN}</h1>
          <span className='font-medium'>{property?.priceFrequency}</span>
        </div>
        <button
          type="button"
          className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
          // style={{ backgroundColor: primaryGreen }}
        >
          Request call back
        </button>
      </div>

        <div className="">
          <AgentContactCard
            name="Rexy Homes"
            image="https://randomuser.me/api/portraits/men/32.jpg"
            verified
            onShowContact={() => alert("Contact number: +234 800 000 0000")}
            onStartChat={() => alert("Starting chat...")}
          />
        </div>

      <div className="side-con-price shadow-md rounded-xl p-4 bg-white flex flex-col gap-2 text">
        <h1 className='text-primary-red font text-center text-xl'>Leave Feedback</h1>
      </div>
      <div className="side-con-price shadow-md rounded-xl p-4 mb-4 bg-white flex gap-2">
          <button
            type="button"
            className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
          // style={{ backgroundColor: primaryGreen }}
          >
            Mark unavailable
          </button>
          <button
            type="button"
            className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
          // style={{ backgroundColor: primaryGreen }}
          >
            Report abuse
          </button>
      </div>
    <div className="side-page shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Safety Tips</h2>
      <h3>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque quaerat esse voluptates magni, quos dolorem molestias suscipit maxime. Corrupti commodi facere consectetur sequi ad soluta qui explicabo rerum porro repudiandae.
      </h3>

      </div>
      {/* <p>This section can be used for related properties, ads, or booking info.</p> */}
    </div>

    // <div className="side-page">
    //   <div className="side-con-price shadow-md rounded p-4 mb-4 bg-white flex flex-col gap-2">
    //     <div className="side-con-price-inner flex gap-4">
    //       <h1 className='text-primary-red font-bold text-3xl'>
    //         {property?.price?.toLocaleString() || 'N/A'}
    //       </h1>
    //       <span className='font-medium'>{property?.priceFrequency}</span>
    //     </div>
    //     <button
    //       type="button"
    //       className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
    //     >
    //       Request call back
    //     </button>
    //   </div>

    //   <AgentContactCard
    //     name="Rexy Homes"
    //     image="https://randomuser.me/api/portraits/men/32.jpg"
    //     verified
    //     onShowContact={() => alert("Contact number: +234 800 000 0000")}
    //     onStartChat={() => alert("Starting chat...")}
    //   />

    //   <div className="side-con-price shadow-md rounded p-4 mb-4 bg-white flex flex-col gap-2 text">
    //     <h1 className='text-primary-red text-center text-xl'>Leave Feedback</h1>
    //   </div>

    //   <div className="side-con-price shadow-md rounded p-4 mb-4 bg-white flex gap-2">
    //     <button
    //       type="button"
    //       className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
    //     >
    //       Mark unavailable
    //     </button>
    //     <button
    //       type="button"
    //       className="w-full px-4 py-3 rounded-xl text-primary-red font-semibold border border-primary-red"
    //     >
    //       Report abuse
    //     </button>
    //   </div>

    //   <div className="side-page shadow rounded p-4">
    //     <h2 className="text-xl font-semibold mb-4">Safety Tips</h2>
    //     <h3>
    //       Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque quaerat esse voluptates magni, quos dolorem molestias suscipit maxime. Corrupti commodi facere consectetur sequi ad soluta qui explicabo rerum porro repudiandae.
    //     </h3>
    //   </div>
    // </div>
  );
};

export default SidePage;
