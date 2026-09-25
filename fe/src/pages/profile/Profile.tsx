import React, { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const {
    selectedUser,
    getCurrentUser,
    loading,
  } = useUserStore();

  const [firstName, lastName = ''] = (selectedUser?.name || '').split(' ');

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (loading || !selectedUser) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Profile Picture */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm shadow-md">
          Photo
        </div>

        <button
          onClick={() => navigate('/edit-profile')}
          className="mt-4 sm:mt-0 px-6 py-2 bg-primary-red text-white rounded-md hover:bg-secondary-red transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InfoCard label="First Name" value={firstName || '—'} />
        <InfoCard label="Last Name" value={lastName || '—'} />
        <InfoCard label="Organization Name" value={selectedUser.displayName || '—'} />
        <InfoCard label="Email" value={selectedUser.email} />
        <InfoCard label="Phone" value={selectedUser.phone || '—'} />
        <InfoCard label="Address" value={selectedUser.address || '—'} />
        <InfoCard label="Country" value={selectedUser.country || '—'} />
        <InfoCard label="Facebook" value={selectedUser.facebookUrl || '—'} isLink />
        <InfoCard label="LinkedIn" value={selectedUser.linkedinUrl || '—'} isLink />
      </div>
    </div>
  );
};

export default Profile;

interface InfoCardProps {
  label: string;
  value: string;
  isLink?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, isLink = false }) => (
  <div className="bg-white shadow-md rounded-md p-4 border border-gray-100">
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    {isLink && value !== '—' ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline break-all text-sm"
      >
        {value}
      </a>
    ) : (
      <div className="text-gray-800 text-sm break-words">{value || '—'}</div>
    )}
  </div>
);
