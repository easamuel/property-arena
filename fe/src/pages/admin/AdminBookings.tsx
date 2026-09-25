import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminBookings = () => (
  <AdminRecordBoard
    kind="booking"
    title="Bookings & Inspections"
    fields={[
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'property', label: 'Property' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status', options: ['Requested', 'Scheduled', 'Completed', 'Cancelled'] },
    ]}
  />
);

export default AdminBookings;
