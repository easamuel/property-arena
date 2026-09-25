// services/property.service.ts
import { API } from './api';
import { API_ROUTES } from '@/constants';
import { CreatePropertyRequest, CreatePropertyResponse } from '@/types';
import { PropertyFormData } from '@/types/property';

type PropertyQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  all?: string;
  propertyType?: string;
  status?: string;
  listingPurpose?: string;
  location?: string;
  bedroom?: string;
  minPrice?: number;
  maxPrice?: number;
};

const createProperty = async (data: CreatePropertyRequest): Promise<CreatePropertyResponse> => {
  return API(API_ROUTES.CREATE_PROPERTY, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data.propertyData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getPropertyById = async (id: string) => {
  return API(`${API_ROUTES.GET_PROPERTY}/${id}`, {
    method: 'GET',
  });
};

// Improved: build query only when params present, and coerce values to strings
const getProperties = async (params: PropertyQueryParams = {}) => {
  const filtered: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') {
      filtered[k] = String(v);
    }
  });

  const queryString = Object.keys(filtered).length ? `?${new URLSearchParams(filtered).toString()}` : '';
  return API(`${API_ROUTES.GET_PROPERTY}${queryString}`, {
    method: 'GET',
  });
};

const getFeaturedProperties= async (page= 1, limit=1) => {
  return API(`${API_ROUTES.GET_FEATURED_PROPERTIES}?page=${page}&limit=${limit}`, {
    method: 'GET'
  })
}

const getUserProperties = async (page = 1, limit = 10) => {
  return API(`${API_ROUTES.GET_USER_PROPERTY}?page=${page}&limit=${limit}`, {
    method: 'GET',
    auth: true
  });
};

const updateProperty = async (id: string, data: Partial<PropertyFormData>) => {
  return API(`${API_ROUTES.UPDATE_PROPERTY}/${id}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(data)
  });
};

const deleteProperty = async (id: string) => {
  return API(`${API_ROUTES.DELETE_PROPERTY}/${id}`, {
    method: 'DELETE',
    auth: true
  });
};

const getPropertyEnums = async () => {
  return API(`${API_ROUTES.GET_PROPERTY_ENUMS}`, {
    method: 'GET'
  });
};

export const PROPERTY_SERVICE = {
  createProperty,
  getPropertyById,
  getProperties,
  getUserProperties,
  updateProperty,
  deleteProperty,
  getPropertyEnums,
  getFeaturedProperties
};
