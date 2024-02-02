import React from 'react'

function Donation(props) {
    console.log(props)
    return (
        <div className={`fundraising fundraisingbar`}>
            <div className="fundraisingbody">
                <div className="donation">
                    <p className="bigtext">{props.amount}</p>
                    <p className="large">ETH</p>
                </div>
                <div>
                    <p className="">{props.msg}</p>
                </div>
            </div>
            {/* <div>
                <button>View More</button>
                <button>{props.isOpen ? 'Close' : 'Open'}</button>
                {
                    props.amountToRetrieve ?
                    <button>Withdraw</button>
                    : <></>
                }
            </div>             */}
        </div>
    )
}

export default Donation
