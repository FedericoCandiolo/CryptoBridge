import React from 'react'

function FundRaising(props) {
    console.log(props)
    return (
        <div className={`fundraising fundraisingbar ${props.isOpen ? '' : 'grey'}`}>
            <div className="fundraisingbody">
                <img src={props.imgpath} alt={props.imgpath}/>
                <div>
                    <p className="titletext">{props.title}</p>
                    <p><strong>{props.totalDonors}</strong> donations</p>
                    <p><strong>{props.totalAmount} ETH</strong> fund raised</p>
                    {
                        props.amountToRetrieve ?
                        <p><strong>{props.amountToRetrieve} ETH</strong> for withdrawal</p>
                        : <p className="grey">Nothing to withdraw</p>
                    }
                </div>
            </div>
            <div>
                <button>View More</button>
                <button>{props.isOpen ? 'Close' : 'Open'}</button>
                {
                    props.amountToRetrieve ?
                    <button>Withdraw</button>
                    : <></>
                }
            </div>            
        </div>
    )
}

export default FundRaising
