import React, { Component, useState } from 'react';
import FundRaising from './FundRaising'
import Donation from './Donation';

const Main = (props) => {
  const [fields, setFields] = useState({});
  const [buffer, setBuffer] = useState(undefined);
  const [file, setFile] = useState("");
  const [identification, setIdentification] = useState("");
  const [filter, setFilter] = useState("");
  const [showAllFundings, setShowAllFundings] = useState(true);
  const [filteredFundRaisings, setFilteredFundRaisings] = useState(
    props.fundings
  )
  const [selectedFundraising, setSelectedFundraising] = useState(undefined);
  const [fundraisingDonations, setFundraisingDonations] = useState([]);
  ;

  const handleChange = e => {
    setIdentification(e.target.value);
    e.preventDefault();
    console.log(e.target.value);
  }

  const handleFilter = (e) => {
    e.preventDefault();
    setFilter(e.target.value);
    console.log(filter);
    setFilteredFundRaisings(props.fundings.filter(el=>el.identification.match(filter)));
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
                      Choose image
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
            <div className="scroll">
              <div className="scrollcontent">
                {showAllFundings
                  ? filteredFundRaisings.map((
                      p //only show my fundraisings
                    ) => (
                      <FundRaising
                        title={p.identification}
                        imgpath={
                          './imgs/default_donation.jpg'
                          //'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/250a1948-4148-40f5-98a7-3fced646489c/width=1200/250a1948-4148-40f5-98a7-3fced646489c.jpeg'
                        }
                        totalAmount={p.totalAmount.toNumber()}
                        totalDonors={p.donorCount.toNumber()}
                        isOpen={p.isOpen}
                        isMine={p.isMine}
                        isSelected={p.identification === selectedFundraising}
                        withdraw={null}
                        selectFundraising={() => {
                          setSelectedFundraising(p.identification);
                          setFundraisingDonations(p.donations);
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
                            //'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/250a1948-4148-40f5-98a7-3fced646489c/width=1200/250a1948-4148-40f5-98a7-3fced646489c.jpeg'
                          }
                          totalAmount={p.totalAmount.toNumber()}
                          amountToRetrieve={p.amountToRetrieve.toNumber()}
                          totalDonors={p.donorCount.toNumber()}
                          isOpen={p.isOpen}
                          isMine={p.isMine}
                          // donate={() => {}}
                          withdraw={null}
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
                    />
                    {/* Change for options: ETH, gWei and Wei */}
                    <button className="searchbutton nomargin block ">
                      Search
                    </button>
                  </div>
                  <input
                    className="inputbar block width95"
                    id="message"
                    name="message"
                    type="text"
                    placeholder="Message"
                  />
                </div>
                <div>
                  <button className="createbutton nomargin block">
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
                  />
                  <i class="fa fa-search"></i>
                </div>
                <button className="togglefr nomargin">
                  View all fund raisings
                </button>
              </div>
              {/* Search SVG */}
              {fundraisingDonations.map((d) => (
                <Donation msg={d.message} amount={d.amount.toNumber()} />
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