import React, { useState, useRef } from 'react';
import './Menu.css';
import Confirmation from '../Confirmation';
import dots from '../../assets/img/dots.png'
import UseOutsideAlerter from '../Load/OutsideAlerter';
const HoverBox = ({ isOpen, setIsOpen, userData, setMessageHistory, setShowConfirm, showConfirm, indexerLoading }) => {

    const menuRef = useRef(null)
    const setEditF = (value) => {
        // if (resetPasswordPage.current) {
        //     return;
        // }

        if (value) {
        } else {
            setIsOpen(false)
            setShowConfirm(false)
        }
    };
    UseOutsideAlerter(menuRef, setEditF, false);
    const toggleHoverBox = () => {
        setIsOpen(!isOpen);
    };
    const clearChatHistoryPopup = () => {
        setShowConfirm(true)
    }
    return (
        <div className="hover-box-container" ref={menuRef}>
            {
                showConfirm && <Confirmation setShowConfirm={setShowConfirm} filesize={indexerLoading.fileLength} userData={userData} setMessageHistory={setMessageHistory} />
            }
            <img onClick={toggleHoverBox} className={isOpen ? ["MenuImage", "Rotate180"].join(' ') : ["MenuImage", "Rotate90"].join(' ')} src={dots} alt="menu" />
            {isOpen && (
                <div className="hover-box">
                    <ul className='listOptions'>
                        <a onClick={toggleHoverBox} href='https://dev.opentune.ai/' target='blank'><li >Opentune Website</li></a>
                        <li onClick={() => clearChatHistoryPopup()}>Clear chat</li>

                    </ul>
                </div>
            )}
        </div>
    );
};

export default HoverBox;
