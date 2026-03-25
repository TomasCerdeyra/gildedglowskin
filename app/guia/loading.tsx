export default function GuiaLoading() {
  return (
    <div className="min-h-screen bg-[#FFF9F9]">
      <div className="bg-[#D79A9A]/10 pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto text-center space-y-3 animate-pulse">
          <div className="h-4 bg-[#D79A9A]/30 rounded w-24 mx-auto" />
          <div className="h-10 bg-[#D79A9A]/20 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-80 mx-auto" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#D79A9A]/20 animate-pulse">
              <div className="aspect-video bg-[#D79A9A]/10" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
