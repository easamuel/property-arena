import { getColorFromName } from '@/utils/getColorFromName'
import React from 'react'


type Props = {
  icon: string
  number: number
  heading: string
  text: string
}

const PropertyCard: React.FC<Props> = ({ icon, number, heading, text }) => {
  const textColor = getColorFromName(text || heading)
  return (
    <div className="bg-[#171821] rounded-2xl p-8 text-center text-white shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xl font-bold">{number}</div>
      <div className="font-semibold text-xs">{heading}</div>
      <div className="text-gray-400 text-[8px]"
        style={{ color: textColor }}
      >{text}</div>
    </div>
  )
}

export default PropertyCard
