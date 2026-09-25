import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminHelp = () => (
  <AdminRecordBoard
    kind="help-faq"
    title="Help Center"
    note="Publish FAQ items for /help. Use status Published so they appear on the Help Center accordion. Question = title, Answer = body."
    fields={[
      { key: 'title', label: 'Question' },
      { key: 'slug', label: 'Slug (unique key)' },
      { key: 'category', label: 'Category', optional: true },
      { key: 'status', label: 'Status', options: ['Draft', 'Published'] },
      { key: 'body', label: 'Answer' },
    ]}
  />
);

export default AdminHelp;
