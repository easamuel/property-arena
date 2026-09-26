export const BUYER_STATS = [
  {
    key: 'saved',
    label: 'Saved Properties',
    value: '12',
    to: '/buyer/saved',
    tone: 'green' as const,
  },
  {
    key: 'alerts',
    label: 'Searches & Alerts',
    value: '8',
    to: '/buyer/alerts',
    tone: 'blue' as const,
  },
  {
    key: 'messages',
    label: 'Messages',
    value: '5',
    to: '/buyer/messages',
    tone: 'purple' as const,
  },
  {
    key: 'appointments',
    label: 'Upcoming Appointments',
    value: '3',
    to: '/buyer/appointments',
    tone: 'amber' as const,
  },
];

export const BUYER_RECOMMENDED = [
  {
    id: '1',
    title: '3 Bedroom Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '₦350,000',
    period: '/ night',
    beds: 3,
    baths: 3,
    parking: 2,
    verified: true,
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=640&h=420&fit=crop',
  },
  {
    id: '2',
    title: 'Luxury Duplex',
    location: 'Ikoyi, Lagos',
    price: '₦180,000,000',
    period: '',
    beds: 4,
    baths: 5,
    parking: 3,
    verified: true,
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=420&fit=crop',
  },
  {
    id: '3',
    title: 'Modern Studio Flat',
    location: 'Victoria Island, Lagos',
    price: '₦95,000',
    period: '/ night',
    beds: 1,
    baths: 1,
    parking: 1,
    verified: true,
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=640&h=420&fit=crop',
  },
  {
    id: '4',
    title: '4 Bedroom Terrace',
    location: 'Ajah, Lagos',
    price: '₦85,000,000',
    period: '',
    beds: 4,
    baths: 4,
    parking: 2,
    verified: true,
    thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640&h=420&fit=crop',
  },
];

export const BUYER_ACTIVITY = [
  {
    id: '1',
    text: 'You saved 4 Bedroom Duplex in Ikoyi',
    time: '2 hours ago',
    kind: 'saved' as const,
    status: '',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=90&fit=crop',
  },
  {
    id: '2',
    text: 'New alert: 3 properties match your Lekki search',
    time: '5 hours ago',
    kind: 'alert' as const,
    status: '',
  },
  {
    id: '3',
    text: 'New message from Agent Chidi about Lekki apartment',
    time: 'Yesterday',
    kind: 'message' as const,
    status: '',
  },
  {
    id: '4',
    text: 'Appointment confirmed for Saturday 11:00 AM',
    time: 'Yesterday',
    kind: 'appointment' as const,
    status: 'Confirmed',
  },
];

export const BUYER_MY_PROPERTIES = [
  {
    id: '1',
    title: '2 Bedroom Flat · Yaba',
    location: 'Yaba, Lagos',
    price: '₦2,800,000 / year',
    status: 'Active',
    tab: 'For Rent',
    beds: 2,
    baths: 2,
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=320&h=220&fit=crop',
  },
  {
    id: '2',
    title: '3 Bedroom Apartment · Lekki',
    location: 'Lekki Phase 1, Lagos',
    price: '₦95,000,000',
    status: 'Draft',
    tab: 'For Sale',
    beds: 3,
    baths: 3,
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=320&h=220&fit=crop',
  },
  {
    id: '3',
    title: 'Short Let Studio · VI',
    location: 'Victoria Island, Lagos',
    price: '₦75,000 / night',
    status: 'Active',
    tab: 'For Rent',
    beds: 1,
    baths: 1,
    thumb: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d936bb?w=320&h=220&fit=crop',
  },
];

export const BUYER_SAVED = BUYER_RECOMMENDED.map((p) => ({ ...p, saved: true }));

export const BUYER_ALERTS = [
  {
    id: '1',
    name: 'Lekki 3–4 bed under ₦150M',
    matches: 6,
    frequency: 'Daily',
    active: true,
  },
  {
    id: '2',
    name: 'Abuja short let · Gwarinpa',
    matches: 3,
    frequency: 'Instant',
    active: true,
  },
  {
    id: '3',
    name: 'Yaba / Surulere rentals',
    matches: 11,
    frequency: 'Weekly',
    active: false,
  },
];

export const BUYER_MESSAGES = [
  {
    id: '1',
    name: 'Agent Chidi',
    initials: 'AC',
    color: '#16a34a',
    snippet: 'The Lekki apartment is still available this weekend.',
    time: '12m',
    unread: 2,
  },
  {
    id: '2',
    name: 'PropertyArena Support',
    initials: 'PA',
    color: '#0f766e',
    snippet: 'Your verification documents were received.',
    time: '1h',
    unread: 0,
  },
  {
    id: '3',
    name: 'Ada Realtor',
    initials: 'AR',
    color: '#2563eb',
    snippet: 'Shall we schedule the Ikoyi viewing for Sunday?',
    time: 'Yesterday',
    unread: 0,
  },
];

export const BUYER_INQUIRIES = [
  {
    id: '1',
    property: '3 Bedroom Apartment · Lekki',
    date: '24 Sep 2026',
    status: 'Pending',
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&h=90&fit=crop',
  },
  {
    id: '2',
    property: 'Luxury Duplex · Ikoyi',
    date: '22 Sep 2026',
    status: 'Viewed',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=90&fit=crop',
  },
  {
    id: '3',
    property: 'Studio Short Let · VI',
    date: '18 Sep 2026',
    status: 'Closed',
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop',
  },
];

export const BUYER_APPOINTMENTS = [
  {
    id: '1',
    property: '3 Bedroom Apartment · Lekki',
    when: 'Sat 27 Sep · 11:00 AM',
    agent: 'Agent Chidi',
    status: 'Upcoming',
  },
  {
    id: '2',
    property: 'Luxury Duplex · Ikoyi',
    when: 'Sun 28 Sep · 2:00 PM',
    agent: 'Ada Realtor',
    status: 'Upcoming',
  },
  {
    id: '3',
    property: 'Terrace · Ajah',
    when: 'Fri 19 Sep · 10:00 AM',
    agent: 'Homes NG',
    status: 'Past',
  },
];

export const BUYER_REVIEWS = [
  {
    id: '1',
    property: 'Short Let Studio · VI',
    rating: 5,
    text: 'Clean apartment, smooth check-in, and the agent was responsive.',
    date: '12 Sep 2026',
  },
  {
    id: '2',
    property: '2 Bedroom Flat · Yaba',
    rating: 4,
    text: 'Good value for the area. Power was stable during our stay.',
    date: '02 Aug 2026',
  },
];

export const BUYER_PAYMENTS = [
  {
    id: '1',
    date: '01 Sep 2026',
    description: 'Featured listing boost',
    amount: '₦15,000',
    status: 'Completed',
  },
  {
    id: '2',
    date: '18 Aug 2026',
    description: 'Premium alerts (monthly)',
    amount: '₦5,000',
    status: 'Completed',
  },
  {
    id: '3',
    date: '10 Aug 2026',
    description: 'Inspection booking fee',
    amount: '₦2,500',
    status: 'Pending',
  },
];
