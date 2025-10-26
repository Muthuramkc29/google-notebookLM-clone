import React, { useRef, useState } from "react";
import "./App.css";
import { pdfjs } from "react-pdf";
import UploadPdf from "./components/UploadPdf";
import ChatInterface from "./components/ChatInterface";
import PdfViewer from "./components/PdfViewer";

// set workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export type Message = {
  from: "user" | "bot";
  text: string;
  citations?: { page: number }[];
};

function App() {
  const [docId, setDocId] = useState<string | null>(null);
  // const [fileName, setFileName] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const viewerRef = useRef<HTMLDivElement | null>(null);

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (data.id) {
      setDocId(data.id);
      // setFileName(data.filename);
      setPageCount(data.pageCount);
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: `Uploaded ${data.filename} — ${data.pageCount} pages`,
        },
      ]);
    } else {
      setMessages((m) => [...m, { from: "bot", text: "Upload failed" }]);
    }
  }

  async function sendQuery() {
    if (!docId || !query.trim()) return;
    const userMsg: Message = { from: "user", text: query };
    setMessages((m) => [...m, userMsg]);
    setQuery("");
    const res = await fetch("http://localhost:4000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: docId, query: userMsg.text }),
    });
    const data = await res.json();
    const botMsg: Message = {
      from: "bot",
      text: data.answer || "No answer",
      citations: data.citations,
    };
    setMessages((m) => [...m, botMsg]);
  }

  function goToPage(page: number) {
    // try to find canvas element rendered by react-pdf for a page
    const el = document.querySelector(`#pdf-page-${page}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <>
      {docId ? (
        <div className="min-h-screen bg-gray-100">
          <div className="h-screen flex relative gap-16" id="split-container">
            <ChatInterface
              messages={messages}
              goToPage={goToPage}
              value={query}
              setQuery={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              sendQuery={sendQuery}
            />
            <PdfViewer docId={docId} pageCount={pageCount} />
          </div>
        </div>
      ) : (
        <UploadPdf onChange={uploadFile} />
      )}
    </>
  );
}

export default App;

// <div className="app-root">
//   <header className="app-header">
//     <h2>NotebookLM Clone (Prototype)</h2>
//     <div>
//       <input type="file" accept="application/pdf" onChange={uploadFile} />
//       {fileName ? <div className="uploaded-name">{fileName}</div> : null}
//     </div>
//   </header>

//   <main className="app-main">
//     <section className="viewer" ref={viewerRef}>
//       {docId ? (
//         <div style={{ height: "100%", overflow: "auto" }}>
//           <Document
//             file={`http://localhost:4000/file/${docId}`}
//             onLoadSuccess={() => {}}
//           >
//             {Array.from({ length: pageCount }, (_, i) => (
//               <div id={`pdf-page-${i + 1}`} key={i} style={{ padding: 8 }}>
//                 <Page pageNumber={i + 1} width={600} />
//               </div>
//             ))}
//           </Document>
//         </div>
//       ) : (
//         <div className="viewer-placeholder">
//           Upload a PDF to view pages here
//         </div>
//       )}
//     </section>

//     <section className="chat">
//       <div className="messages">
//         {messages.map((m, i) => (
//           <div key={i} className={`message ${m.from}`}>
//             <div className="message-text">{m.text}</div>
//             {m.citations?.map((c, idx) => (
//               <button
//                 key={idx}
//                 className="citation"
//                 onClick={() => goToPage(c.page)}
//               >
//                 page {c.page}
//               </button>
//             ))}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Ask about the PDF..."
//         />
//         <button onClick={sendQuery}>Send</button>
//       </div>
//     </section>
//   </main>
// </div>
// <UploadPdf />
