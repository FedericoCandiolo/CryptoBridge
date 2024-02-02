import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import CryptoBridge from '../abis/CryptoBridge.json';
import Loading from './Loading';
import Navbar from './Navbar'
import Main from './Main'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'cloudfare-ipfs.com', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {
  async componentWillMount() {
    //React se fija si esta y lo ejecuta, es de Life Cycle
    await this.loadWeb3();
    console.log('Connected to BlockChain')
    await this.loadBlockchainData();
    console.log('Data loaded')
    this.setState({ ...this.state, loading: false });
  }

  async loadWeb3() {
    //de estado
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  async loadBlockchainData() {
    const range = n => [...Array(n).keys()];

    const web3 = window.web3;
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({...this.state, account: accounts[0] });
    console.log(`Connected to account ${accounts[0]}`);

    const networkId = await web3.eth.net.getId();
    const networkData = CryptoBridge.networks[networkId];
    if (networkData) {
                      const cryptobridge = web3.eth.Contract(
                        CryptoBridge.abi,
                        networkData.address
                      );
                      this.setState({ ...this.state, cryptobridge });

                      console.log(`Connected to CryptoBridge`);
                      console.log(cryptobridge);

                      // Load my fund raisings
                      console.log('Load my fund raisings');
                      const myFundingsCount = await cryptobridge.methods
                        .getAmountOfMyFundRaisings()
                        .call();

                      const my_fundraisings_list = {};
                      for (let i = 1; i <= myFundingsCount; i++) {
                        const my_funding_name = await cryptobridge.methods
                          .getNameOfMyFundRaising(i)
                          .call();

                        let my_fund_raising = {
                          amountToRetrieve: my_funding_name[1],
                        };

                        my_fundraisings_list[
                          my_funding_name[0]
                        ] = my_fund_raising;
                      }
                      console.log('My fund raisings');
                      console.log(my_fundraisings_list);

                      // Load fund raisings
                      console.log('Load fund raisings');
                      
                      const fundingsCount = await cryptobridge.methods
                        .getAmountOfFundRaisings()
                        .call();
                      //this.setState({ ...this.state, fundingsCount });

                      console.log(`There are ${fundingsCount} fund raisings`);

                      let fundraisings_list = [];

                      for (let i = 1; i <= fundingsCount; i++) {
                        console.log(i);
                        const funding_name = await cryptobridge.methods
                          .getNameOfFundRaising(i)
                          .call();
                        console.log(
                          `This fund raising is called ${funding_name}`
                        );
                        const fundingdata = await cryptobridge.methods
                          .getFundRaising(funding_name)
                          .call();
                        let funding = {
                          idnumber: i,
                          identification: funding_name,
                          totalAmount: fundingdata[0],
                          donorCount: fundingdata[1],
                          isOpen: fundingdata[2],
                          image: fundingdata[3],
                          isMine: my_fundraisings_list[funding_name] ? true : false,
                        };

                        if(my_fundraisings_list[funding_name]){
                          funding = {
                            ...funding,
                            ...my_fundraisings_list[funding_name],
                          };
                        }


                        let donations = [];
                        for (let j = 1; j <= fundingsCount; j++) {
                          const donationdata = await cryptobridge.methods
                            .getDonor(funding_name, j)
                            .call();

                          let donation = {
                            message: donationdata[0],
                            amount: donationdata[1],
                          };

                          donations = [donation, ...donations];
                        }

                        funding = {
                          ...funding,
                          donations,
                        };

                        console.log(`The ${funding_name} data is:`);
                        console.log(funding);
                        fundraisings_list = [funding, ...fundraisings_list];
                      }
                      // Newest fundraisings at first
                      this.setState({
                        fundings: fundraisings_list /*.reverse()*/,
                      });
                      console.log('These are the fund raisings');
                      console.log(this.state.fundings);
                    } else {
      window.alert('CryptoBridge contract not deployed to detected network.');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      cryptobridge: null,
      fundings: [],
      loading: true,
    };
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <Loading />
            {/* <p>Loading...</p> */}
          </div>
        ) : (
          <>
            <Navbar account={this.state.account} />
            <Main actions={{
              create: async (stringid, imgbuffer) => {
                //UPLOAD IMG TO IPFS
                let imgpath = ""; 
                console.log("IMGBUFFERCREATE")
                console.log(imgbuffer);
                let result = await ipfs.add(imgbuffer);
                console.log(result);
                imgpath = result[0].hash;

                console.log("IMGPATCH before fr")
                console.log(imgpath)

                //CREATE FUNDRAISING
                console.log('A fund raising will be created');
                // imgpath =
                //   'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/250a1948-4148-40f5-98a7-3fced646489c/width=1200/250a1948-4148-40f5-98a7-3fced646489c.jpeg'; ////UNTIL I FIND A FREE ALTERNATIVE FOR INFURA
                if(stringid && imgpath){
                  const new_funding = await this.state.cryptobridge.methods
                  .createFundRaising(stringid, imgpath)
                  .send({ from: this.state.account })
                  .on('transactionHash', (hash) => {
                    console.log(`Transaction Hash: ${hash}`);
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    console.log(`Confirmation Number: ${confirmationNumber}`);
                    console.log(`Receipt:`, receipt);
                  });
                  console.log('Fund raising created');
                }
                else console.log('Please complete the fields to create the fund raising.')
              }
            }}/>
          </>
          // <Main //HACER ESTO
          //   images={this.state.images}
          //   captureFile={this.captureFile}
          //   uploadImage={this.uploadImage}
          //   tipImageOwner={this.tipImageOwner}
          // />
        )}
      </div>
    );
  }
}

export default App;