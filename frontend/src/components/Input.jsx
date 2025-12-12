export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-200">{label}</label>

      <input
        {...props}
        className={`
          w-full px-4 py-2 
          rounded-xl 
          bg-white/10 
          text-white 
          placeholder-gray-400
          border border-white/20 
          focus:border-indigo-400 
          focus:ring-2 focus:ring-indigo-400/30 
          outline-none 
          transition
        `}
      />
    </div>
  );
}
