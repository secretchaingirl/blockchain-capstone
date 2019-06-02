var ZokratesVerifier = artifacts.require("./ZokratesVerifier.sol");
var ERC721MintableComplete = artifacts.require("./ERC721MintableComplete.sol");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(ZokratesVerifier);
    await deployer.deploy(ERC721MintableComplete, ZokratesVerifier.address);
  })

};
