export const WS_STATS = [
  { key: 'listings', label: 'Your Listings', value: '8', hint: 'Active properties', trend: '+2 ↑' },
  { key: 'requests', label: 'Buyer Requests', value: '14', hint: 'New requests', trend: '+5 ↑' },
  { key: 'messages', label: 'Messages', value: '5', hint: 'Unread messages', trend: '' },
  { key: 'leads', label: 'Leads & Enquiries', value: '12', hint: 'New enquiries', trend: '+3 ↑' },
  { key: 'bookings', label: 'Bookings & Inspections', value: '6', hint: 'This month', trend: '+2 ↑' },
];

export const WS_PERFORMANCE = [
  { day: 'Sep 17', views: 28, enquiries: 6 },
  { day: 'Sep 18', views: 42, enquiries: 10 },
  { day: 'Sep 19', views: 35, enquiries: 8 },
  { day: 'Sep 20', views: 58, enquiries: 14 },
  { day: 'Sep 21', views: 49, enquiries: 11 },
  { day: 'Sep 22', views: 72, enquiries: 18 },
  { day: 'Sep 23', views: 64, enquiries: 15 },
];

export const WS_MESSAGES = [
  {
    id: '1',
    name: 'Adaobi Okeke',
    initials: 'AO',
    color: '#0f766e',
    snippet: 'Is the Lekki duplex still available for viewing this weekend?',
    time: '12m',
    unread: 2,
    property: '4 Bedroom Duplex · Lekki',
  },
  {
    id: '2',
    name: 'Tunde Bakare',
    initials: 'TB',
    color: '#1d4ed8',
    snippet: 'Please send the survey plan for the Magodo land.',
    time: '1h',
    unread: 1,
    property: '450sqm Land · Magodo',
  },
  {
    id: '3',
    name: 'Chioma Eze',
    initials: 'CE',
    color: '#7c3aed',
    snippet: 'We can do ₦95M if papers are clean.',
    time: '3h',
    unread: 0,
    property: '3 Bedroom Apartment · Ikeja',
  },
  {
    id: '4',
    name: 'Ibrahim Musa',
    initials: 'IM',
    color: '#b45309',
    snippet: 'Confirming Saturday 11am inspection.',
    time: 'Yesterday',
    unread: 0,
    property: 'Short Let Flat · VI',
  },
];

export const WS_ENQUIRIES = [
  {
    id: '1',
    property: '3 Bedroom Apartment',
    location: 'Lekki Phase 1',
    contact: 'Ngozi A.',
    time: '20m ago',
    status: 'New',
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&h=90&fit=crop',
  },
  {
    id: '2',
    property: 'Detached Duplex',
    location: 'Banana Island',
    contact: 'Femi O.',
    time: '2h ago',
    status: 'Contacted',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=90&fit=crop',
  },
  {
    id: '3',
    property: 'Serviced Flat',
    location: 'Ikoyi',
    contact: 'Sarah K.',
    time: '5h ago',
    status: 'Interested',
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop',
  },
  {
    id: '4',
    property: 'Corner Plot',
    location: 'Abuja · Gwarinpa',
    contact: 'Yakubu M.',
    time: '1d ago',
    status: 'Follow up',
    thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=90&fit=crop',
  },
];

export const WS_LISTINGS = [
  {
    id: '1',
    title: '3 Bedroom Apartment',
    location: 'Lekki, Lagos',
    type: 'Apartment',
    price: 120000000,
    status: 'Active',
    views: 248,
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop',
  },
  {
    id: '2',
    title: '4 Bedroom Duplex',
    location: 'Ikoyi, Lagos',
    type: 'Duplex',
    price: 350000000,
    status: 'Active',
    views: 186,
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=280&fit=crop',
  },
  {
    id: '3',
    title: 'Serviced Studio Short Let',
    location: 'Victoria Island',
    type: 'Short Let',
    price: 85000,
    status: 'Pending',
    views: 92,
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=280&fit=crop',
  },
  {
    id: '4',
    title: '450sqm Residential Land',
    location: 'Magodo, Lagos',
    type: 'Land',
    price: 95000000,
    status: 'Active',
    views: 311,
    thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop',
  },
];

