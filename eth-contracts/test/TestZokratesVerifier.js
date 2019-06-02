var ZokratesVerifier = artifacts.require('ZokratesVerifier.sol');
const truffleAssert = require('truffle-assertions');

contract('ZokratesVerifier', accounts => {

    const owner = accounts[0];
    var zokratesVerifier;

    var correct = {
        "proof": {
            "a": ["0x2032a7cdce1a03bee97fb39e9f160f429277813fea425ec99adbd701288d54c2", "0x234fa79cfd5ebae8927a35dd36bb37957051a7c429608bc3e795bd64713b8d68"],
            "b": [["0x0ce925b54b8ec0f874a1a59f9ac333bac98518e7adb3de30e72704bc266e5810", "0x1d040f622e3d5f614b675c351ba6e8f52d3af1a6e8debdcb3ae50a84b9ced4ad"], ["0x20b425db6874338a60ff44735bc58a736a00abd792f103e51bb1af4e4f031070", "0x20f021b842b7d857ba18d5dbd70c0a93d8cc1b1543d96ba75be806deb2af8484"]],
            "c": ["0x24f773a49ab9c00f52b5a1389337d99b9bc4e8553a6572cc48cb0b97b29f9433", "0x12981ed4fcb4394c180d2919d7e7e721a7602849083f6f5dc916a9515e0ef0fd"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    };

    var incorrect = {
        "proof": {
            "a": ["0x2032a7cdce1a03bee97fb39e9f160f429277813fea425ec99adbd701288d54c2", "0x234fa79cfd5ebae8927a35dd36bb37957051a7c429608bc3e795bd64713b8d68"],
            "b": [["0x0ce925b54b8ec0f874a1a59f9ac333bac98518e7adb3de30e72704bc266e5810", "0x1d040f622e3d5f614b675c351ba6e8f52d3af1a6e8debdcb3ae50a84b9ced4ad"], ["0x20b425db6874338a60ff44735bc58a736a00abd792f103e51bb1af4e4f031070", "0x20f021b842b7d857ba18d5dbd70c0a93d8cc1b1543d96ba75be806deb2af8484"]],
            "c": ["0x24f773a49ab9c00f52b5a1389337d99b9bc4e8553a6572cc48cb0b97b29f9433", "0x12981ed4fcb4394c180d2919d7e7e721a7602849083f6f5dc916a9515e0ef0fd"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000000000000000000000000001"]

    };

    describe('Zokrates verifier proof tests', function () {
        beforeEach(async function () { 
            zokratesVerifier = await ZokratesVerifier.new({from: owner});
        })

        it('verification with correct proof', async function () { 
            let tx = await zokratesVerifier.verifyTx(correct.proof.a, correct.proof.b, correct.proof.c, correct.inputs);

            truffleAssert.eventEmitted(tx, 'Verified', (ev) => {
                return true;
            }, 'Zokrates verification failed with correct proof');
        })

        it('verification fails with incorrect proof', async function () { 
            let tx = await zokratesVerifier.verifyTx(incorrect.proof.a, incorrect.proof.b, incorrect.proof.c, incorrect.inputs);

            try {
                truffleAssert.eventEmitted(tx, 'Verified', (ev) => {
                    return false;
                }, 'Zokrates verified incorrect proof');

            } catch(e) {
                // No event emitted throws
                assert(true);
            }

        })

    });

});
