// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {

  constructor() ERC20("WagerCoin", "WC") {
  }

  function mint(address account, uint256 amount) public onlyOwner {
		_mint(account, amount);
	}

  function burn(address account, uint256 amount) public onlyOwner {
    _burn(account, amount);
  }
}

// 0x48c5f59c83Befb0b0E80682Cc4D4D52Ad13f8BB7 - Token
// 0xEE91650A006F050855A37dB918Dc2f0e2D1cd469 - Hello

/*
(0) 0xd6d62030633191b8Df8105deA6D1bfb381238a08 (100 ETH)
(1) 0xb158274E62acCd189FE185AC4CF08c49Fc05E56C (100 ETH)
(2) 0x70e95dC1b7b2EFCb9D85169918134F5D01256c71 (100 ETH)
(3) 0x3Da445419260bC60927c15B039049ACF9e8Eb77A (100 ETH)
(4) 0xCc47b05a3253f5b98e60eC7332DdFEDD4bC864D0 (100 ETH)
(5) 0x6855df094F899DFc3dC3A4F2f9F9dABFa871abb8 (100 ETH)
(6) 0xF559B91060aBeB218E1EaE6EaD65Ab08E4FBa58A (100 ETH)
(7) 0xCC70655a45c76B5E6016A2EC8A28E588911D4eD6 (100 ETH)
(8) 0xbb182B3679cC834e01cBC18aE03E3577eb101466 (100 ETH)
(9) 0x5f506c3d300A936EA015e88917cD715b3F4FA7C0 (100 ETH)

Private Keys
==================
(0) 0x7249c6a601c45e5fc487953809a2211d086229d0efe9091b8959a2d331a77b55
(1) 0x2118977191b97ad5d828779963093012a896fcc37061a05cddd0db35fefe6d14
(2) 0xb6500ae7872703338599c7977c036c47522f24aae8569a5b3478e9d375a48b55
(3) 0xdbc1c12185533ac328d36c9eb00a572e6dabb43691f4f0eb2c6a84403a722dda
(4) 0xf96c43efeb6d747c3da95e486faec34862e87070c7a5b439e145efcb64960850
(5) 0x34baa1a2471cda95fdd071fa483eab5afa00a615d8eb6c70bd4a64b416fd7cca
(6) 0x1341eb75c6fc2f7df15edab87ebad64c82288e92c98d714e2ef66aaac69034dc
(7) 0x94b9dba0653e0390671100900ef4fe8cba1f03d74468ccd600347287c28a1271
(8) 0x1143ad0733a81db5fffc3247566d1f3b378fdf4050a6159c8dcd50e8539e5321
(9) 0x7fc92ba5f53ebd5e6fb05eea7b7c793a7a98538959b25e127153bf1562e029cf

HD Wallet
==================
Mnemonic:      history coast need upset replace cloud describe rapid spike corn heavy scorpion
*/