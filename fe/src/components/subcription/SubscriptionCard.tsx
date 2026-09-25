import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

type Props = {
  name?: string
  label?: string
  price: string
  note?: string
  features: [string, string][]
}

const SubscriptionCard: React.FC<Props> = ({ name, label, price, note, features }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col max-w-[18rem]">
      {/* Top Label */}
      {label && (
        <div className="bg-black text-white text-xs text-center py-1 uppercase tracking font-semibold">
          {label}
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col p-4">
        {/* Title + Note */}
        <div className="text-center">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="text-xs text-gray-500">{note}</div>
        </div>

        {/* Price + Button */}
        <div className="my-4 text-center">
          <div className="text-3xl font-bold">{price}</div>
          <button className="bg-secondary-red text-white mt-2 py-1 px-4 rounded hover:bg-red-700 transition">
            Buy now
          </button>
          <p className="text-[10px] text-gray-700 mt-4 mb-8">
            Pay online for instant activation
          </p>
        </div>

        {/* Feature List */}
        <div className="border-t pt-2 text-sm space-y-2">
          {features.map(([feature, value], idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between border-b pb-1 ${idx === features.length - 1 ? 'border-none' : ''}`}
            >
              <span>{feature}</span>
              {feature === 'View client Request' ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <span className="font-medium text-gray-800">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard
