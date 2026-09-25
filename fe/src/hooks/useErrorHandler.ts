import { handleGlobalError } from "@/utils/errorHandler";

export const useErrorHandler = () => {
  return (error: Error, context?: string) => {
    const contextualError = context
      ? new Error(`${context}: ${error.message}`)
      : error;

    handleGlobalError(contextualError);
  };
};

// Direct function for non-hook usage
export const handleError = (error: Error, context?: string) => {
  const contextualError = context
    ? new Error(`${context}: ${error.message}`)
    : error;

  handleGlobalError(contextualError);
};