import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';
import { AD_PLACEMENT_VALUES } from '@/lib/ad-placements';

const AdminPromotions = () => (
  <AdminRecordBoard
    kind="promotion"
    title="Promotions & Ads"
    note="Set Status to Active. Choose Placement to control which page/section shows the creative (homepage, search, listing, requests, guides, footer)."
    fields={[
      { key: 'campaign', label: 'Campaign / Title' },
      { key: 'title', label: 'Display title' },
      {
        key: 'placement',
        label: 'Placement (page/section)',
        options: [...AD_PLACEMENT_VALUES],
      },
      { key: 'imageUrl', label: 'Image URL (use real property photos)' },
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
