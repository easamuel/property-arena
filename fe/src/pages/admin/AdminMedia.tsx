import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminMedia = () => (
  <AdminRecordBoard
    kind="media"
    title="Media library"
    fields={[
      { key: 'name', label: 'File name' },
      { key: 'url', label: 'URL' },
      { key: 'type', label: 'Type', options: ['Image', 'Video', 'Document'] },
    ]}
  />
);

export default AdminMedia;
