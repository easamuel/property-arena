/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePropertyStore } from "@/store/propertyStore";
import PropertyGalleryStep from "@/components/property/PropertyGalleryStep";
import PropertyFeaturesStep from "@/components/property/PropertyFeatureStep";
import PropertyAgentReviewStep from "@/components/property/PropertyAgentReviewStep";
import FormFieldBox from "@/components/FormField";
import StepTopBar from "@/pages/create-property/CreatePropertyTopBar";
import { CURRENCY_TYPE, PRICE_FREQUENCY, PROPERTY_STATUS, LISTING_PURPOSE, AREA_MEASUREMENT, PROPERTY_TYPE } from "@/types";
import { BEDROOM_OPTIONS } from "@/types/options";
import { enumToSelectOptions } from "@/utils/enumToSelectOptions";
import { CurrencyFieldWithToggle } from "../dropdowns/CurrencyDropdown";
import CustomSelect from "../dropdowns/CustomSelect";
import MeasurementInputWithDropdown from "../dropdowns/MeasurementDropdown";

interface PropertyFormProps {
  mode: "create" | "edit";
  onSubmit?: () => Promise<void>;
}

const PropertyForm = ({ mode, onSubmit }: PropertyFormProps) => {
  const {
    formData,
    currentStep,
    isSubmitting,
    updateFormData,
    setCurrentStep,
    isStepValid,
    canProceedToStep,
  } = usePropertyStore();

  const steps = ['Basic', 'Gallery', 'Features', 'Agent & Review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  return (
    <div className="flex justify-center my-24">
      <div className="main main-con-style">
        <div className="">
          <h1 className="text-2xl font-semibold mb-6 p-4">
            {mode === 'edit' ? 'Edit Property' : 'Post Property'}
          </h1>
          <StepTopBar
            mode={mode}
            activeStep={currentStep}
            setActiveStep={setCurrentStep}
            canProceedToStep={canProceedToStep}
          />
        </div>

        <div className="min-h-[500px] pb-20">
                    {currentStep === "Basic" && (
                      <div className="space-y-4 p-[5%]">
                        {/* Full Width Fields */}
                        <div className="flex flex-wrap gap-4 mb-6">
                           <FormFieldBox label="Property Title" fullWidth>
                             <input
                               type="text"
                              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                               value={formData.title}
                              onChange={e => handleInputChange('title', e.target.value)}
                               placeholder="e.g. Spacious Apartment"
                             />
                           </FormFieldBox>
                        
                           <FormFieldBox label="Address" fullWidth>
                             <input
                               type="text"
                              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                               value={formData.address}
                               onChange={e => handleInputChange('address', e.target.value)}
                               placeholder="Property address"
                             />
                           </FormFieldBox>
                        
                           <FormFieldBox label="Description" fullWidth>
                             <textarea
                              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                               rows={4}
                               value={formData.description}
                               onChange={e => handleInputChange('description', e.target.value)}
                               placeholder="Property description"
                            />
                           </FormFieldBox>
                        </div>
          
                        {/* 3 Columns Grid */}
          
                        <div className="flex flex-wrap gap-4" >
                          {/* <FormFieldBox label="Sale or Rent Price">
                            <input
                              type="number"
                              className="w-full shadow-md p-2 rounded-md"
                              value={formData.price}
                              onChange={e => handleInputChange('price', Number(e.target.value))}
                              placeholder="e.g. 500000"
                            />
                          </FormFieldBox> */}
          
                          <div className="form-fields-row">
                            <FormFieldBox label="Sale or Rent Price">
                              <CurrencyFieldWithToggle
                                value={formData.price || ''}
                                currency={formData.currency || 'NGN'}
                                currencyOptions={Object.values(CURRENCY_TYPE)}
                                onValueChange={(price: number) => handleInputChange('price', price)}
                                onCurrencyChange={(currency: string) => handleInputChange('currency', currency)}
                                placeholder="e.g. 500000"
                              />
                            </FormFieldBox>
                            <FormFieldBox label="Old Price">
                              <CurrencyFieldWithToggle
                                value={formData.oldPrice || ''}
                                currency={formData.currency || 'NGN'}
                                currencyOptions={Object.values(CURRENCY_TYPE)}
                                onValueChange={(oldPrice: number) => handleInputChange('oldPrice', oldPrice)}
                                onCurrencyChange={(currency: string) => handleInputChange('currency', currency)}
                                placeholder="e.g. 500000"
                              />
                            </FormFieldBox>
                          </div>
                          <FormFieldBox label="Pricing Unit">
                            <CustomSelect
                              value={formData.priceFrequency}
                              options={enumToSelectOptions(PRICE_FREQUENCY)}
                              onChange={val => handleInputChange('priceFrequency', val)}
                            />
                          </FormFieldBox>
                          <FormFieldBox label="Status">
                            <CustomSelect
                              value={formData.status}
                              options={enumToSelectOptions(PROPERTY_STATUS)}
                              onChange={val => handleInputChange('status', val)}
                            />
                          </FormFieldBox>
                          <FormFieldBox label="Purpose">
                            <CustomSelect
                              value={formData.listingPurpose}
                              options={enumToSelectOptions(LISTING_PURPOSE)}
                              onChange={val => handleInputChange('listingPurpose', val)}
                            />
                          </FormFieldBox>
          
                          <FormFieldBox label="Land Area">
                            <MeasurementInputWithDropdown
                              value={formData.landArea}
                              measurement={formData.landAreaMeasurement}
                              measurementOptions={Object.values(AREA_MEASUREMENT)}
                              onValueChange={val => handleInputChange('landArea', val)}
                              onMeasurementChange={unit => handleInputChange('landAreaMeasurement', unit)}
                              placeholder="e.g. 1000"
                            />
                          </FormFieldBox>
                          <FormFieldBox label="Property Type">
                            <CustomSelect 
                              value={formData.propertyType} 
                              options={enumToSelectOptions(PROPERTY_TYPE)} 
                              onChange={val => handleInputChange('propertyType', val)} 
                            />
                          </FormFieldBox>
          
                          <FormFieldBox label="Location" >
                            <input
                              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                              value={formData.location}
                              onChange={e => handleInputChange('location', e.target.value)}
                              // disabled={true}
                            />
                          </FormFieldBox>
                          <FormFieldBox label="Bedroom">
                            <CustomSelect
                              value={formData.bedroom}
                              options={BEDROOM_OPTIONS}
                              onChange={val => handleInputChange('bedroom', val)}
                            />
                          </FormFieldBox>
                          <FormFieldBox label="Garages or Parking spaces">
                            <input
                              type="text"
                              className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                              value={formData.garagesOrParkingSpaces}
                              onChange={e => handleInputChange('garagesOrParkingSpaces', e.target.value)}
                              placeholder=""
                            />
                          </FormFieldBox>
                          
                        </div>
                      </div>
                    )}

          {currentStep === 'Gallery' && (
            <PropertyGalleryStep
              media={formData.media ?? []}
              onChange={(media) => handleInputChange('media', media)}
            />
          )}

          {currentStep === 'Features' && (
            <PropertyFeaturesStep
              features={formData.features}
              onChange={(list) => handleInputChange('features', list)}
            />
          )}

          {currentStep === "Agent & Review" && (
            <PropertyAgentReviewStep
              agentDisplayOption={formData.agentDisplayOption}
              selectedAgentId={formData.selectedAgentId || formData.selectedAgent}
              onOptionChange={value => handleInputChange('agentDisplayOption', value)}
              onAgentSelect={id => {
                handleInputChange('selectedAgentId', id);
                handleInputChange('selectedAgent', id);
              }}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="relative bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
          <div>
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStep(steps[currentStepIndex - 1])}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
          </div>

          <div>
            {!isLastStep ? (
              <button
                onClick={handleNext}
                // In edit mode, always enabled; otherwise, check step validity
                disabled={mode !== 'edit' && !isStepValid(currentStep)}
                className={`px-6 py-2 bg-primary-red text-white rounded-md hover:bg-secondary-red
                ${mode !== 'edit' && !isStepValid(currentStep) ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
                >
                Next
              </button>
            ) : (
              /* Submit button */
              <button
                  onClick={onSubmit}
                  // In edit mode, always enabled unless submitting; else normal disabled logic
                  disabled={mode !== 'edit' && (isSubmitting || !isStepValid(currentStep))}
                  className={`px-6 py-2 bg-primary-red text-white rounded-md hover:bg-secondary-red
                  ${mode !== 'edit' && (isSubmitting || !isStepValid(currentStep)) ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
                >
                {isSubmitting
                  ? mode === 'edit' ? 'Updating Property...' : 'Creating Property...'
                  : mode === 'edit' ? 'Update Property' : 'Create Property'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
