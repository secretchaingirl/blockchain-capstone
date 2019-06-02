const ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
const ZokratesVerifier = artifacts.require('ZokratesVerifier');

const truffleAssert = require('truffle-assertions');

contract('ERC721MintableComplete', accounts => {

    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];

    var eRC721MintableComplete;
    var tokens = new Array();

    const zokrates = {
        "proof": {
            "a": ["0x2032a7cdce1a03bee97fb39e9f160f429277813fea425ec99adbd701288d54c2", "0x234fa79cfd5ebae8927a35dd36bb37957051a7c429608bc3e795bd64713b8d68"],
            "b": [["0x0ce925b54b8ec0f874a1a59f9ac333bac98518e7adb3de30e72704bc266e5810", "0x1d040f622e3d5f614b675c351ba6e8f52d3af1a6e8debdcb3ae50a84b9ced4ad"], ["0x20b425db6874338a60ff44735bc58a736a00abd792f103e51bb1af4e4f031070", "0x20f021b842b7d857ba18d5dbd70c0a93d8cc1b1543d96ba75be806deb2af8484"]],
            "c": ["0x24f773a49ab9c00f52b5a1389337d99b9bc4e8553a6572cc48cb0b97b29f9433", "0x12981ed4fcb4394c180d2919d7e7e721a7602849083f6f5dc916a9515e0ef0fd"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    };

    // verifier proof payload for minting
    let payload = {
        a: zokrates.proof.a,
        b: zokrates.proof.b,
        c: zokrates.proof.c,
        inputs: zokrates.inputs
    };

    describe('match erc721 spec', function () {

        let mint = async function () {
            let tx = await eRC721MintableComplete.mint(payload.a, payload.b, payload.c, payload.inputs, {from: owner});

            truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
                tokens.push(ev.tokenId.toNumber());
                return true;
            }, 'Error minting token.');
        }

        before(async function () { 
            const zokratesVerifier = await ZokratesVerifier.new({from: owner});
            eRC721MintableComplete = await ERC721MintableComplete.new(zokratesVerifier.address, {from: owner});

            // Mint (3) tokens
            mint();
            mint();
            mint();
        })

        it('should return total supply', async function () { 
            let totalSupply = await eRC721MintableComplete.totalSupply();

            assert.equal(totalSupply, 3, 'incorrect total supply of tokens');
        })

        it('should get token balance', async function () { 
            let tokenBalance = await eRC721MintableComplete.balanceOf(owner);

            assert.equal(tokenBalance, 3, 'token balance for owner is not correct');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let uri = await eRC721MintableComplete.tokenURI(tokens[0]);
            assert.equal(uri, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', 'invalid token URI returned');
        })

        it('should transfer token from one owner to another', async function () {
            let beforeBalance = await eRC721MintableComplete.balanceOf(owner);
            await eRC721MintableComplete.safeTransferFrom(owner, account1, tokens[1]);
            let afterBalance = await eRC721MintableComplete.balanceOf(owner);

            assert.equal(afterBalance, beforeBalance - 1, 'token balance of owner did not decrease by 1');

            let newOwnerBalance = await eRC721MintableComplete.balanceOf(account1);

            assert.equal(newOwnerBalance, 1, 'token was not transferred to new owner correctly');
        })
    });

    describe('have ownership properties', function () {
        before(async function () {
            const zokratesVerifier = await ZokratesVerifier.new({from: owner});
            eRC721MintableComplete = await ERC721MintableComplete.new(zokratesVerifier.address, {from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let success = false;
            
            try {
                await eRC721MintableComplete.mint(payload.a, payload.b, payload.c, payload.inputs, {from: account1});
            } catch (e) {
                success = true;
            }
            
            assert(success, 'mint allowed from non-contract owner');
        })

        it('should return contract owner', async function () { 
            let contractOwner = await eRC721MintableComplete.Owner();

            assert.equal(contractOwner, owner, 'contract owner is not correct');
        })

    });
})