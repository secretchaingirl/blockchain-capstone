var ZokratesVerifier = artifacts.require("./ZokratesVerifier.sol");
var ERC721MintableComplete = artifacts.require("./ERC721MintableComplete.sol");

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(ZokratesVerifier, {from: accounts[0]});
    await deployer.deploy(ERC721MintableComplete, ZokratesVerifier.address, {from: accounts[0]});
  })

};
