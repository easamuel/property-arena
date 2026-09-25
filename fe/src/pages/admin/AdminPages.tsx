import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminPages = () => (
  <AdminRecordBoard
    kind="page"
    title="Pages"
    fields={[
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'status', label: 'Status', options: ['Draft', 'Published'] },
      { key: 'body', label: 'Body' },
    ]}
  />
);

export default AdminPages;
