import { AdminRecordBoard } from '@/components/admin/AdminRecordBoard';

const AdminArticles = () => (
  <AdminRecordBoard
    kind="article"
    title="Articles & Guides"
    fields={[
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'excerpt', label: 'Excerpt', optional: true },
      { key: 'coverImage', label: 'Cover image URL', optional: true },
      { key: 'tag', label: 'Tag', optional: true },
      { key: 'readMinutes', label: 'Read time (minutes)', optional: true },
      { key: 'status', label: 'Status', options: ['Draft', 'Published'] },
      { key: 'body', label: 'Body' },
    ]}
  />
);

export default AdminArticles;
