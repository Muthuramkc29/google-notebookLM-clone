import { Document, Page } from "react-pdf";

export default function PdfViewer({
  docId,
  pageCount,
}: {
  docId: string | null;
  pageCount: number;
}) {
  return (
    <div className="h-screen overflow-hidden" style={{ width: "50%" }}>
      <div className="h-full overflow-y-auto bg-gray-50">
        <Document
          file={`http://localhost:4000/file/${docId}`}
          onLoadSuccess={() => {}}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <div key={i} className="mb-4 shadow-lg bg-white relative">
              <Page pageNumber={i + 1} renderAnnotationLayer={false} />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
