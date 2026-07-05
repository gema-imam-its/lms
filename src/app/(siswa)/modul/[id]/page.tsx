export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Modul</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Modul 1
            </h2>
            <p className="text-gray-600 mb-4">
              Deskripsi singkat tentang Modul 1.
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Pelajari lebih lanjut
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Modul 2
            </h2>
            <p className="text-gray-600 mb-4">
              Deskripsi singkat tentang Modul 2.
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Pelajari lebih lanjut
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Modul 3
            </h2>
            <p className="text-gray-600 mb-4">
              Deskripsi singkat tentang Modul 3.
            </p>
            <a href="#" className="text-blue-500 hover:underline">
              Pelajari lebih lanjut
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
