// const { assert } = require('chai');

// const CryptoBridge = artifacts.require('./CryptoBridge.sol');

// require('chai')
//   .use(require('chai-as-promised'))
//   .should();

// contract('CryptoBridge', ([deployer, author, tipper]) => {
//   let cryptobridge;

//   before(async () => {
//     cryptobridge = await CryptoBridge.deployed();
//   });

//   describe('deployment', async () => {
//     it('deploys successfully', async () => {
//       const address = await cryptobridge.address;
//       assert.notEqual(address, 0x0);
//       assert.notEqual(address, '');
//       assert.notEqual(address, null);
//       assert.notEqual(address, undefined);
//     });

//   });

//   describe('funding', async () => {
//       let F_ID = 'testing_funding';
//       let img_path = 'abc_123';

//       let result;
//       let fundings_count;

//       before(async () => {
//           result = await cryptobridge.createFundRaising(F_ID,img_path, {
//               from: author,
//           });

//           fundings_count = await cryptobridge.getAmountOfFundRaisings(); 
//       });

//       it('creates funding', async () => {
//         //SUCCESS
//         console.log(event);
//         const image = await event.imgpath;

//         assert.equal(fundings_count, 1);
//         const event = result.logs[0].args; // Puedo ver el result porque existe el event
//         assert.equal(event.identification, F_ID, 'id is correct');//VER COMO HACER ESTO
//         assert.equal(image, img_path, 'hash is correct');
//         assert.equal(event.totalAmount, '0', 'donations amount is correct');
//         assert.equal(event.creator, author, 'author is correct');

//         //FAILURE
//         await decentragram.createFundRaising(F_ID, '', { from: author })
//             .should.be.rejected; //it already exists
//       })

//       it('donates funds', async () => {
//         let oldAuthorBalance;
//         oldAuthorBalance = await web3.eth.getBalance(author);
//         oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

//         result = await cryptobridge.donate(F_ID,'First donation', {
//             from: tipper,
//             value: web3.utils.toWei('1', 'Ether'), 
//         });

//         // SUCCESS
//         const event = result.logs[0].args;
        
//         assert.equal(
//             event.amountToRetrieve,
//             '1000000000000000000',
//             'tip amount is correct'
//         );
                
//         // FAILURE: Tries to tip a image that does not exist
//         await cryptobridge.donate('NO FUNCIONA','First donation', {
//             from: tipper,
//             value: web3.utils.toWei('1', 'Ether'), 
//         }).should.be.rejected;
//       })

//       it('withdraws funds', async () => {
//             // Check that author received funds
//         let newAuthorBalance;
//         newAuthorBalance = await web3.eth.getBalance(author);
//         newAuthorBalance = new web3.utils.BN(newAuthorBalance);

//         let tipImageOwner;
//         tipImageOwner = web3.utils.toWei('1', 'Ether');
//         tipImageOwner = new web3.utils.BN(tipImageOwner);

//         const expectedBalance = oldAuthorBalance.add(tipImageOwner);

//         assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

//       })


//   })

// });
