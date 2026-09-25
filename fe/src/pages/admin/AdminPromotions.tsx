import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminPromotions = () => (
  <AdminRecordBoard
    kind="promotion"
    title="Promotions & Ads"
    note="Set Status to Active (or published) for ads to show on the public site. Match Placement to AdSlot names."
    fields={[
      { key: 'campaign', label: 'Campaign / Title' },
      { key: 'title', label: 'Display title' },
      {
        key: 'placement',
        label: 'Placement',
        options: [
          'homepage_sidebar',
          'homepage_banner',
          'listing_sidebar',
          'search_sidebar',
        ],
      },
      { key: 'imageUrl', label: 'Image URL' },
      { key: 'href', label: 'Link (path or URL)' },
      { key: 'ctaUrl', label: 'CTA URL (optional)' },
      { key: 'ctaLabel', label: 'CTA label (optional)' },
      { key: 'body', label: 'Short copy' },
      { key: 'budget', label: 'Budget' },
      { key: 'status', label: 'Status', options: ['Draft', 'Active', 'Scheduled', 'Completed'] },
    ]}
  />
);

export default AdminPromotions;
