pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./ERC721Mintable.sol";

contract ZokratesVerifier {
    function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public returns (bool r);
}

contract ERC721MintableComplete is ERC721Mintable {

    using SafeMath for uint256;

    ZokratesVerifier zokratesVerifier;

    struct Solution {
        uint256 _index;
        address _verifier;
    }

    uint256 private _solutionCount = 1;

    uint256 private _tokenId = 1;

    mapping (bytes32 => Solution) private _solutions;

    event SolutionAdded(address verifier);

    constructor(address _verifier)
                            public ERC721Mintable
                                            (
                                                "Udacity Blockchain Capstone Real Estate Property Token",
                                                "UBCREPT",
                                                "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
                                            ) {
        zokratesVerifier = ZokratesVerifier(_verifier);
    }

    function addSolution(address _verifier, bytes32 _proof) internal returns (bool) {

        Solution memory _solution = Solution(_solutionCount, _verifier);

        _solutions[_proof] = _solution;
        emit SolutionAdded(_verifier);

        _solutionCount = _solutionCount.add(1);

        return true;
    }

    function mint
                (
                    uint[2] memory a,
                    uint[2][2] memory b,
                    uint[2] memory c,
                    uint[2] memory inputs
                )
                public
                onlyOwner
                returns (uint256) {

        // Create a unique keccak256 hash of the incoming proof
        bytes32 _proof = keccak256(abi.encodePacked(a, b, c, inputs));

        if (zokratesVerifier.verifyTx(a, b, c, inputs)) {
            if (_solutions[_proof]._index <= 0) {
                addSolution(msg.sender, _proof);
            }

            super.mint(msg.sender, _tokenId);
            _tokenId = _tokenId.add(1);

            return(_tokenId);
        }
    }
}
