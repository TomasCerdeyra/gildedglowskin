export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#D79A9A] border-t-[#8B1E2D] animate-spin" />
        <span className="text-[#D79A9A] text-sm font-medium">Cargando...</span>
      </div>
    </div>
  );
}
