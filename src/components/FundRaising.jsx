import React from 'react'

function FundRaising(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            {
                Object.keys(props).concat(Object.values(props)).map(e=><p>{e}</p>)
            }
        </div>
    )
}

export default FundRaising
