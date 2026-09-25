import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminLeads = () => (
  <AdminRecordBoard
    kind="lead"
    title="Leads & Enquiries"
    fields={[
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'property', label: 'Property' },
      { key: 'source', label: 'Source', options: ['Website', 'WhatsApp', 'Call', 'Property request'] },
      { key: 'status', label: 'Status', options: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'] },
    ]}
  />
);

export default AdminLeads;
