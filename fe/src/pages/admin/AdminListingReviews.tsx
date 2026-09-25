import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminListingReviews = () => (
  <AdminRecordBoard
    kind="listing-review"
    title="Listing Reviews"
    note="Buyer/renter reviews submitted on property pages. Status Published shows on the public listing."
    fields={[
      { key: 'propertyId', label: 'Property ID' },
      { key: 'propertyTitle', label: 'Listing title', optional: true },
      { key: 'rating', label: 'Rating (1-5)' },
      { key: 'name', label: 'Reviewer name', optional: true },
      { key: 'status', label: 'Status', options: ['Published', 'Hidden', 'Draft'] },
      { key: 'body', label: 'Review text' },
    ]}
  />
);

export default AdminListingReviews;
