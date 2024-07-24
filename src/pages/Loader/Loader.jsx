import React from 'react'
import loadergif from '../../assets/img/loader.gif'
import './Loader.css'
const Loader = () => {
    return (
        <div className='LoaderOuterDiv'>
            <img src={loadergif} alt="loading" />
        </div>
    )
}

export default Loader