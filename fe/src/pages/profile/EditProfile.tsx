import React, { useState, useEffect } from 'react';
import FormFieldBox from '@/components/FormField';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore'; // If you handle update via userStore
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const user = useAuthStore(state => state.user);
  const { updateUser, selectedUser, loading } = useUserStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
    address: '',
    facebookUrl: '',
    linkedinUrl: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = user.name?.split(' ') || [];
      setFormData({
        firstName,
        lastName,
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        facebookUrl: user.facebookUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      name: fullName,
      displayName: formData.displayName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      facebookUrl: formData.facebookUrl,
      linkedinUrl: formData.linkedinUrl,
      country: formData.country,
    };

    try {
      if (user?.id) {
        await updateUser(payload);
        navigate('/profile');
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  if (loading || !selectedUser) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-left mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm shadow-md">
          Photo
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          <FormFieldBox label="First Name" halfWidth>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="John"
            />
          </FormFieldBox>

          <FormFieldBox label="Last Name" halfWidth>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="Doe"
            />
          </FormFieldBox>

          <FormFieldBox label="Organization Name" halfWidth>
            <input
              type="text"
              value={formData.displayName}
              onChange={e => handleInputChange('displayName', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="johnny123"
            />
          </FormFieldBox>

          <FormFieldBox label="Email" halfWidth>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="you@example.com"
            />
          </FormFieldBox>

          <FormFieldBox label="Phone" halfWidth>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="+234 800 000 0000"
            />
          </FormFieldBox>

          <FormFieldBox label="Address" halfWidth>
            <input
              type="text"
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="123 Property Street"
            />
          </FormFieldBox>

          <FormFieldBox label="Country" halfWidth>
            <input
              type="text"
              value={formData.country}
              onChange={e => handleInputChange('country', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="Nigeria"
            />
          </FormFieldBox>

          <FormFieldBox label="Facebook URL" halfWidth>
            <input
              type="url"
              value={formData.facebookUrl}
              onChange={e => handleInputChange('facebookUrl', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="https://facebook.com/yourprofile"
            />
          </FormFieldBox>

          <FormFieldBox label="LinkedIn URL" halfWidth>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={e => handleInputChange('linkedinUrl', e.target.value)}
              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red h-14"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </FormFieldBox>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-red text-white rounded-md hover:bg-secondary-red"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
