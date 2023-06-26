const CryptoBridge = artifacts.require('CryptoBridge');

module.exports = function(deployer) {
  //Migra los smart contracts de la PC a la Blockchain
  deployer.deploy(CryptoBridge);
};
