import { getApiBaseUrl } from '@/services/api';

const BASE_URL = getApiBaseUrl();

export const API_ROUTES = {
  GET_USERS: `${BASE_URL}/users`,
  GET_AGENTS: `${BASE_URL}/agent`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  CREATE_PROPERTY: `${BASE_URL}/properties`,
  GET_PROPERTY: `${BASE_URL}/properties`,
  GET_USER_PROPERTY: `${BASE_URL}/properties/user`,
  UPDATE_PROPERTY: `${BASE_URL}/properties`,
  DELETE_PROPERTY: `${BASE_URL}/properties`,
  GET_PROPERTY_ENUMS: `${BASE_URL}/properties/enums`,
  GET_FEATURED_PROPERTIES: `${BASE_URL}/properties/featured`,
  GET_SUBSCRIPTION_PLANS: `${BASE_URL}/subscription/plans`,
  GET_MY_SUBSCRIPTION: `${BASE_URL}/subscription/me`,
  SUBSCRIPTION_CHECKOUT: `${BASE_URL}/subscription/checkout`,
  AUTH_LOGIN: `${BASE_URL}/auth/login`,
  AUTH_REGISTER: `${BASE_URL}/auth/signup`,
};

export enum ROLE_ENUM {
  ADMIN = 'admin',
  USER = 'user',
  AGENT = 'agent',
  DEVELOPER = 'developer',
  LANDLORD = 'landlord',
  AGENCY = 'agency',
}

export type LayoutMode = 'main' | 'user';

export interface LayoutModeContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}
