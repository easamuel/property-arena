const AdminComingSoon = ({ title }: { title: string }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-gray-500">
      This section is wired in the navigation. Connect API endpoints to replace this placeholder with live data.
    </p>
  </div>
);

export default AdminComingSoon;
