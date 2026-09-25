import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { PropertyFormData } from '@/types';
import { PROPERTY_SERVICE } from '@/services/property';
import { AREA_MEASUREMENT, CURRENCY_TYPE, LISTING_PURPOSE, PROPERTY_STATUS, PROPERTY_TYPE, PropertyData, PropertyFormData } from '@/types/property';


interface FetchParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

interface PropertyEnums {
  PROPERTY_STATUS: Record<string, string>;
  PROPERTY_TYPE: Record<string, string>;
  LISTING_PURPOSE: Record<string, string>;
  CURRENCY_TYPE: Record<string, string>;
  AREA_MEASUREMENT: Record<string, string>;
  PRICE_FREQUENCY: Record<string, string>;
}

interface PropertyStore {
  listings: PropertyData[];
  meta: any | null;
  loading: boolean;
  error: string | null;
  featuredListings: PropertyData[];
  fetchProperties: (params?: Record<string, string>) => Promise<void>;
  fetchFeaturedProperties: (params?: FetchParams) => Promise<void>;
  
  // Form data state
  formData: PropertyFormData;
  currentStep: string;
  isSubmitting: boolean;

  // Actions
  updateFormData: (stepData: Partial<PropertyFormData>) => void;
  setCurrentStep: (step: string) => void;
  resetForm: () => void;
  submitProperty: () => Promise<void>;

  // Validation
  isStepValid: (step: string) => boolean;
  canProceedToStep: (step: string) => boolean;

  enums: PropertyEnums | null;
  fetchEnums: () => Promise<void>;
}


const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  price: 0,
  currency: CURRENCY_TYPE.NGN,
  oldPrice: 0,
  priceFrequency: '',
  isIntallmentPaymentAllowed: false,

  propertyType: PROPERTY_TYPE.HOUSE,
  listingPurpose: LISTING_PURPOSE.SALE,
  status: PROPERTY_STATUS.AVAILABLE,

  address: '',

  landArea: '',
  landAreaMeasurement: AREA_MEASUREMENT.SQM,

  garagesOrParkingSpaces: '',
  location: '',
  bedroom: '',

  features: [],
  media: [],
  document: [],

  agent: '',
  selectedAgent: '',

  reviewNotes: '',
  agentDisplayOption: 'none',
};


export const usePropertyStore = create<PropertyStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 'Basic',
      isSubmitting: false,
      enums: null,
      featuredListings: [],

      fetchProperties: async (params = {}) => {
      try {
        set({ loading: true, error: null });
        const res = await PROPERTY_SERVICE.getProperties(params);
        set({
          listings: res.data ?? [],
          meta: res.meta ?? null,
        });
      } catch (err: any) {
        set({ error: `Failed to load properties: ${err.message}` });
      } finally {
        set({ loading: false });
      }
    },

      fetchFeaturedProperties: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          const { page = 1, limit = 10 } = params as { page?: number; limit?: number };

          const res = await PROPERTY_SERVICE.getFeaturedProperties(page, limit);

          set({
            featuredListings: res.data ?? [],
            meta: res.meta ?? null,
          });
        } catch (err: any) {
          set({ error: `Failed to load featured properties: ${err.message}` });
        } finally {
          set({ loading: false });
        }
      },

    fetchEnums: async () => {
      try {
        set({loading: true, error: null});
        const res = await PROPERTY_SERVICE.getPropertyEnums()
        set({enums: res.data ?? []})
      } catch (error: any) {
        set({error: `Failed to load enums: ${error.message}`})
      } finally {
        set({loading: false})
      }
    },

      updateFormData: (stepData) => {
        set((state) => ({
          formData: { ...state.formData, ...stepData }
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      resetForm: () => {
        set({
          formData: initialFormData,
          currentStep: 'Basic',
          isSubmitting: false
        });
      },

      submitProperty: async () => {
        const { formData } = get();

        set({ isSubmitting: true });

        try {
          if (formData.id) {
            // EDIT MODE
            await PROPERTY_SERVICE.updateProperty(formData.id, formData);
          } else {
            // CREATE MODE
            await PROPERTY_SERVICE.createProperty({
              propertyData: formData,
            });
          }

          get().resetForm();
        } catch (error) {
          console.error('Failed to submit property:', error);
          throw error;
        } finally {
          set({ isSubmitting: false });
        }
      },
      // Validation helpers
      isStepValid: (step) => {
        const { formData } = get();

        switch (step) {
          case 'Basic':
            return (
              formData.title.trim() !== '' &&
              formData.address.trim() !== '' &&
              formData.description.trim() !== '' &&
              formData.price > 0 &&
              // formData.oldPrice !== 0 &&
              formData.currency.trim() !== '' &&
              formData.priceFrequency.trim() !== '' &&
              formData.listingPurpose.trim() !== '' &&
              formData.status.trim().toLowerCase() !== '' &&
              formData.location.trim().toLowerCase() !== '' &&
              // formData.bedroom.trim().toLowerCase() !== '' &&
              // formData.landArea.trim().toLowerCase() !== '' &&
              // formData.landAreaMeasurement.trim().toLowerCase() !== '' &&
              // formData.garagesOrParkingSpaces.trim().toLowerCase() !== '' &&
              formData.propertyType.trim().toLowerCase() !== ''
            );
          case 'Gallery':
            return formData.media.length > 0;
          case 'Features':
            return formData.features.length > 0;
          case 'Agent & Review':
            return true;
          default:
            return false;
        }
      },      

      canProceedToStep: (targetStep) => {
        const steps = ['Basic', 'Gallery', 'Features', 'Agent & Review'];
        const currentIndex = steps.indexOf(get().currentStep);
        const targetIndex = steps.indexOf(targetStep);

        // Can always go back
        if (targetIndex <= currentIndex) return true;

        // Can only proceed if current step is valid
        return get().isStepValid(get().currentStep);
      }
    }),
    { name: 'property-store' }
  )
);
