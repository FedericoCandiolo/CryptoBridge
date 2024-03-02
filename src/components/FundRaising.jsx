import React from 'react'

function FundRaising(props) {
    //if(props.props) props = props.props;
    console.log(props)
    return (
        <div className={`fundraising fundraisingbar ${props.isSelected ? 'selected' : (props.isOpen ? '' : 'grey')}`}>
            <div className={'fundraisingbody'}>
                <img src={props.imgpath} alt={props.imgpath}/>
                <div>
                    <p className="titletext">{props.title}</p>
                    <p><strong>{props.totalDonors}</strong> donations</p>
                    <p><strong>{props.totalAmount} ETH</strong> fund raised</p>
                    {   props.isMine ? (
                        props.amountToRetrieve ?
                            <p><strong>{props.amountToRetrieve} ETH</strong> for withdrawal</p>
                            : <p className="grey">Nothing to withdraw</p>
                        ) : ''
                    }
                </div>
            </div>
            <div>
                <button onClick = {props.selectFundraising}>View More</button>
                <button>{props.isOpen ? 'Close' : 'Open'}</button>
                {
                    (props.amountToRetrieve && props.isMine) ?
                    <button>Withdraw</button>
                    : <></>
                }
            </div>            
        </div>
    )
}

export default FundRaising
