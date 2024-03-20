import React, { Component, useState } from 'react';
import FundRaising from './FundRaising'
import Donation from './Donation';

const Main = (props) => {
  const [fields, setFields] = useState({});
  const [buffer, setBuffer] = useState(undefined);
  const [file, setFile] = useState("");
  const [identification, setIdentification] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const [filter, setFilter] = useState("");
  const [filterDonations, setFilterDonations] = useState('');
  const [showAllFundings, setShowAllFundings] = useState(true);
  const [filteredFundRaisings, setFilteredFundRaisings] = useState(
    props.fundings
  )
  const [filteredDonations, setFilteredDonations] = useState(
    null
  )
  const [selectedFundraising, setSelectedFundraising] = useState(undefined);
  const [fundraisingDonations, setFundraisingDonations] = useState([]);
  ;
  const [unit, setUnit] = useState('ETH');

  const handleChange = e => {
    setIdentification(e.target.value);
    e.preventDefault();
    console.log(e.target.value);
  }

  const handleMessage = e => {
    setMessage(e.target.value);
    e.preventDefault();
    console.log(e.target.value);
  }

  const handleAmount = e => {
    setAmount(e.target.value);
    e.preventDefault();
    console.log(e.target.value);
  }

  const handleFilter = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(filter);
    setFilter(e.target.value);
    setFilteredFundRaisings(
      e.target.value !== ''
        ? props.fundings.filter(
            (el) =>
              (selectedFundraising &&
                selectedFundraising === el.identification) ||
              el.identification
                .toLowerCase()
                .match(e.target.value.toLowerCase())
          )
        : props.fundings
    );
  };

  const handleFilterDonations = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(filter);
    setFilterDonations(e.target.value);
    setFilteredDonations( ////ACA ROMPE
      filterDonations ? (
      e.target.value !== ''
        ? fundraisingDonations.filter( ////COMPLETAR ESTO
            (el) =>
              el.message
                .toLowerCase()
                .match(e.target.value.toLowerCase())
          )
        : fundraisingDonations
      ) : fundraisingDonations
    );
  };

  const createSubmit = (event) => {
    event.preventDefault();
    if (identification && buffer) props.actions.create(identification, buffer);
  };

  const captureFile = (event) => {
    //Preprocesa la imagen para upload
    event.preventDefault();
    const file = event.target.files[0];
    setFile(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    console.log(file)

    reader.onloadend = () => {
      console.log("READER")
      console.log(reader.result)
      setBuffer(Buffer(reader.result));
      console.log('buffer', buffer);
      console.log(buffer);
    };
  };

  const toggleFundRaisingMain = (stringid, isOpen) => {
    console.log('button pressed');
    if(isOpen) props.actions.close(stringid);
    else props.actions.open(stringid);
  };

  const donateMain = () => {
    console.log("Donation Main Start");
    props.actions.donate(selectedFundraising, message, amount);
    console.log("Donation Main End");
  }

  const weiToNum = (n,u) =>  //It is returned as a string
    window.web3.utils.fromWei(n.toString(), u === 'ETH' ? 'Ether' : (u === 'gWei' ? 'gwei' : 'wei'));
  

  return (
    <div className="main">
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.10.2/css/all.css"
      ></link>
      {/* <div className="half"> */}
      <div className="column-container">
        <div className="">
          <div className="frform">
            <h2 className="fundraisingbar">Create fund raising</h2>
            <div className="space-between fundraisingbar">
              <form className="width100" onSubmit={createSubmit}>
                <input
                  className="inputbar block width95"
                  id="identification"
                  name="identification"
                  type="text"
                  placeholder="Identification"
                  onChange={handleChange}
                />
                <div className="space-between width96_5">
                  <div className="space-between width100">
                    <input
                      className="searchbutton nomargin block filebutton lineheight filetext width45 marginright"
                      id="file"
                      type="file"
                      accept=".jpg, .jpeg, .png, .bmp, .gif"
                      onChange={captureFile}
                    />
                    <label
                      htmlFor="file"
                      className="searchbutton nomargin block lineheight width30 textcenter"
                    >
                      Search...
                    </label>
                  </div>
                </div>
              </form>
              <div>
                <button
                  onClick={createSubmit}
                  className="createbutton nomargin block"
                  // onClick={() => props.actions.create('Test', 'imgpath')}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
          {/* <div className="fr main_element half"> */}
          <div className="fr main_element ">
            <h2 className="fundraisingbar">
              {showAllFundings ? 'Fund raisings' : 'My fund raisings'}
            </h2>
            <div className="fundraisingbar ">
              <div className="nomargin">
                <input
                  className="searchbar"
                  id="filter"
                  name="filter"
                  type="text"
                  placeholder="Search fund raising"
                  onChange={handleFilter}
                />
                <i className="fa fa-search"></i>
              </div>
              <button
                className="togglefr nomargin"
                onClick={() => setShowAllFundings(!showAllFundings)}
              >
                View {showAllFundings ? 'my' : 'all'} fund raisings
              </button>
            </div>
            {/* Search SVG */}
            <div
              className={
                filteredFundRaisings.filter((e) => showAllFundings || e.isMine)
                  .length > 3
                  ? 'scroll'
                  : ''
              }
            >
              <div className="scrollcontent">
                {showAllFundings
                  ? filteredFundRaisings.map((
                      p //only show my fundraisings
                    ) => (
                      <FundRaising
                        title={p.identification}
                        imgpath={
                          p.image                          
                        }
                        totalAmount={weiToNum(p.totalAmount, 'ETH')}
                        totalDonors={p.donorCount.toNumber()}
                        isOpen={p.isOpen}
                        isMine={p.isMine}
                        toggleFundRaising={() =>
                          toggleFundRaisingMain(p.identification, p.isOpen)
                        }
                        isSelected={p.identification === selectedFundraising}
                        withdraw={null}
                        selectFundraising={() => {
                          setSelectedFundraising(p.identification);
                          setFundraisingDonations(p.donations);
                          setFilteredDonations(p.donations);
                        }}
                      />
                    ))
                  : filteredFundRaisings
                      .filter((e) => e.isMine)
                      .map((
                        p //only show my fundraisings
                      ) => (
                        <FundRaising
                          title={p.identification}
                          imgpath={
                            './imgs/default_donation.jpg'
                          
                          }
                          totalAmount={weiToNum(p.totalAmount, 'ETH')}
                          amountToRetrieve={weiToNum(p.amountToRetrieve, 'ETH')}
                          totalDonors={p.donorCount.toNumber()}
                          isOpen={p.isOpen}
                          isMine={p.isMine}
                          toggleFundRaising={() =>
                            toggleFundRaisingMain(p.identification, p.isOpen)
                          }
                          // donate={() => {}}
                          isSelected={p.identification === selectedFundraising}
                          withdraw={null}
                          selectFundraising={() => {
                            setSelectedFundraising(p.identification);
                            setFundraisingDonations(p.donations);
                          }}
                        />
                      ))}
              </div>
            </div>
          </div>
        </div>
        {selectedFundraising ? (
          <div className="">
            <div className="frform">
              <h2 className="fundraisingbar">
                Donate to "{selectedFundraising}"
              </h2>
              <div className="space-between fundraisingbar">
                <div className="width100">
                  <div className="space-between width96_5">
                    <input
                      className="inputbar block width65"
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Amount to donate"
                      min={0}
                      onChange={handleAmount}
                    />
                    {/* Change for options: ETH, gWei and Wei */}
                    <button className="searchbutton nomargin block ">
                      ETH
                    </button>
                  </div>
                  <input
                    className="inputbar block width95 message"
                    id="message"
                    name="message"
                    type="text"
                    placeholder="Message"
                    onChange={handleMessage}
                  />
                </div>
                <div>
                  <button
                    className="createbutton nomargin block"
                    onClick={donateMain}
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="fr main_element half"> */}
            <div className="fr main_element ">
              <h2 className="fundraisingbar">
                {selectedFundraising}'s donations
              </h2>
              <div className="fundraisingbar ">
                <div className="nomargin">
                  <input
                    className="searchbar"
                    type="text"
                    placeholder="Search donation message"
                    id="filterDonations"
                    name="filterDonations"
                    onChange={handleFilterDonations}
                  />
                  <i className="fa fa-search"></i>
                </div>
                {['ETH', 'gWei', 'Wei'].map((u) => (
                  <button className={`togglefr nomargin nopaddingsides ${unit === u ? 'thickborder' : ''}`} onClick={() => setUnit(u)}>
                    {u}
                  </button>
                ))}
              </div>
              {/* Search SVG */}
              {filteredDonations.map((d) => (
                <Donation
                  msg={d.message}
                  amount={weiToNum(d.amount, unit)}
                  unit={unit}
                />
              ))}
              {/* <Donation msg={'This is my first donation!'} amount={5} />
              <Donation msg={'This is my second donation!'} amount={2} />
              <Donation msg={'This is my third donation!'} amount={0.5} /> */}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Main;