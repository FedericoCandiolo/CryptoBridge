import React from 'react';
import Identicon from 'identicon.js';
import Hashes from 'jshashes';

function FundRaising(props) {
    //if(props.props) props = props.props;
    console.log(props)
    console.log(`ID: ${(props.title)}`)
    console.log(`HASH: ${(new Hashes.SHA256).hex(props.title)}`)
    console.log(props)
    // console.log(`Amount to retrieve: ${window.web3.utils.fromWei(props.amountToRetrieve.toString())}`)
    return (
        <div className={`fundraising fundraisingbar ${props.isSelected ? 'selected' : (props.isOpen ? '' : 'grey')}`}>
            <div className={'fundraisingbody'}>
                {
                    props.imgpath ? 
                    <img src={props.imgpath} alt={props.imgpath}/>
                    :
                    <img
                        className="identicon"
                        // width="30"
                        // height="30"
                        src={`data:image/png;base64,${new Identicon(
                        (new Hashes.SHA256).hex(props.title),
                        240
                        ).toString()}`}
                    />
                }                
                <div>
                    <p className="titletext">{props.title}</p>
                    <p><strong>{props.totalDonors}</strong> donations</p>
                    <p><strong>{props.totalAmount} ETH</strong> fund raised</p>
                    {   props.isMine ? (
                        props.amountToRetrieve !== '0' ?
                            <p><strong>{props.amountToRetrieve} ETH</strong> for withdrawal</p>
                            : <p className="grey">Nothing to withdraw</p>
                        ) : ''
                    }
                </div>
            </div>
            <div className="buttonlist">
                <button onClick = {props.selectFundraising}>View More</button>
                {
                   (props.isMine) ?
                    <button onClick={props.toggleFundRaising}>{props.isOpen ? 'Close' : 'Open'}</button>
                    : <></> 
                }                
                {
                    (props.amountToRetrieve !== '0' && props.isMine) ?
                    <button onClick={props.withdraw}>Withdraw</button>
                    : <></>
                }
            </div>            
        </div>
    )
}

export default FundRaising
