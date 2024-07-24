import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './Signup.css';
import logo from '../../assets/img/brt-logo.png'
import Loader from '../Loader/Loader';
function Signup({ setPage, userData }) {
    const [username, setUsername] = useState(userData?.ApiKey);

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        if (userData.ApiKey) {
            setPage("Chat")
        }
    }, [])


    return (
        <div className='OuterSignupContainer'>
            <div>
                <div className='LogoContainer'>
                    <img src={logo} alt="logo" />
                </div>
                <div className='TextContainer'>
                    <h1>
                        Welcome to Opentune
                    </h1>
                    <p>Login to your account</p>
                </div>
            </div>
            {
                <div className='BottomContainer'>
                    <div className='ApikeyInput'>
                        <input placeholder='paste your api key here' />
                        {/* <img src={seePass} alt="see" /> */}
                    </div>
                    <div className='ButtonContainer'>
                        <button onClick={() => setPage("Chat")}>
                            <p>
                                Next
                            </p>

                        </button>

                    </div>
                    <div className='ButtonContainer'>
                        <button >
                            {/* <a href='https://opentune.ai/' target='blank'> */}
                            <p onClick={() => {
                                // setPage("Chat");
                            }}>
                                Get via OT
                            </p>
                            {/* </a> */}

                        </button>
                    </div>
                </div>
            }
        </div>
    );
}
export default Signup