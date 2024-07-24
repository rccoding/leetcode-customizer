// PDFViewer.jsx
import React, { useState, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { pdfjs } from 'react-pdf';

// Set the workerSrc to the correct path

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`

const PDFViewer = () => {
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const fileInputRef = useRef(null);
    console.log(pdfjs.version)


    return (
        <div>
            <h1>PDF Viewer with Text Logging</h1>
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={(e) => readFileData(e.target.files[0])}
            />

        </div>
    );
};

export default PDFViewer;
