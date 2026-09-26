import type { IconType } from 'react-icons';
import {
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiHeart,
  FiHome,
  FiLock,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiSend,
} from 'react-icons/fi';

export function isBuyerRole(role?: string | null): boolean {
  const r = String(role || '').toLowerCase();
  return !r || r === 'user' || r === 'buyer' || r === 'tenant';
}

export type BuyerNavItem = {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
  badge?: number;
};

export const BUYER_NAV: BuyerNavItem[] = [
  { to: '/buyer', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/buyer/properties', label: 'My Properties', icon: FiShoppingBag },
  { to: '/buyer/saved', label: 'Saved Properties', icon: FiHeart },
  { to: '/buyer/alerts', label: 'Searches & Alerts', icon: FiSearch },
  { to: '/buyer/messages', label: 'Messages', icon: FiMessageSquare, badge: 2 },
  { to: '/buyer/inquiries', label: 'My Inquiries', icon: FiSend },
  { to: '/buyer/appointments', label: 'Appointments', icon: FiCalendar },
  { to: '/buyer/reviews', label: 'Reviews', icon: FiStar },
  { to: '/buyer/payments', label: 'Payments', icon: FiCreditCard },
  { to: '/buyer/settings', label: 'Account Settings', icon: FiSettings },
  { to: '/buyer/security', label: 'Security', icon: FiLock },
];

export function buyerPageTitle(pathname: string): string {
  for (const item of BUYER_NAV) {
    if (item.end) {
      if (pathname === item.to) return item.label;
    } else if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
      return item.label;
    }
  }
  return 'My Account';
}
