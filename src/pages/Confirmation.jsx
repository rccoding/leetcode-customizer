import React, { useRef } from 'react'
import './confirm'
import cross from '../assets/img/cross.png'
import pdf from '../assets/img/pdf.png'
import UseOutsideAlerter from './Load/OutsideAlerter'
const Confirmation = ({ setShowConfirm, filesize, userData, setMessageHistory }) => {
    const refi = useRef(null)
    const setEditF = (value) => {
        // if (resetPasswordPage.current) {
        //     return;
        // }

        if (value) {
        } else {
            setShowConfirm(false)
        }
    };
    UseOutsideAlerter(refi, setEditF, false);

    const clearChatHistory = () => {
        const payload = {

            "workspace_id": userData.workspace_id,
            "model_id": userData.selectedModel,
            "chat_id": userData.chat_id,
            "messages": "[]",
            "tags": "[]",
            "tokens_to_be_deleted": 0
        };
        fetch('https://new-dev.opentune.ai/update-chat-extension/', {
            method: 'POST',
            body: JSON.stringify(payload),
            mode: "cors",
            headers: {
                'X-API-key': userData.ApiKey,
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {

                setMessageHistory([]);
                handleFileDeletion()
                setShowConfirm(false)
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }
    const handleFileDeletion = async () => {
        // Show the loader to prevent multiple submissions
        ;
        let fileList = []
        userData.indexed_files.map((file, ind) => {
            fileList.push(file.file);
        })

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
            window.location.reload()

            const deletedFiles = await response.json();





        } catch (error) {
            alert("Something went wrong while uploading your file.");
            console.log(error)

            return false;
        }

    };
    return (
        <div className="popupOverlayC">
            <div className="popupContentC" ref={refi}>
                <div className='uploadFileHeader'>
                    <p className="popupTitle">Are you sure?</p>
                    <button className="closeButton" onClick={() => setShowConfirm(false)}>
                        <img src={cross} alt="close" />
                    </button>
                </div>
                <div>
                    <p className="warningText">All your chats and uploaded files will be deleted</p>

                    {userData?.indexed_files?.length ? <p className="warningText">Uploaded Files:</p> : null}
                    <div className="popupContentImages">
                        <ul>
                            {userData.indexed_files.map((file, ind) => (
                                <li key={ind}>

                                    <img className="docImage" src={pdf} alt="doc" />


                                    <p>{file.file}</p>


                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="popupActions">
                    <div className="actionButton cancelButton" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </div>
                    <div className="actionButton clearButton" onClick={clearChatHistory}>
                        Clear Data
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Confirmation