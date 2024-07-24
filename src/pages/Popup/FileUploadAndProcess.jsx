// import React from 'react'

// const FileUploadAndProcess = () => {
//     const handleSelectedFiles = async (PL,modelId, _config) => {
       
        
//         if (PL?.upload?.length) {
        
//           props.setIndexerLoader(true)
//           indexerLoaderHandler()
//           const my_data = {
//             workspace_id: props.workSpaceId,
//             model_id: modelId,
//              "indexer_version":currModel.indexer_version!=null ? currModel.indexer_version :"V1",
//           };
//           // console.log(my_data,"indexing model")
//           const listOfFileNames = [];

//           PL.upload.forEach((file, index) => {
            
//             listOfFileNames.push(file.name);
//             my_data[file.name] = file.file;
//           });
      
//           my_data['list_of_documents'] = JSON.stringify(listOfFileNames);
//           // console.log("creating indexer")
//           const payload = jsonToFormData(my_data);
//           const uploadedFiles = await postRequest("construct-index/", payload, _config);
//           if (!uploadedFiles.data?.body?.error_message) {
//             setSelectedFiles({ files: [], names: uploadedFiles.data.body.indexed_files });
//             setSelectDel({...selectDel,upload:[]});
//             if(uploadedFiles.data.body.indexed_files){
//                 let files=[];
//                 uploadedFiles.data.body.indexed_files.map((file,ind)=>{
                    
//                     let new_W={
//                         [file.file]:{ name:file.file,
//                             size:file.size,'deleted':false}
//                     }
//                   files.push(new_W)
                
//                 })
//                 setegSelectedFiles(files)
//             }
            
//             props.setPageLoader(false);
//             props.setIndexerLoader(false)
//             if(uploadedFiles.data.body?.indexed_status==="processing"){
//               props.setIndexerLoader(true)

//               indexerLoaderHandler("update")
//             }
//             return uploadedFiles.data.body.indexed_files
//           } else {
//             handleRemove(" Something went wrong while uploading your file.", null, false, props.setPageLoader, false, false , true);
//             setSelectedFiles({ files: [], names: currModel.indexed_files ? currModel.indexed_files : [] });
//             let files=[];
//             if(currModel.indexed_files){
                
//                 currModel.indexed_files.map((file,ind)=>{
                    
//                     let new_W={
//                         [file.file]:{ name:file.file,
//                             size:file.size,'deleted':false}
//                     }
//                   files.push(new_W)
                
//                 })
                
//             }
//             setegSelectedFiles(files)
//             setSelectDel({...selectDel,upload:[]});
            
//             // setegSelectedFiles(currModel.indexed_files ? currModel.indexed_files : [])
//             props.setPageLoader(false);
//             return false
//           }
      
          
//         }
//       };
     
//       const getCurrentModelPayload = async (datasetChange, model_id,_config ,update) => {

//         try {

//         let currentModelPayload = {};
//         if(modelType == "OPENAI"){
//             if (!currModel.chatgpt_model && currModel.dataset_id !== "") {
           
//                 let DatasetFileId;

//                 currentModelPayload = {
//                     "name": currModel.name,
//                     "description": currModel.description,
//                     "tags": "[]",
//                     ...(model_id ? { "model_id": model_id } : {}),
//                     "dataset_id": currModel.dataset_id?.$oid ? currModel.dataset_id.$oid : currModel.dataset_id,//datasetChange ? currModel.dataset_id : currModel.dataset_id,
//                     "workspace_id": props.workSpaceId,
//                     "chatgpt_model": false,
//                     "model_version": "",
//                     "model_type": modelType
//                 };
//             } else {
//                 currentModelPayload = {
//                     "name": currModel.name,
//                     "description": currModel.description,
//                     "tags": "[]",
//                     ...(model_id ? { "model_id": model_id } : {}),
//                     "dataset_id": "",
      
//                     "workspace_id": props.workSpaceId,
//                     "chatgpt_model": currModel.chatgpt_model_type ? currModel.chatgpt_model_type : "3",
//                     "model_version": currModel.chatgpt_model_type ? currModel.chatgpt_model_type : "3",
//                     "model_type": modelType
//                 };
//                 setCurrModel({ ...currModel, "dataset_id": "" });
//             }
//          }else if(modelType == "LLAMA"){
//             currentModelPayload = {
//                 "name": currModel.name,
//                 "description": currModel.description,
//                 "tags": "[]",
//                 ...(model_id ? { "model_id": model_id } : {}),
//                 "dataset_id": "",
//                 "indexer_version":currModel.indexer_version,
//                 "workspace_id": props.workSpaceId,
//                 "model_version": "70B",
//                 "model_type": modelType
//             };
//             setCurrModel({ ...currModel, "dataset_id": "" });
//         }
//         else if(modelType==="CLAUDE"){
//           currentModelPayload={
//             "name": currModel.name,
//             "description": currModel.description,
//             "tags": "[]",
//             ...(model_id ? { "model_id": model_id } : {}),
//             "dataset_id": "",
//             "workspace_id": props.workSpaceId,
//             "model_version": currModel.model_version,
//             "model_type": modelType
//           }
//           setCurrModel({ ...currModel, "dataset_id": "" });
//         }
//         else if(modelType==="GEMINI"){
//           currentModelPayload={
//             "name": currModel.name,
//             "description": currModel.description,
//             "tags": "[]",
//             ...(model_id ? { "model_id": model_id } : {}),
//             "dataset_id": "",
//             "workspace_id": props.workSpaceId,
//             "model_version": currModel.model_version,
//             "model_type": modelType
//           }
//           setCurrModel({ ...currModel, "dataset_id": "" });
//         }

//         return currentModelPayload;
//     }catch (error) {
//         // Handle any errors that might occur during the promise resolution.
//         alert("Error occurred:", error);
//       }
//       };
//   return (
//     <div>FileUploadAndProcess</div>
//   )
// }

// export default FileUploadAndProcess