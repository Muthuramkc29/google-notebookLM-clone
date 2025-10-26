export default function UploadPdf({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen flex items-center justify-center">
        <label className="relative flex flex-col items-center gap-6 p-12 bg-white rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 transition-colors ">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload w-8 h-8 text-purple-600"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1={12} x2={12} y1={3} y2={15} />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Upload PDF to start chatting
            </h2>
            <p className="text-gray-500">
              Click or drag and drop your file here
            </p>
          </div>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}
