import React from "react";
import { FaPhoneAlt, FaCommentDots, FaCheckCircle } from "react-icons/fa";

interface AgentContactCardProps {
  name: string;
  image: string;
  verified?: boolean;
  onShowContact?: () => void;
  onStartChat?: () => void;
}

const AgentContactCard: React.FC<AgentContactCardProps> = ({
  name,
  image,
  verified = false,
  onShowContact,
  onStartChat,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center space-y-3 w-auto">
      {/* Profile Image */}
      <div className="flex justify-start w-full">
        <div className="image-con flex items-start space-x-4">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />

          {/* Agent Name + Verified */}
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{name}</h3>
            {verified && (
              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-gray-700 font-medium">Verified ID</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-2">
        <button
          onClick={onShowContact}
          className="w-full bg-primary-red hover:bg-red-700 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 transition"
        >
          <FaPhoneAlt className="text-sm" /> Show Contact
        </button>

        <button
          onClick={onStartChat}
          className="w-full border border-primary-red text-primary-red hover:bg-primary-red hover:text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 transition"
        >
          <FaCommentDots className="text-sm" /> Start Chat
        </button>
      </div>
    </div>

  );
};

export default AgentContactCard;
