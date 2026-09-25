/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from 'react-hot-toast';

// Global error handler function
export const handleGlobalError = (error: Error, errorInfo?: any) => {
  console.error('Global error caught:', error, errorInfo);

  // Try to determine context from the stack trace
  const context = getErrorContext(error);
  const contextualMessage = context ? `${context}: ${error.message}` : error.message;

  // Show toast notification
  toast.error(contextualMessage || 'An unexpected error occurred');

  // Optional: Send to error reporting service
  // reportError(error, errorInfo);
};

// Function to extract context from error stack
const getErrorContext = (error: Error): string | null => {
  if (!error.stack) return null;

  const stack = error.stack;

  // Look for specific function names or file patterns in the stack
  if (stack.includes('signup') || stack.includes('SignUp')) {
    return 'Signup failed';
  }
  if (stack.includes('login') || stack.includes('Login')) {
    return 'Login failed';
  }
  if (stack.includes('fetch') || stack.includes('api')) {
    return 'Network request failed';
  }
  if (stack.includes('payment') || stack.includes('Payment')) {
    return 'Payment failed';
  }

  return null;
};

export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    toast.error('An error occurred while processing your request');
    event.preventDefault(); // Prevent default browser behavior
  });

  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    toast.error('An unexpected error occurred');
    event.preventDefault();
  });

  // Handle React error boundary errors (if you're using React)
  window.addEventListener('react-error', (event: any) => {
    console.error('React error:', event.detail);
    toast.error('A component error occurred');
  });
};