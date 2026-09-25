// import React from "react";

// interface GuideImage {
//   id: number;
//   image: string;
//   location: string;
// }

// const guideImages: GuideImage[] = [
//   { id: 1, image: "https://picsum.photos/800/600?random=1", location: "Port Harcourt" },
//   { id: 2, image: "https://picsum.photos/800/600?random=2", location: "Abeokuta" },
//   { id: 3, image: "https://picsum.photos/800/600?random=3", location: "Lagos" },
//   { id: 4, image: "https://picsum.photos/800/600?random=4", location: "Abuja" },
//   { id: 5, image: "https://picsum.photos/800/600?random=5", location: "Ibadan" },
//   { id: 6, image: "https://picsum.photos/800/600?random=6", location: "Kano" },
// ];

// const NeighbourhoodGuide: React.FC = () => {
//   return (
//     <section className="my-12 px-2">
//       <h2 className="text-xl font-semibold mb-6">Neighbourhood Guide</h2>

//       <div className="flex gap-4">
//         {/* 1st column - two stacked */}
//         <div className="flex flex-col gap-4 flex-1">
//           {[guideImages[0], guideImages[1]].map(({ id, image, location }) => (
//             <div key={id} className="relative h-64 rounded overflow-hidden cursor-pointer">
//               <img src={image} alt={location} className="w-full h-full object-cover" />
//               <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white p-2 text-center font-semibold">
//                 {location}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 2nd column - full height single image */}
//         <div className="flex-1 rounded overflow-hidden cursor-pointer relative h-[calc(64*2+1rem)]">
//           <img
//             src={guideImages[2].image}
//             alt={guideImages[2].location}
//             className="w-full h-full object-cover rounded"
//           />
//           <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white p-2 text-center font-semibold">
//             {guideImages[2].location}
//           </div>
//         </div>

//         {/* 3rd column - full height single image */}
//         <div className="flex-1 rounded overflow-hidden cursor-pointer relative h-[calc(64*2+1rem)]">
//           <img
//             src={guideImages[3].image}
//             alt={guideImages[3].location}
//             className="w-full h-full object-cover rounded"
//           />
//           <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white p-2 text-center font-semibold">
//             {guideImages[3].location}
//           </div>
//         </div>

//         {/* 4th column - two stacked */}
//         <div className="flex flex-col gap-4 flex-1">
//           {[guideImages[4], guideImages[5]].map(({ id, image, location }) => (
//             <div key={id} className="relative h-64 rounded overflow-hidden cursor-pointer">
//               <img src={image} alt={location} className="w-full h-full object-cover" />
//               <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white p-2 text-center font-semibold">
//                 {location}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </section>
//   );
// };

// export default NeighbourhoodGuide;


import { guideData } from '@/data/guide';
import React from 'react';
import { Link } from 'react-router-dom';

const NeighbourhoodGuide: React.FC = () => {
  // Layout same as your screenshot: two stacked columns on the sides, two tall middle columns
  const leftStack = [guideData[0], guideData[1]];
  const rightStack = [guideData[4], guideData[5]];
  const middleSingle = guideData[2];
  const middleSingle2 = guideData[3];

  return (
    <section className="my-12 px-2">
      <h2 className="text-xl font-semibold mb-6">Neighbourhood Guide</h2>

      <div className="flex gap-4">
        {/* 1st column - two stacked */}
        <div className="flex flex-col gap-4 flex-1">
          {leftStack.map(({ id, image, location, slug }) => (
            <Link key={id} to={`/neighbourhood/${slug}`} className="relative h-64 rounded overflow-hidden cursor-pointer block">
              <img src={image} alt={location} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-center font-semibold">
                {location}
              </div>
            </Link>
          ))}
        </div>

        {/* 2nd column */}
        <div className="flex-1 rounded overflow-hidden relative h-[calc(64*2+1rem)]">
          <Link to={`/neighbourhood/${middleSingle.slug}`} className="block w-full h-full">
            <img src={middleSingle.image} alt={middleSingle.location} className="w-full h-full object-cover rounded" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-center font-semibold">
              {middleSingle.location}
            </div>
          </Link>
        </div>

        {/* 3rd column */}
        <div className="flex-1 rounded overflow-hidden relative h-[calc(64*2+1rem)]">
          <Link to={`/neighbourhood/${middleSingle2.slug}`} className="block w-full h-full">
            <img src={middleSingle2.image} alt={middleSingle2.location} className="w-full h-full object-cover rounded" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-center font-semibold">
              {middleSingle2.location}
            </div>
          </Link>
        </div>

        {/* 4th column - two stacked */}
        <div className="flex flex-col gap-4 flex-1">
          {rightStack.map(({ id, image, location, slug }) => (
            <Link key={id} to={`/neighbourhood/${slug}`} className="relative h-64 rounded overflow-hidden cursor-pointer block">
              <img src={image} alt={location} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-center font-semibold">
                {location}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeighbourhoodGuide;
