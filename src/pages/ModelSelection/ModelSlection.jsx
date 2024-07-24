import React from 'react'
import { useEffect, useRef } from 'react'
import cross from '../../assets/img/cross.png'
import { useState } from 'react'
import './ModelSelction.css'
import Loader from '../Loader/Loader'
import model from '../../assets/img/openai.png';
import openaiImage from '../../assets/img/openai.png';
import llamaImage from '../../assets/img/meta.png';
import geminiImage from '../../assets/img/gemini.png';
import claudeImage from '../../assets/img/anthropic.png';
import UseOutsideAlerter from '../Load/OutsideAlerter'

export const ModelSlection = (props) => {
    const [modelsLoading, setmodelsLoading] = useState(false)
    const [ModelSelected, setModelSelected] = useState("")
    useEffect(() => {
        // getModels()
        console.log(props)
        return () => {

        }
    }, [])
    const abc = useRef(null)


    function getModelFromText(text) {
        const lowerText = text.toLowerCase(); // Convert the input text to lowercase for case-insensitive matching

        if (lowerText.includes('gpt')) {
            return 'OpenAI';
        } else if (lowerText.includes('claude')) {
            return 'Claude';
        } else if (lowerText.includes('llama')) {
            return 'Llama';
        }
        else if (lowerText.includes('gemini')) {
            return 'Gemini';
        } else {
            return 'Unknown'; // Return 'Unknown' if none of the specific substrings are found
        }
    }
    const onChangeModel = (modelId, modelName, defaultModel) => {
        setModelSelected(modelId)
        props.setuserData({ ...props.userData, "selectedModel": modelId, modelImage: getModelFromText(modelName), "default_model": defaultModel ? true : false })
        props.setPage("popup")
    }
    const modelImageMap = {
        "OpenAI": openaiImage,
        "Llama": llamaImage,
        "Claude": claudeImage,
        "Gemini": geminiImage
    };
    function getModelImage(modelName) {
        return modelImageMap[modelName]; // Provide a default image path if the model name is not found
    }
    // const handleClickOutside = () => {
    //     // props.setPage("popup")
    //     alert("Exit minting?")
    // };
    const setEditF = (value) => {
        // if (resetPasswordPage.current) {
        //     return;
        // }

        if (value) {
        } else {
            props.setPage("popup")
        }
    };
    UseOutsideAlerter(abc, setEditF, false);


    return (
        <div className='popupOverlay'>
            <div className='OuterModelSection' ref={abc} >

                <div className='headerContainer'>
                    <h2>Select models</h2>

                    <img onClick={() => props.setPage("popup")} src={cross} alt="cross" /></div>
                {
                    !modelsLoading && props.userData.default ? <div className='DefaultModels'>

                        {
                            !modelsLoading && props.userData.default.map((model) => (

                                <div key={`default-${model.id}`} className="model-option">

                                    <input
                                        type="radio"
                                        id={model.id}
                                        name="gender"
                                        value={ModelSelected}
                                        checked={model._id.$oid === props.userData.selectedModel}
                                        onChange={() => onChangeModel(model._id.$oid, model.name, true)}
                                    />
                                    <div className={model._id.$oid === props.userData.selectedModel ? 'purpleText' : ""}>
                                        <img src={getModelImage(getModelFromText(model.name))} alt=",edl" />

                                    </div>

                                    <label className={model._id.$oid === props.userData.selectedModel ? 'purpleText' : ""} > {model.name}</label>



                                </div>
                            ))
                        }
                        <div className='CustomModelsHeader'>
                            <h3>Custom Models</h3>
                        </div>
                        {
                            !modelsLoading && props.userData.custom.map((model) => (

                                <div key={`default-${model.id}`} className="model-option">


                                    <input
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value={ModelSelected}
                                        checked={model._id.$oid === props.userData.selectedModel}
                                        onChange={() => onChangeModel(model._id.$oid, "gpt", model.indexed ? false : true)}
                                    />
                                    <label className={model._id.$oid === props.userData.selectedModel ? 'purpleText' : ""}>{model.name}</label>



                                </div>
                            ))
                        }


                    </div> : <div className='LoderModel'>
                        <Loader />
                    </div>
                }

            </div >
        </div>
    )
}
