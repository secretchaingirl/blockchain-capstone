//
// Mint some tokens
//

const fs = require('fs')
const ERC721MintableComplete = JSON.parse(fs.readFileSync('./build/contracts/ERC721MintableComplete.json'))

const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const NFT_ABI = ERC721MintableComplete.abi
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const NUM_TOKENS = 5

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (NFT_CONTRACT_ADDRESS) {
        const contract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        const zokrates = {
            "proof": {
                "a": ["0x2032a7cdce1a03bee97fb39e9f160f429277813fea425ec99adbd701288d54c2", "0x234fa79cfd5ebae8927a35dd36bb37957051a7c429608bc3e795bd64713b8d68"],
                "b": [["0x0ce925b54b8ec0f874a1a59f9ac333bac98518e7adb3de30e72704bc266e5810", "0x1d040f622e3d5f614b675c351ba6e8f52d3af1a6e8debdcb3ae50a84b9ced4ad"], ["0x20b425db6874338a60ff44735bc58a736a00abd792f103e51bb1af4e4f031070", "0x20f021b842b7d857ba18d5dbd70c0a93d8cc1b1543d96ba75be806deb2af8484"]],
                "c": ["0x24f773a49ab9c00f52b5a1389337d99b9bc4e8553a6572cc48cb0b97b29f9433", "0x12981ed4fcb4394c180d2919d7e7e721a7602849083f6f5dc916a9515e0ef0fd"]
            },
            "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
        };

        for (var i = 0; i < NUM_TOKENS; i++) {
            const result = await contract.methods.mint
                                                    (
                                                        zokrates.proof.a,
                                                        zokrates.proof.b,
                                                        zokrates.proof.c,
                                                        zokrates.inputs
                                                    ).send({ from: OWNER_ADDRESS });

            console.log("Minted token. Transaction: " + result.transactionHash)
        }
    }
}

main()