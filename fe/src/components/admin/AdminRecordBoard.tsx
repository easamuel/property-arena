import { FormEvent, useEffect, useState } from 'react';
import { ADMIN_SERVICE } from '@/services/admin';

type Field = { key: string; label: string; options?: string[]; optional?: boolean };

type Row = { id?: string; _id?: string; data?: Record<string, string> };

export function AdminRecordBoard({
  kind,
  title,
  fields,
  note,
}: {
  kind: string;
  title: string;
  fields: Field[];
  note?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const load = () => {
    ADMIN_SERVICE.listRecords(kind)
      .then((res) => setRows((res as { data?: Row[] }).data || []))
      .catch((err: Error) => setError(err.message || 'Sign in as admin to manage this list'));
  };

  useEffect(() => {
    load();
  }, [kind]);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await ADMIN_SERVICE.createRecord(kind, form);
      setForm({});
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    }
  };

  const setStatus = async (row: Row, status: string) => {
    const id = row.id || row._id || '';
    try {
      await ADMIN_SERVICE.updateRecord(kind, id, { ...(row.data || {}), status });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update');
    }
  };

  const remove = async (row: Row) => {
    const id = row.id || row._id || '';
    try {
      await ADMIN_SERVICE.deleteRecord(kind, id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {note && <p className="text-sm text-gray-600">{note}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={onCreate} className="grid gap-2 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        {fields.map((field) =>
          field.options ? (
            <select
              key={field.key}
              className="rounded border px-3 py-2 text-sm"
              value={form[field.key] || field.options[0]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            >
              {field.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              key={field.key}
              required={!field.optional && field.key !== 'notes'}
              placeholder={field.label}
              className="rounded border px-3 py-2 text-sm"
              value={form[field.key] || ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          ),
        )}
        <button type="submit" className="rounded bg-admin-red px-4 py-2 text-sm font-semibold text-white">
          Add
        </button>
      </form>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {fields.map((field) => (
                <th key={field.key} className="px-4 py-3">{field.label}</th>
              ))}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const data = row.data || {};
              return (
                <tr key={row.id || row._id} className="border-t">
                  {fields.map((field) => (
                    <td key={field.key} className="px-4 py-3">{String(data[field.key] ?? '—')}</td>
                  ))}
                  <td className="px-4 py-3">
                    {data.status ? (
                      <button type="button" className="mr-3 text-xs font-semibold text-admin-red" onClick={() => setStatus(row, data.status === 'New' ? 'Contacted' : 'Converted')}>
                        Advance
                      </button>
                    ) : null}
                    <button type="button" className="text-xs font-semibold text-gray-500" onClick={() => remove(row)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={fields.length + 1} className="px-4 py-8 text-center text-gray-500">
                  Nothing saved yet. Add a record above. It is stored in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
