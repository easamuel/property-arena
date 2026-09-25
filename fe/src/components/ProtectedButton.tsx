// src/components/ProtectedButton.tsx
import React, { ButtonHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onAuthClick: () => void;
}

export function ProtectedButton({
  onAuthClick,
  ...btnProps
}: ProtectedButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onAuthClick();
  }

  return <button {...btnProps} onClick={handleClick} />;
}
