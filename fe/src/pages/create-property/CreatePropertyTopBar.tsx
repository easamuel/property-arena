interface StepTopBarProps {
  mode?: 'create' | 'edit';
  activeStep: string;
  setActiveStep: (step: string) => void;
  canProceedToStep?: (step: string) => boolean;
}

const steps = ["Basic", "Gallery", "Features", "Agent & Review"];

const StepTopBar = ({ mode = 'create', activeStep, setActiveStep, canProceedToStep }: StepTopBarProps) => {
  const currentStepIndex = steps.indexOf(activeStep);

  const handleStepClick = (step: string, index: number) => {
    // In edit mode: allow clicking any step
    if (mode === 'edit') {
      setActiveStep(step);
      return;
    }

    // In create mode: check progression
    if (index <= currentStepIndex) {
      setActiveStep(step);
      return;
    }

    if (canProceedToStep && canProceedToStep(step)) {
      setActiveStep(step);
    }
  };

  const isStepClickable = (step: string, index: number) => {
    if (mode === 'edit') return true;
    if (index <= currentStepIndex) return true;
    return canProceedToStep ? canProceedToStep(step) : false;
  };

  const getStepStatus = (step: string, index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'pending';
  };
// const StepTopBar = ({ activeStep, setActiveStep, canProceedToStep }: StepTopBarProps) => {
//   const currentStepIndex = steps.indexOf(activeStep);

//   const handleStepClick = (step: string, index: number) => {
//     // Allow clicking on current step or previous steps
//     if (index <= currentStepIndex) {
//       setActiveStep(step);
//       return;
//     }

//     // For future steps, check if user can proceed
//     if (canProceedToStep && canProceedToStep(step)) {
//       setActiveStep(step);
//     }
//   };

//   const getStepStatus = (step: string, index: number) => {
//     if (index < currentStepIndex) return 'completed';
//     if (index === currentStepIndex) return 'active';
//     return 'pending';
//   };

//   const isStepClickable = (step: string, index: number) => {
//     if (index <= currentStepIndex) return true;
//     return canProceedToStep ? canProceedToStep(step) : false;
//   };

  return (
    <div className="flex space-x-4 bg-black shadow-md p-4 rounded-md mb-6">
      {steps.map((step, index) => {
        const status = getStepStatus(step, index);
        const isClickable = isStepClickable(step, index);

        return (
          <button
            key={step}
            onClick={() => handleStepClick(step, index)}
            disabled={!isClickable}
            className={`relative px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed
              ${status === 'active'
                ? "text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-white"
                : status === 'completed'
                  ? "text-primary-green hover:text-green-300"
                  : "text-gray-500 hover:text-gray-400"}
              ${!isClickable ? "opacity-50" : ""}
            `}
          >
            <span className="flex items-center space-x-2">
              {/* Step number/icon */}
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                ${status === 'active'
                  ? "bg-white text-black"
                  : status === 'completed'
                    ? "bg-primary-green text-white"
                    : "bg-gray-600 text-gray-400"}
              `}>
                {status === 'completed' ? '✓' : index + 1}
              </span>
              <span>{step}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StepTopBar;