export const WS_BUYER_REQUESTS = [
  {
    id: '1',
    client: 'Amaka Nwosu',
    property: '4 Bed Duplex',
    location: 'Lekki / Ajah',
    budget: '₦100M – ₦150M',
    date: '24 Sep 2026',
    status: 'New',
  },
  {
    id: '2',
    client: 'Daniel Ade',
    property: '2 Bed Flat',
    location: 'Yaba, Lagos',
    budget: '₦2.5M – ₦3.5M /yr',
    date: '23 Sep 2026',
    status: 'In-Progress',
  },
  {
    id: '3',
    client: 'Halima Bello',
    property: 'Land 500sqm+',
    location: 'Abuja · Jahi',
    budget: '₦40M – ₦60M',
    date: '22 Sep 2026',
    status: 'New',
  },
  {
    id: '4',
    client: 'Kelechi Okoro',
    property: 'Short Let 3 Bed',
    location: 'VI / Ikoyi',
    budget: '₦150k – ₦250k /night',
    date: '20 Sep 2026',
    status: 'Closed',
  },
];

export const WS_LEADS = [
  {
    id: '1',
    name: 'Blessing Uche',
    property: '3 Bedroom Apartment · Lekki',
    source: 'Website',
    date: '26 Sep 2026',
    status: 'New',
  },
  {
    id: '2',
    name: 'Oscar Mensah',
    property: '4 Bedroom Duplex · Ikoyi',
    source: 'WhatsApp',
    date: '25 Sep 2026',
    status: 'Contacted',
  },
  {
    id: '3',
    name: 'Rita Johnson',
    property: 'Serviced Flat · VI',
    source: 'Property request',
    date: '24 Sep 2026',
    status: 'Converted',
  },
  {
    id: '4',
    name: 'Emeka Obi',
    property: 'Land · Magodo',
    source: 'Call',
    date: '23 Sep 2026',
    status: 'Contacted',
  },
];

export const WS_BOOKINGS = [
  {
    id: '1',
    property: '3 Bedroom Apartment',
    location: 'Lekki Phase 1',
    client: 'Adaobi Okeke',
    when: 'Sat 27 Sep · 11:00 AM',
    status: 'Confirmed',
  },
  {
    id: '2',
    property: '4 Bedroom Duplex',
    location: 'Ikoyi',
    client: 'Tunde Bakare',
    when: 'Sun 28 Sep · 2:00 PM',
    status: 'Pending',
  },
  {
    id: '3',
    property: 'Corner Plot',
    location: 'Gwarinpa, Abuja',
    client: 'Yakubu Musa',
    when: 'Tue 30 Sep · 10:30 AM',
    status: 'Confirmed',
  },
];

export const WS_DEALS = [
  {
    id: '1',
    property: '3 Bedroom Apartment · Lekki',
    client: 'Ngozi Adebayo',
    value: 118000000,
    status: 'Negotiating',
    date: '25 Sep 2026',
  },
  {
    id: '2',
    property: '450sqm Land · Magodo',
    client: 'Ibrahim Musa',
    value: 92000000,
    status: 'In-Progress',
    date: '22 Sep 2026',
  },
  {
    id: '3',
    property: 'Serviced Flat · VI',
    client: 'Chioma Eze',
    value: 45000000,
    status: 'Closed',
    date: '18 Sep 2026',
  },
];

export const WS_BILLING = [
  {
    id: '1',
    date: '01 Sep 2026',
    description: 'Professional Plan · Monthly',
    amount: 25000,
    status: 'Paid',
  },
  {
    id: '2',
    date: '01 Aug 2026',
    description: 'Professional Plan · Monthly',
    amount: 25000,
    status: 'Paid',
  },
  {
    id: '3',
    date: '01 Jul 2026',
    description: 'Basic Plan · Monthly',
    amount: 10000,
    status: 'Paid',
  },
];

export const WS_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New enquiry on Lekki Apartment',
    body: 'Blessing Uche asked about viewing availability.',
    time: '18m ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Inspection confirmed',
    body: 'Adaobi Okeke confirmed Saturday 11:00 AM.',
    time: '2h ago',
    unread: true,
  },
  {
    id: '3',
    title: 'Subscription renews in 5 days',
    body: 'Professional plan renews on 1 Oct 2026.',
    time: '1d ago',
    unread: true,
  },
  {
    id: '4',
    title: 'Listing approved',
    body: 'Your Magodo land listing is now live.',
    time: '2d ago',
    unread: false,
  },
];

export const WS_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    monthly: 10000,
    yearly: 100000,
    features: ['5 active listings', 'Standard placement', 'Email support', 'Basic analytics'],
  },
  {
    id: 'pro',
    name: 'Professional',
    monthly: 25000,
    yearly: 250000,
    popular: true,
    features: [
      '25 active listings',
      'Featured slots',
      'Lead access',
      'Priority support',
      'Performance reports',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthly: 50000,
    yearly: 500000,
    features: [
      'Unlimited listings',
      'Max featured slots',
      'Team seats',
      'Dedicated support',
      'Advanced analytics',
    ],
  },
];

export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}
