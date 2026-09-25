import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminListingReports = () => (
  <AdminRecordBoard
    kind="listing-report"
    title="Listing Reports"
    note="Abuse and scam flags from property pages. Triage with status: New → Reviewed → Actioned."
    fields={[
      { key: 'propertyId', label: 'Property ID' },
      { key: 'propertyTitle', label: 'Listing title', optional: true },
      { key: 'location', label: 'Location', optional: true },
      { key: 'reason', label: 'Reason' },
      { key: 'email', label: 'Reporter email', optional: true },
      { key: 'status', label: 'Status', options: ['New', 'Reviewed', 'Actioned'] },
      { key: 'body', label: 'Details' },
    ]}
  />
);

export default AdminListingReports;
