import CreateProperty from '@/pages/create-property/CreateProperty';

/** Reuse the existing multi-step listing form inside the workspace shell. */
export default function WorkspacePostProperty() {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/5 bg-white shadow-[0_12px_40px_-28px_rgba(11,47,36,0.45)]">
      <CreateProperty />
    </div>
  );
}
