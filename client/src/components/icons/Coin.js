import React from 'react'

const Coin = (props) => {
    const { className, width = 18, height = 18 } = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} feather feather-disc`}>
            <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>
        </svg>
    )
}

export default Coin