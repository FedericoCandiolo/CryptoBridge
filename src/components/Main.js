import React, { Component } from 'react';
import FundRaising from './FundRaising'

const Main = (props) => {
  return (
    <div className="main">
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.10.2/css/all.css"
      ></link>
      <div className="selectors half">
        <div className="fr main_element half">
          <h2 className="fundraisingbar">My fund raisings</h2>
          <div className="fundraisingbar ">
            <div className="nomargin">
              <input
                className="searchbar"
                type="text"
                placeholder="Search fund raising"
              />
              <i class="fa fa-search"></i>
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
      <div className="details main_element half">
        <p>Details</p>
        <p>Details</p>
        <p>Details</p>
        <p>Details</p>
        <p>Details</p>
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