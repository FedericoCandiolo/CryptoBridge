const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// Chai and Mocha Tests (with revert cases)

const { expect } = require("chai");

// Test file using Mocha and Chai with Truffle

const CryptoBridge = artifacts.require("CryptoBridge");

contract("CryptoBridge Smart Contract", function (accounts) {
  let cryptoBridge;
  const creator = accounts[0];

  beforeEach(async function () {
    cryptoBridge = await CryptoBridge.new();
  });
  
  describe('Creation', async function (){
    it('Should create a new fund raising', async function() {
      const identification = 'TestFund';
      const imgpath = 'test-image.jpg';

      await cryptoBridge.createFundRaising(identification, imgpath);
      const fundraisingInfo = await cryptoBridge.getFundRaising(identification);

      assert.equal(fundraisingInfo[0], 0, 'totalAmount should be 0 initially');
      assert.equal(fundraisingInfo[1], 0, 'donorCount should be 0 initially');
      assert.equal(fundraisingInfo[2], true, 'isOpen should be true initially');
    });
   
    it('Should revert when creating a fund raising with an empty identification', async function() {
      const identification = '';
      const imgpath = 'test-image.jpg';

      try {
        await cryptoBridge.createFundRaising(identification, imgpath);
        assert.fail(
          'Creating fund raising with empty identification should revert'
        );
      } catch (error) {
        assert.include(error.message, 'Identification should not be empty');
      }
    });
  });

  describe('Donate', async function (){
    it('Should donate to a fund raising', async function() {
      const identification = 'TestFund';
      const message = 'Thank you for your support!';
      const donationAmount = web3.utils.toWei('1', 'ether');

      await cryptoBridge.createFundRaising(identification, 'test-image.jpg');
      await cryptoBridge.donate(identification, message, {
        value: donationAmount,
      });

      const fundraisingInfo = await cryptoBridge.getFundRaising(identification);
      const donorInfo = await cryptoBridge.getDonor(identification, 1);

      assert.equal(
        fundraisingInfo[0],
        donationAmount,
        'totalAmount should be updated'
      );
      assert.equal(fundraisingInfo[1], 1, 'donorCount should be updated');
      assert.equal(donorInfo[0], 1, 'donorId should be 1');
      assert.equal(donorInfo[1], message, 'message should match');
      assert.equal(donorInfo[2], donationAmount, 'donation amount should match');
    });

    it('Should revert when attempting to donate to a closed fund raising', async function() {
      const identification = 'TestFund';
      const message = 'Thank you for your support!';
      const donationAmount = web3.utils.toWei('1', 'ether');

      await cryptoBridge.createFundRaising(identification, 'test-image.jpg');
      await cryptoBridge.closeFundRaising(identification);

      try {
        await cryptoBridge.donate(identification, message, {
          value: donationAmount,
        });
        assert.fail('Donating to closed fund raising should revert');
      } catch (error) {
        assert.include(error.message, 'Fundraising is closed');
      }
    });
  });

  describe('Open/Close', async function (){
    it("Should open and close when required by the creator", async function () {
      const identification = "TestFund";
      await cryptoBridge.createFundRaising(identification, "test-image.jpg",{from: creator});
      try {
        await cryptoBridge.openFundRaising(identification, { from: creator });
        assert.fail('Fund raising already open');
      } catch (error) {
        assert.include(error.message, 'Fund raising already open');
      }

      await cryptoBridge.closeFundRaising(identification, { from: creator });
      let fundraisingInfo = await cryptoBridge.getFundRaising(identification);
      assert.equal(fundraisingInfo[2], false, 'fund raising should be closed');

      try {
        await cryptoBridge.closeFundRaising(identification, { from: creator });
        assert.fail('Fund raising already closed');
      } catch (error) {
        assert.include(error.message, 'Fund raising already closed');
      }

      await cryptoBridge.openFundRaising(identification, { from: creator });
      fundraisingInfo = await cryptoBridge.getFundRaising(identification);
      assert.equal(fundraisingInfo[2], true, 'fund raising should be opened');
    });

    it("Should revert when attempting to open a fund raising by a non-creator", async function () {
      const identification = "TestFund";
      await cryptoBridge.createFundRaising(identification, 'test-image.jpg');
      await cryptoBridge.closeFundRaising(identification, { from: creator });
      
      const nonCreator = accounts[1];
      try {
        await cryptoBridge.openFundRaising(identification, { from: nonCreator });
        assert.fail("Non-creator opening fund raising should revert");
      } catch (error) {
        assert.include(error.message, "Only the creator can open a fund raising");
      }
    });

    it("Should revert when attempting to close a fund raising by a non-creator", async function () {
      const identification = "TestFund";
      await cryptoBridge.createFundRaising(identification, "test-image.jpg");

      const nonCreator = accounts[1];
      try {
        await cryptoBridge.closeFundRaising(identification, { from: nonCreator });
        assert.fail("Non-creator closing fund raising should revert");
      } catch (error) {
        assert.include(error.message, "Only the creator can close a fund raising");
      }
    });
  });
  
  describe('Retrieve', async function() {
    it('Should retrieve funds from a fund raising', async function() {
      const identification = 'TestFund';
      const withdrawalAmount = web3.utils.toWei('1', 'ether');

      await cryptoBridge.createFundRaising(identification, 'test-image.jpg');
      await cryptoBridge.donate(identification, 'Thank you for your support!', {
        value: withdrawalAmount,
      });

      const initialBalance = await web3.eth.getBalance(creator);
      await cryptoBridge.withdrawFunds(identification);
      const finalBalance = await web3.eth.getBalance(creator);
      
      assert.isAtMost(
        parseInt(finalBalance),
        parseInt(initialBalance) + parseInt(withdrawalAmount),
        'Balance should be increased by withdrawal amount'
      );

      assert.isAbove(
        parseInt(finalBalance),
        parseInt(initialBalance),
        'Balance should be increased by withdrawal amount'
      );
    });

    it('Should revert when attempting to withdraw funds by a non-creator', async function() {
      const identification = 'TestFund';
      const withdrawalAmount = web3.utils.toWei('1', 'ether');

      await cryptoBridge.createFundRaising(identification, 'test-image.jpg');
      await cryptoBridge.donate(identification, 'Thank you for your support!', {
        value: withdrawalAmount,
      });

      const nonCreator = accounts[1];
      try {
        await cryptoBridge.withdrawFunds(identification, { from: nonCreator });
        assert.fail('Non-creator withdrawing funds should revert');
      } catch (error) {
        assert.include(error.message, 'Only the creator can retrieve funds');
      }
    });
  });

});
