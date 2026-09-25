/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { PROPERTY_SERVICE } from "@/services/property";
import { usePropertyStore } from "@/store/propertyStore";
import PropertyForm from "@/components/property/PropertyForm";

const EditPropertyPage = () => {
  const { propertyId } = useParams();
  const { updateFormData, setCurrentStep, submitProperty } = usePropertyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (propertyId) {
      PROPERTY_SERVICE.getPropertyById(propertyId).then((res: any) => {
        updateFormData(res.data);
        setCurrentStep('Basic');
      });
    }
  }, [propertyId]);

  const handleUpdate = async () => {
    try {
      await submitProperty(); // Internally handle update call
      navigate('/my-listing');
      // success toast or redirect
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  return <PropertyForm mode="edit" onSubmit={handleUpdate} />;
};

export default EditPropertyPage;
