import React from 'react';

interface FormFieldBoxProps {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  halfWidth?: boolean; // Add this prop
}

const FormFieldBox: React.FC<FormFieldBoxProps> = ({ label, children, fullWidth = false, halfWidth = false }) => {
  let widthClass = 'flex-1 min-w-[200px]'; // Default behavior

  if (fullWidth) {
    widthClass = 'w-full';
  } else if (halfWidth) {
    widthClass = 'w-[calc(50%-0.5rem)] min-w-[200px]'; // Exactly half width minus gap
  }

  return (
    <div className={widthClass}>
      <label className="block font-normal mb-1">{label}</label>
      {children}
    </div>
  );
};

export default FormFieldBox;