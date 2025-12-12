export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />
    </div>
  );
}
