import React, { useEffect } from 'react'
import './Popup.css';
import { useState, useRef } from 'react'
import tick from '../../assets/img/tick.png'
import cross from '../../assets/img/cross.png'
import pdf from '../../assets/img/pdf.png'
import { pdfjs } from 'react-pdf';
import upload from '../../assets/img/upload.png'
import UseOutsideAlerter from '../Load/OutsideAlerter';

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
const FileUpload = ({ userData, indexerLoading, setUserData, setIndexerLoading, showFileSelectModal, setShowFileSelectModal, setStatus }) => {


    const [selectedFiles, setSelectedFiles] = useState({
        files: [],
        names: userData.indexed_files ? userData.indexed_files : []
    })
    const myDivRef = useRef(null);

    useEffect(() => {
        console.log(userData)
        console.log(selectedFiles)
        setSelectedFiles({
            ...selectedFiles, names: userData.indexed_files
        })
    }, [userData])
    const createTxtFile = (text, name) => {
        // const createTxtFile = (text) => {
        const blob = new Blob([text], { type: 'text/plain' });
        // const fileJson
        const fileName = name
        const lastModified = Date.now();
        const size = blob.size;
        const fileType = 'text/plain';
        const customFile = new File([blob], fileName, {
            type: fileType,
            lastModified: lastModified,
            size: size
        });

        return customFile;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        setStatus('Uploading...')
        if (file) {
            if (file.size / (1024 * 1024) > 10) {
                alert("File should not exceed 10MB");
                return;
            }

            const uploadedFiles = await handleFileUpload(file);
            console.log(uploadedFiles)
            // if (uploadedFiles) {
            //   setSelectedFiles(prevState => ({
            //     ...prevState,
            //     files: [...prevState.files, { name: file.name, size: file.size, deleted: false }],
            //     names: [...prevState.names, file.name],
            //   }));
            // }
        }
        // setSelectedFiles(file);
    };
    const readFileData = (file) => {
        return new Promise(async (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result);

                    const doc = await pdfjs.getDocument(buffer).promise;

                    const pages = doc?._pdfInfo?.numPages;


                    if (!pages) {
                        reject("Invalid File");
                        return;
                    }

                    let pdfContent = '';
                    const regex = /[\x01-\x08\x0E\x0F\x10-\x15\x17\xA1\xA3\xA5\xA9\xAA\xAB\xAF\xB1\xB4\xB7\xBA\xBB\xBF\xC0\xE9\xF1\xF9\x88\x8C\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F]/g;


                    for (let i = 0; i < pages; i++) {
                        const page = await doc.getPage(i + 1);
                        let textContent = await page.getTextContent();

                        textContent.items.forEach((item, index) => {
                            const cleanedString = item.str.replace(regex, '');
                            pdfContent += cleanedString;
                        });
                        pdfContent += "\n##################PDF-PAGES-SEPARATOR##################\n"
                    }
                    console.log(pdfContent)
                    resolve(pdfContent); // Resolve with the accumulated text content
                } catch (error) {
                    reject(error); // Reject in case of any errors
                }
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsArrayBuffer(file);
        });
    }
    const handleFileUpload = async (file) => {
        // Show the loader to prevent multiple submissions
        setIndexerLoading({
            ...indexerLoading,
            loading: true,
            status: "Uploading...(60%)",
            noIndex: false,
        });
        setShowFileSelectModal(false);

        try {
            // const pdfContent = await readFileData(file);
            const parts = file.name.split('.');
            const extension = parts.pop();
            const filename = parts.join('.') + "_" + extension;
            // const txtFile = createTxtFile(pdfContent, filename);
            let txtFile;

            if (extension === 'pdf') {
                const pdfContent = await readFileData(file);
                txtFile = createTxtFile(pdfContent, filename);
            } else {
                txtFile = createTxtFile(file, filename);
            }
            const my_data = {
                workspace_id: userData.workspace_id,
                chat_id: userData.chat_id,
                indexer_version: "V2",
            };

            // Convert data to FormData for API request
            const payload = new FormData();
            payload.append("workspace_id", my_data.workspace_id);
            payload.append("chat_id", my_data.chat_id);
            payload.append("indexer_version", my_data.indexer_version);
            payload.append("list_of_documents", JSON.stringify([filename]));
            payload.append(filename, txtFile);

            const response = await fetch('https://new-dev.opentune.ai/construct-index-extension/', {
                method: 'POST',
                body: payload,
                mode: "cors",
                headers: {
                    'X-API-key': userData.ApiKey,
                }
            });

            const uploadedFiles = await response.json();
            const apiResponse = handleApiResponse(uploadedFiles);

            // Set status to processing for 20 seconds
            // setStatus("processing...");
            setIndexerLoading({
                ...indexerLoading,
                loading: true,
                status: "Indexer Processing...",
                noIndex: false,
            });


            return apiResponse;

        } catch (error) {
            alert("Something went wrong while uploading your file.");
            console.log(error);
            resetFrontendState();

            return false;
        }
    };
    const handleFileDeletion = async (file) => {
        // Show the loader to prevent multiple submissions
        ;
        let fileList = []
        fileList.push(file);
        setShowFileSelectModal(false)
        const my_data = {
            "workspace_id": userData.workspace_id,
            "chat_id": userData.chat_id,
            "indexer_version": "V1",
            "list_of_documents": JSON.stringify(fileList)
        };

        try {
            const response = await fetch('https://new-dev.opentune.ai/delete-indexed-files-extension/', {
                method: 'POST',
                body: JSON.stringify(my_data),
                mode: "cors",
                headers: {
                    'X-API-key': userData.ApiKey,
                    "Content-Type": "application/json",
                }
            })

            const deletedFiles = await response.json();


            const apiRes = handleApiResponse(deletedFiles, "delete");
            // setStatus(`Files Added:${apiRes}`);
            return apiRes


        } catch (error) {
            alert("Something went wrong while uploading your file.");
            console.log(error)
            resetFrontendState();
            return false;
        }

    };


    const handleApiResponse = (response, state) => {
        console.log(response)
        const responseBody = response.body;

        if (responseBody && !responseBody.error_message) {
            if (responseBody.indexed_files) {
                const files = responseBody.indexed_files.map(file => ({
                    [file.file]: { name: file.file, size: file.size, deleted: false }
                }));
                setSelectedFiles({ files: files, names: responseBody.indexed_files });
                setUserData({ ...userData, "indexed_files": responseBody.indexed_files })
                if (state !== "delete") {
                    console.log("here");

                    // First timeout to update the state to "Completed"
                    setTimeout(() => {
                        setIndexerLoading({
                            fileLength: responseBody.indexed_files.length,
                            loading: true,
                            status: "Indexer Completed",
                            image: tick,
                            noIndex: responseBody.indexed_files.length == 0 ? true : false
                        });

                        // Second timeout to update the state to "Files Added"
                        setTimeout(() => {
                            setIndexerLoading({
                                fileLength: responseBody.indexed_files.length,
                                loading: false,
                                status: `${responseBody.indexed_files.length} Files Added `,
                                noIndex: responseBody.indexed_files.length == 0 ? true : false
                            });
                        }, 5000);
                    }, 5000);
                }

                else {
                    console.log("here", "del")
                    setIndexerLoading({
                        fileLength: responseBody.indexed_files.length,
                        loading: false,
                        status: `${responseBody.indexed_files.length} Files Added`,
                        noIndex: responseBody.indexed_files.length == 0 ? true : false
                    })
                }
            }


            return responseBody.indexed_files;
        } else {
            throw new Error("Error in API response");
        }
    };
    const resetFrontendState = () => {
        setSelectedFiles({ files: [], names: userData.indexed_files ? userData.indexed_files : [] });
        setIndexerLoading({
            fileLength: userData.indexed_files.length,
            loading: false,
            status: ` ${userData.indexed_files.length} Files Added`,
            noIndex: userData.indexed_files.length == 0 ? true : false
        })

    };

    const uploadOptions = [
        {
            name: "Device", value: 1, img: upload
        },]

    return (



        <div className="popupOverlay">

            {
                selectedFiles.names.length > 0 ?
                    <div className="popupContent" ref={myDivRef}>
                        {/* <OutsideAlerter ref={myDivRef} onClickOutside={handleClickOutside} /> */}
                        <div className='popupHeader'>
                            <p>Uploaded Files</p>
                            <div onClick={() => setShowFileSelectModal(false)}>
                                <img src={cross} alt="cross" />
                            </div>
                        </div>
                        <ul>
                            {selectedFiles.names.map((file, ind) => (
                                <li key={ind}>

                                    <img className="docImage" src={pdf} alt="doc" />


                                    <p>{file.file}</p>

                                    {!file.deleted && (
                                        <div className='crossImage' onClick={() => handleFileDeletion(file.file)} >
                                            <img src={cross} alt="delete" />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {/* </div> */}
                        <div className='uploadFileHeader'>


                            {/* <button onClick={() => setShowFileSelectModal(false)}>x</button> */}
                        </div>
                        <div className="file-input-containerN">
                            <input
                                type="file"
                                accept=".txt, .md, .py,.docx,.pdf,
                          .cpp,.csv"
                                id="file-input"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-input" className="actionButtonNP">

                                Upload more files
                            </label>
                        </div>



                    </div> : <div className="popupContent" ref={myDivRef}>
                        {/* <OutsideAlerter ref={myDivRef} onClickOutside={handleClickOutside} /> */}
                        <div className='popupHeader'>
                            <p>Uploaded Files</p>
                            <div onClick={() => setShowFileSelectModal(false)}>
                                <img src={cross} alt="cross" />
                            </div>
                        </div>
                        <div className="contentWrapper">
                            <div className="topSection">
                                <img src={upload} alt="centered" className="centeredImage" />
                            </div>
                            <div className="bottomSection">

                                <div className="file-input-container">
                                    <input
                                        type="file"
                                        accept=".txt, .md, .py,.docx,.pdf,
                          .cpp,.csv"
                                        id="file-input"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-input" className="actionButtonN">

                                        Upload Files
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>


    )
}

export default FileUpload