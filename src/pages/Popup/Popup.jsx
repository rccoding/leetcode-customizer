import React, { useEffect } from 'react';
import { useState } from 'react';
import send from '../../assets/img/arrow_purple.png';
import attach from '../../assets/img/attachment.png';
import model from '../../assets/img/openai.png';
import openaiImage from '../../assets/img/openai.png';
import llamaImage from '../../assets/img/meta.png';
import tick from '../../assets/img/tick.png';
import geminiImage from '../../assets/img/gemini.png';
import claudeImage from '../../assets/img/anthropic.png';
import opentuneLogo from '../../assets/img/opentune_full_white.png';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { encode } from 'gpt-tokenizer';
import { chromeApi } from '../Background/index'
import Signup from '../Signup/Signup';
import { ModelSlection } from '../ModelSelection/ModelSlection';
import Loader from '../Loader/Loader';
import HoverBox from '../Menu/Menu';
import FileUpload from './FileUpload';
import Confirmation from '../Confirmation';
import PdfUploader from './PdfReader';
import PDFViewer from './PdfReader';
// import PDFParser, { PdfReader } from './PdfReader';


const Popup = () => {
  const [messageHistory, setMessageHistory] = useState([

  ])
  const [status, setStatus] = useState('Processing..');
  const [page, setPage] = useState("Signup")
  const [indexerLoading, setIndexerLoading] = useState(false)
  const [showFileSelectModal, setShowFileSelectModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [messagePrompt, setMessagePrompt] = useState("");
  const [isLoading, setIsLoading] = useState({ common: false });
  const [userData, setuserData] = useState({})
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Function to get localStorage data from content script
    function getLocalStorage() {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { getLocalStorage: true }, function (response) {
            if (response && response.localStorageData) {
              resolve(response.localStorageData);
            } else {
              resolve({});
            }
          });
        });
      });
    }

    // Function to update state with userData
    function updateStateWithUserData(userData) {
      setIsLoading({ common: false });
      setuserData({
        ApiKey: userData.user_data.workspaces[0]?.export_api_key
      });
    }

    // Function to fetch and store localStorage data from content script
    function fetchAndStoreUserData() {
      return getLocalStorage().then((localStorageData) => {
        const tokens = localStorageData.username;

        if (tokens) {
          let userData = tokens.split(":::")[0];
          userData = JSON.parse(userData);

          return new Promise((resolve, reject) => {
            // Store the retrieved user data in extension's local storage
            chrome.storage.local.set({ userData: userData }, function () {
              updateStateWithUserData(userData);
              resolve(userData);
            });
          });
        } else {
          // Handle the case where tokens are not available
          setIsLoading({ common: false });

          setuserData({});
          return Promise.resolve({});
        }
      });
    }

    // Function to retrieve user data from extension's local storage
    function retrieveUserDataFromExtensionStorage() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['userData'], function (result) {
          if (result.userData) {
            updateStateWithUserData(result.userData);
            resolve(result.userData);
          } else {
            console.log('No user data found in local storage');
            setIsLoading({ common: false });
            setuserData({});
            resolve({});
          }
        });
      });
    }


    // Function to check if the current tab is the main site
    function checkCurrentTab() {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs[0];
          const mainSiteUrl = 'https://dev.opentune.ai'; // Replace with the actual main site URL

          if (activeTab.url.startsWith(mainSiteUrl)) {
            // User is on the main site
            fetchAndStoreUserData().then(userData => resolve(userData));
          } else {
            // User is not on the main site
            retrieveUserDataFromExtensionStorage().then(userData => resolve(userData));
          }
        });
      });
    }

    // Use the retrieved userData for the next function
    checkCurrentTab().then(userData => {
      // Now you can use userData for the next function
      if (userData.user_data) {
        console.log(userData, "state getting set ppre get chat")
        fetchOldChat(userData.user_data.workspaces[0].export_api_key); // Replace this with your actual function
      }
    });

  }, []);
  useEffect(() => {
    // manageUpload()
  }, [status])


  useEffect(() => {
    scrollToBottomIfOverflow();
    let cleanup
  }, [messageHistory, indexerLoading])

  const getModels = async (apiKey, userSelectedModel) => {
    try {
      const response = await fetch('https://new-dev.opentune.ai/get-my-models/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-API-key': apiKey,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      const defaultModels = [];
      const customModels = [];
      let modelIndexed = false

      data.body.forEach((model) => {
        if (model.default) {
          if (model?._id.$oid === userSelectedModel) {
            modelIndexed = true;
          }
          defaultModels.push(model);
        } else {

          if (model?._id.$oid === userSelectedModel) {
            if (model.indexed === true) {
              modelIndexed = false;
            }
          }
          customModels.push(model);
        }
      });

      return {
        default: defaultModels,
        custom: customModels,
        isIndexed: modelIndexed,
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        default: [],
        custom: []
      };
    }
  };



  function scrollToBottomIfOverflow() {
    // Get the message container element
    const messageContainer = document.getElementById("messages-container");

    // Check if the message container exists
    if (messageContainer) {
      // Set the scrollTop property to the scrollHeight to scroll to the bottom
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }


  const fetchOldChat = async (apiKey) => {
    try {
      const response = await fetch('https://new-dev.opentune.ai/get-extension-chat/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-API-key': apiKey,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      const messages = data.body.messages;
      messages.forEach((message) => {
        setMessageHistory((prev) => [
          ...prev,
          { sender: 'user', text: message.user },
          { sender: 'model', text: message.model }
        ]);

        // Call the function to scroll to the bottom if there's an overflow
      });

      const userModels = await getModels(apiKey, data.body.model_id.$oid);
      console.log(userModels, "USER MODELS")

      setuserData((prev) => ({
        ...prev,
        chat_id: data.body._id.$oid,
        selectedModel: data.body.model_id.$oid,
        workspace_id: data.body.workspace_id.$oid,
        ApiKey: apiKey,
        modelImage: 'OpenAI',
        default: userModels.default,
        custom: userModels.custom,
        default_model: userModels.isIndexed,
        indexed_files: data.body.indexed_files ? data.body.indexed_files : []
      }));

      setIndexerLoading((prev) => ({
        ...prev,
        fileLength: data.body.indexed_files.length,
        status: `${data.body.indexed_files.length} Files Added`,
        noIndex: data.body.indexed_files.length === 0
      }));

      setIsLoading({ common: false }); // End loading
    } catch (error) {
      console.error('Error:', error);
      setIsLoading({ common: false }); // End loading even if there is an error
    }
  };
  console.log(userData, "state getting set post get chat")



  const computeGptMessages = (messages, maxTokens) => {
    let tempArray = [];
    let reverseArray = [];
    let tempTokenCount = maxTokens;

    for (let i = messages.length - 2; i >= 0; i--) {
      let usermessageLength = 0;
      let userdata = {};
      let modelmessageLength = 0;
      let modeldata = {};

      if (messages[i]["sender"] === "user") {
        userdata = { role: "user", content: messages[i]["text"] };
        usermessageLength = encode(JSON.stringify(userdata)).length || 0;
      }

      if (messages[i]["sender"] === "model") {
        modeldata = { role: "assistant", content: messages[i]["text"] };
        modelmessageLength = encode(JSON.stringify(modeldata)).length || 0;
      }

      const totalMessageLength = usermessageLength + modelmessageLength;

      if (totalMessageLength < tempTokenCount) {
        tempTokenCount -= totalMessageLength;

        if (messages[i]["sender"] === "user") {
          tempArray.push(userdata);
        }
        if (messages[i]["sender"] === "model") {
          tempArray.push(modeldata);
        }
      } else {
        break;
      }
    }

    // Reversing the array to pick the last messages in sequence
    for (let i = tempArray.length - 2; i >= 0; i -= 2) {
      reverseArray.push(tempArray[i]);
      reverseArray.push(tempArray[i + 1]);
    }

    // Adding the last user prompt
    reverseArray.push({ role: "user", content: messages[messages.length - 1]["text"] });

    console.log(reverseArray);
    return reverseArray;
  }

  const getAiResponse = () => {
    if (isLoading.common == true) {
      alert("message is still processing!")
      return
    }
    // setIsLoading(true); // Start loading
    setIsLoading({ common: true });
    setMessagePrompt("")
    let localMessageHistory = [...messageHistory];

    // Update the state to add a new user message
    setMessageHistory(prev => [...prev, { sender: "user", text: messagePrompt }]);
    // Update the local copy of messageHistory
    localMessageHistory = [...localMessageHistory, { sender: "user", text: messagePrompt }];
    let messagesArray = computeGptMessages(localMessageHistory, '500');
    console.log(messagesArray, "array of messages")
    const payload = {
      model_id: userData.selectedModel ? userData.selectedModel : "000000000000000000000001",
      //change default
      message_history: JSON.stringify(messagesArray),
      //message history function
      prompt: messagePrompt,
      max_tokens: 500,
      temperature: 0.3,
      top_p: "",
      stream: false,
      stop: "None",
      indexer: userData.indexed_files.length > 0 ? true : false,
      chat_id: userData.chat_id,
      extension: true
    };
    //send current chatid(always)
    //extention->true
    fetch('https://new-dev.opentune.ai/my-model-response-api/', {
      method: 'POST',
      body: JSON.stringify(payload),
      mode: "cors",
      headers: {
        'X-API-key': userData.ApiKey,
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then((data) => {
        if (data?.body?.response?.error) {
          // Handle the error
          console.error('Error in response:', data.body.response.error);
          alert(`Error: ${data.body.response.error}`);
        } else {
          // Handle the successful response
          setMessageHistory((prev) => [
            ...prev,
            { sender: 'model', text: data.body.response.content }
          ]);
        }
        setIsLoading({ common: false });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
        setIsLoading({ common: false });
      });
  }
  const modelImageMap = {
    "OpenAI": openaiImage,
    "Llama": llamaImage,
    "Claude": claudeImage,
    "Gemini": geminiImage
  };
  function getModelImage(modelName) {
    return modelImageMap[modelName] // Provide a default image path if the model name is not found
  }
  return (

    <div className="App">
      {
        page == "Signup" && userData.ApiKey == undefined ? <Signup setPage={setPage} userData={userData} /> :
          <> <header className="App-header">
            <img src={opentuneLogo} className="App-logo" alt="logo" />
            <div className='RightHeaderDiv'>
              <div className='ModelImageContainer' onClick={() => setPage("model")}>
                <img className="ModelImage" src={getModelImage(userData.modelImage) ? getModelImage(userData.modelImage) : model} alt="model" />
              </div>
              {
                page == "model" ? <ModelSlection setuserData={setuserData} userData={userData} setPage={setPage} /> : null
              }
              <HoverBox isOpen={isOpen} setIsOpen={setIsOpen} userData={userData} setMessageHistory={setMessageHistory} setShowConfirm={setShowConfirm} showConfirm={showConfirm} indexerLoading={indexerLoading} />
            </div>
          </header>
            <div className='OuterChatContainer'>
              <div className='OuterBelowContainer'>
                <div className='MessagesContainer' id="messages-container">
                  {
                    messageHistory.length > 0 && messageHistory.map((message, index) => (
                      <>
                        <div key={index} className={message.sender === 'user' ? 'modelResponse' : 'userMessage'}>

                          <p>{message.text}</p>
                        </div>
                        {
                          isLoading.common && index === messageHistory.length - 1 ? (
                            <div className='DotFlashing'>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          ) : null
                        }

                      </>
                    ))}
                </div>
                {/* {
                  indexerLoading.loading ? <div className='IndexerProcess'>
                    {status}
                  </div> : indexerLoading.fileLength > 0 ? <div className='IndexerProcess'>
                    {indexerLoading.fileLength} Files Added
                  </div> : ''
                } */}
                {
                  indexerLoading.noIndex ? null : <div className='IndexerProcess'>
                    {indexerLoading.image && <img src={indexerLoading.image} alt="status" />}

                    {indexerLoading.status}
                  </div>
                }
                {/* <div className='IndexerProcess'>
                
                  {indexerLoading.status}
                </div> */}
                <div className='OuterChatInput'>
                  <input
                    onChange={(e) => setMessagePrompt(e.target.value)}
                    className='ChatInput'
                    placeholder='Chat with Opentune'
                    value={messagePrompt}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        getAiResponse()
                      }
                    }}
                  />
                  <div className='attachmentContainer' >
                    {
                      userData?.default_model ? (

                        <img className="ModelImage" src={attach} alt="attach" style={{ cursor: 'pointer' }} onClick={() => setShowFileSelectModal(true)} />

                      ) : null
                    }
                    {
                      showFileSelectModal && <FileUpload userData={userData} indexerLoading={indexerLoading} setIndexerLoading={setIndexerLoading} setShowFileSelectModal={setShowFileSelectModal} setUserData={setuserData} setStatus={setStatus} />
                    }


                    {/* <img className="ModelImage" src={attach} alt="attach" /> */}
                    <img onClick={getAiResponse} className="ModelImage" src={send} alt="send" />
                  </div>
                </div>
                {isLoading.common &&
                  <div className='LoaderPosition'>
                    <Loader /></div>}


              </div>
            </div></>
      }
      <div className='DisclaimerContainer'>
        <p>2024 - Powered by Opentune</p>
      </div>
    </div>
  );
};

export default Popup;
