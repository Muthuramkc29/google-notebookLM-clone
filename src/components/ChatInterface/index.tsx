import type { Message } from "../../App";

export default function ChatInterface({
  sendQuery,
  setQuery,
  value,
  messages,
  goToPage,
}: {
  value: string;
  setQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendQuery: (e: React.FormEvent) => void;
  messages: Array<Message>;
  goToPage: (page: number) => void;
}) {
  return (
    <div
      className="h-screen border-r border-gray-200 overflow-hidden relative"
      style={{ width: "50%" }}
    >
      <button
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10 group"
        title="Upload new PDF"
      >
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
          className="lucide lucide-x w-5 h-5 text-gray-600"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Upload new PDF
        </span>
      </button>
      <div className="flex flex-col h-full relative">
        {false && (
          <div className="bg-red-50 p-4 flex items-center gap-2 border-b border-red-100">
            <span className="text-red-700">Network error occurred</span>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Messages will go here */}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.from}`}>
              <div className="message-text">{m.text}</div>
              {m.citations?.map((c, idx) => (
                <button
                  key={idx}
                  className="citation"
                  onClick={() => goToPage(c.page)}
                >
                  page {c.page}
                </button>
              ))}
            </div>
          ))}
        </div>
        <form className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about the document..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={value}
              onChange={setQuery}
            />
            <button
              type="submit"
              onClick={sendQuery}
              className="p-2 bg-purple-600 text-white rounded-lg transition-colors"
              disabled={!value.trim()}
            >
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
                className="lucide lucide-send w-5 h-5"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
