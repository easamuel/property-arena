import { FiStar } from 'react-icons/fi';
import { BUYER_REVIEWS } from '@/data/buyer-demo';
import { BuyerCard } from '@/components/buyer/BuyerUi';

export default function BuyerReviews() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">Feedback you left after viewings and stays.</p>
      </div>

      <div className="space-y-3">
        {BUYER_REVIEWS.map((review) => (
          <BuyerCard key={review.id} className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-gray-900">{review.property}</p>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <div className="mt-2 flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <FiStar
                  key={i}
                  className={i < review.rating ? 'fill-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.text}</p>
          </BuyerCard>
        ))}
      </div>
    </div>
  );
}
