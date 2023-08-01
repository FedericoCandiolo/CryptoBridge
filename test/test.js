const { assert } = require('chai');

const CryptoBridge = artifacts.require('./CryptoBridge.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('CryptoBridge', ([deployer, author, donator]) => {
  let cryptobridge;

  before(async () => {
    cryptobridge = await CryptoBridge.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await cryptobridge.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name',async () => {
      const name = await cryptobridge.name()
      assert.equal(name,'CryptoBridge');
    });
  });

  describe('fundraisings', async()=>{
    let result, fundRaisingsCount;
    const hash = 'hash123';
    const string_id = 'firstfr';

    before(async () => {
      result = await cryptobridge.createFundRaising(string_id, hash, {
        from: author,
      });
      fundRaisingsCount = await cryptobridge.fundRaisingsCount();
    });

    it('creates fundraising', async()=>{  
      //Success
      assert.equal(fundRaisingsCount, 1); 
      const event = result.logs[0].args.fundraising;
      console.log(event.id);
      
      assert.equal(parseInt(event.id), fundRaisingsCount.toNumber(),'id is correct');
      assert.equal(event.string_id, string_id, 'string id is correct');
      assert.equal(event.imghash,hash,'image hash is correct');
      assert.equal(event.totalAmount, '0','total amount is correct');
      assert.equal(event.amountToRetrieve, '0','amount to retrieve is correct');
      assert.equal(event.donorCount, '0','donor count is correct');
      assert.equal(event.isOpen, true,'open state is correct');
      assert.equal(event.author, author, 'author is correct');

      await cryptobridge.createFundRaising(string_id, hash, {
        from: author,
      }).should.be.rejected; //Same string_id
    })

    it('can open/close fundraising', async () => {
      let result_openclose;

      result_openclose = await cryptobridge.closeFundRaising(string_id, {
        from: author,
      });
      
      assert.equal(
        result_openclose.logs[0].args.fundraising.isOpen,
        false,
        'fundraising closes ok'
      );

      await cryptobridge.closeFundRaising(hash, '', { from: author })
        .should.be.rejected; //Already closed
      
      result_openclose = await cryptobridge.openFundRaising(string_id, {
        from: author,
      });
      assert.equal(
        result_openclose.logs[0].args.fundraising.isOpen,
        true,
        'fundraising opens ok'
      );
      
      await cryptobridge.openFundRaising(hash, '', { from: author })
        .should.be.rejected; //Already open
      
    
    })

    it('receives donations', async () => {
      let result_donation;
      const message = 'Test donation!';
      const donation_value = web3.utils.toWei('1', 'Ether');
      const web3_donation_value = new web3.utils.BN(donation_value);

      let oldDonatorBalance;
      oldDonatorBalance = await web3.eth.getBalance(donator);
      oldDonatorBalance = new web3.utils.BN(oldDonatorBalance);

      result_donation = await cryptobridge.donate(string_id, message, {
        from: donator,
        value: donation_value
      });

      let newDonatorBalance;
      newDonatorBalance = await web3.eth.getBalance(donator);
      newDonatorBalance = new web3.utils.BN(newDonatorBalance);

      assert.equal(   //Gas price may vary. As I'm transfering 1ETH just checking the first values
        newDonatorBalance.toString().slice(0, 3),
        oldDonatorBalance
          .sub(web3_donation_value)
          .toString()
          .slice(0, 3),
        'fundraising closes ok'
      );

      assert.equal(
        parseInt(result_donation.logs[0].args.fundraising.donorCount),
        1,
        'fundraising closes ok'
      );

      assert.equal(
        result_donation.logs[0].args.fundraising.totalAmount,
        donation_value,
        'fundraising closes ok'
      );

      assert.equal(
        result_donation.logs[0].args.fundraising.amountToRetrieve,
        donation_value,
        'fundraising closes ok'
      );
    })

    it('withdraws funds', async () => {
      let result_withdrawal;
      const donation_value = web3.utils.toWei('1', 'Ether');
      const web3_donation_value = new web3.utils.BN(donation_value);

      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result_withdrawal = await cryptobridge.withdrawFunds(string_id, {
        from: author,
      });

      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      assert.equal(
        //Gas price may vary. As I'm transfering 1ETH just checking the first values
        newAuthorBalance.toString().slice(0, 3),
        oldAuthorBalance
          .add(web3_donation_value)
          .toString()
          .slice(0, 3),
        'fundraising closes ok'
      );

      assert.equal(
        parseInt(result_withdrawal.logs[0].args.fundraising.amountToRetrieve),
        0,
        'amount to retrieve updates ok'
      );

    })
    
  })
  // describe('funding', async () => {
  //     let F_ID = 'testing_funding';
  //     var img_path = 'abc_123';

  //     let result;
  //     let fundings_count;

  //     before(async () => {
  //         result = await cryptobridge.createFundRaising(F_ID,img_path, {
  //             from: author,
  //         });

  //         fundings_count = await cryptobridge.getAmountOfFundRaisings(); 
  //         console.log(fundings_count)
  //     });

  //     it('creates funding', async () => {
  //       //SUCCESS
  //       console.log(event);
  //       const image = await event.imgpath;

  //       assert.equal(fundings_count, 1);
  //       const event = result.logs[0].args; // Puedo ver el result porque existe el event
  //       assert.equal(event.identification, F_ID, 'id is correct');//VER COMO HACER ESTO
  //       assert.equal(image, img_path, 'hash is correct');
  //       assert.equal(event.totalAmount, '0', 'donations amount is correct');
  //       assert.equal(event.creator, author, 'author is correct');

  //       //FAILURE
  //       await decentragram.createFundRaising(F_ID, '', { from: author })
  //           .should.be.rejected; //it already exists
  //     })

  //     it('donates funds', async () => {
  //       let oldAuthorBalance;
  //       oldAuthorBalance = await web3.eth.getBalance(author);
  //       oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

  //       result = await cryptobridge.donate(F_ID,'First donation', {
  //           from: tipper,
  //           value: web3.utils.toWei('1', 'Ether'), 
  //       });

  //       // SUCCESS
  //       const event = result.logs[0].args;
        
  //       assert.equal(
  //           event.amountToRetrieve,
  //           '1000000000000000000',
  //           'tip amount is correct'
  //       );
                
  //       // FAILURE: Tries to tip a image that does not exist
  //       await cryptobridge.donate('NO FUNCIONA','First donation', {
  //           from: tipper,
  //           value: web3.utils.toWei('1', 'Ether'), 
  //       }).should.be.rejected;
  //     })

  //     it('withdraws fuznds', async () => {
  //           // Check that author received funds
  //       let newAuthorBalance;
  //       newAuthorBalance = await web3.eth.getBalance(author);
  //       newAuthorBalance = new web3.utils.BN(newAuthorBalance);

  //       let tipImageOwner;
  //       tipImageOwner = web3.utils.toWei('1', 'Ether');
  //       tipImageOwner = new web3.utils.BN(tipImageOwner);

  //       const expectedBalance = oldAuthorBalance.add(tipImageOwner);

  //       assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

  //     })


  // })

});
