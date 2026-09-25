import { getColorFromName } from '@/utils/getColorFromName'
import { TinyColor } from '@ctrl/tinycolor'
import React from 'react'

const products = [
  { name: 'Product A', popularity: 70, sales: 55 },
  { name: 'Something', popularity: 40, sales: 30 },
  { name: 'Hello', popularity: 90, sales: 80 },
]
const DashboardProductCard: React.FC = () => {
  return (
    <div className="bg-[#171821] p-4 sm:p-6 md:p-8 rounded-xl shadow text-white">
      <h2 className="text-base sm:text-lg font-bold mb-4">Top Products</h2>

      <div className="grid grid-cols-3 font-semibold text-xs sm:text-sm mb-2 text-gray-400">
        <div>Name</div>
        <div>Popularity</div>
        <div className="text-right">Sales</div>
      </div>

      {products.map((product, idx) => {
        const fillColor = getColorFromName(product.name)

        return (
          <div
            key={idx}
            className="grid grid-cols-3 items-center text-xs sm:text-sm py-2 gap-x-2"
          >
            <div>{product.name}</div>
            <div className="w-full h-1 bg-gray-600 rounded relative overflow-hidden">
              <div
                className="absolute w-full top-0 left-0 h-full rounded"
                style={{
                  width: `${product.popularity}%`,
                  backgroundColor: fillColor,
                }}
              />
            </div>
            <div className="text-right">
              <span
                className="text-xs px-2 py-1 rounded border"
                style={{
                  color: fillColor,
                  borderColor: fillColor,
                  backgroundColor: new TinyColor(fillColor).setAlpha(0.15).toRgbString(),
                }}
              >
                {product.sales}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardProductCard
