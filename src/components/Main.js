import React, { Component, useState } from 'react';
import FundRaising from './FundRaising'
import Donation from './Donation';

const Main = (props) => {
  const [fields, setFields] = useState({});
  const [buffer, setBuffer] = useState(undefined);
  const [file, setFile] = useState("");
  const [identification, setIdentification] = useState("");

  const handleChange = e => {
    setIdentification(e.target.value);
    e.preventDefault();
    console.log(e.target.value);
  }

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
              <form
                className="width100"
                onSubmit={createSubmit}
              >
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
            <h2 className="fundraisingbar">My fund raisings</h2>
            <div className="fundraisingbar ">
              <div className="nomargin">
                <input
                  className="searchbar"
                  type="text"
                  placeholder="Search fund raising"
                />
                <i className="fa fa-search"></i>
              </div>
              <button className="togglefr nomargin">
                View all fund raisings
              </button>
            </div>
            {/* Search SVG */}
            <FundRaising
              title={'First One'}
              imgpath={
                'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/250a1948-4148-40f5-98a7-3fced646489c/width=1200/250a1948-4148-40f5-98a7-3fced646489c.jpeg'
              }
              totalAmount={10}
              amountToRetrieve={5}
              totalDonors={6}
              isOpen={true}
              // donate={() => {}}
              withdraw={null}
            />
            <FundRaising
              title={'First One'}
              imgpath={
                'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/250a1948-4148-40f5-98a7-3fced646489c/width=1200/250a1948-4148-40f5-98a7-3fced646489c.jpeg'
              }
              totalAmount={100}
              amountToRetrieve={0}
              totalDonors={9}
              isOpen={true}
              // donate={() => {}}
              withdraw={null}
            />
            <FundRaising
              title={'Snd One'}
              imgpath={
                'https://static.wikia.nocookie.net/kuroshitsuji/images/3/32/BoM2_Ciel.png/revision/latest?cb=20200507114750'
              }
              totalAmount={10}
              amountToRetrieve={5}
              totalDonors={6}
              isOpen={false}
              // donate={() => {}}
              withdraw={null}
            />
          </div>
        </div>
        <div className="">
          <div className="frform">
            <h2 className="fundraisingbar">Donate to fund raising name</h2>
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
                <button className="createbutton nomargin block">Donate</button>
              </div>
            </div>
          </div>
          {/* <div className="fr main_element half"> */}
          <div className="fr main_element ">
            <h2 className="fundraisingbar">Fund raising's donations</h2>
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
            <Donation msg={'This is my first donation!'} amount={5} />
            <Donation msg={'This is my second donation!'} amount={2} />
            <Donation msg={'This is my third donation!'} amount={0.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
// import Identicon from 'identicon.js';

// class Main extends Component {

//   render() { //capturamos la imagen y la preprocesamos, la cargamos en ipfs. Cargamos en blockchain el hash
//     return (
//       <div className="container-fluid mt-5">
//         <div className="row">
//           <main
//             role="main"
//             className="col-lg-12 ml-auto mr-auto"
//             style={{ maxWidth: '500px' }}
//           >
//             <div className="content mr-auto ml-auto">
//               <p>&nbsp;</p>

//               <h2>Share Image</h2>

//               <form
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   const description = this.imageDescription.value;
//                   this.props.uploadImage(description);
//                 }}
//               >
//                 <input
//                   type="file"
//                   accept=".jpg, .jpeg, .png, .bmp, .gif"
//                   onChange={this.props.captureFile}
//                 />
//                 <div className="form-group mr-sm-2">
//                   <br></br>
//                   <input
//                     id="imageDescription"
//                     type="text"
//                     ref={(input) => {
//                       this.imageDescription = input;
//                     }}
//                     className="form-control"
//                     placeholder="Image description..."
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-primary btn-block btn-lg"
//                 >
//                   Upload!
//                 </button>
//               </form>

//               <p>&nbsp;</p>

//               {this.props.images.map((image, key) => {
//                 return (
//                   <div className="card mb-4" key={key}>
//                     <div className="card-header">
//                       <img
//                         className="mr-2"
//                         width="30"
//                         height="30"
//                         src={`data:image/png;base64,${new Identicon(
//                           image.author,
//                           30
//                         ).toString()}`}
//                       />
//                       <small className="text-muted">{image.author}</small>
//                     </div>
//                     <ul id="imageList" className="list-group list-group-flush">
//                       <li className="list-group-item">
//                         <p class="text-center">
//                           <img
//                             src={`https://ipfs.infura.io/ipfs/${image.hash}`}
//                             style={{ maxWidth: '420px' }}
//                           />
//                         </p>
//                         <p>{image.description}</p>
//                       </li>
//                       <li key={key} className="list-group-item py-2">
//                         <small className="float-left mt-1 text-muted">
//                           TIPS:{' '}
//                           {window.web3.utils.fromWei(
//                             image.tipAmount.toString(),
//                             'Ether'
//                           )}{' '}
//                           ETH
//                         </small>
//                         <button
//                           className="btn btn-link btn-sm float-right pt-0"
//                           name={image.id}
//                           onClick={(event) => {
//                             let tipAmount = window.web3.utils.toWei(
//                               '0.1',
//                               'Ether'
//                             );
//                             console.log(event.target.name, tipAmount);
//                             this.props.tipImageOwner(
//                               event.target.name,
//                               tipAmount
//                             );
//                           }}
//                         >
//                           TIP 0.1 ETH
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 );
//               })}
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }
// }

// export default Main;