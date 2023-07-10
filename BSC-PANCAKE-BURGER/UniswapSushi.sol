
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

abstract contract Pancake {

	function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        payable
        returns (uint[] memory amounts);

    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        returns (uint[] memory amounts);
}

contract ERC20 {
	function approve(address, uint256) external returns (bool) {}
}

/**
 * MAIN CONTRACT
 */

contract ArbBot {

	address payable public owner;
	address public trader;

	constructor(address _trader) {
		owner = msg.sender;
		trader = _trader;
	}

	modifier onlyOwner() {
		require (msg.sender == owner);
		_;
	}

	modifier onlyTrader() {
		require (msg.sender == trader);
		_;
	}

	function withdrawAll() external onlyOwner {
		owner.transfer(address(this).balance);
	}

	function balanceETH() public view returns(uint256) {
		return address(this).balance;
	}

	function transferOwnership(address payable _owner) onlyOwner public {
		owner = _owner;
   	}

	function setTrader(address _trader) onlyOwner public {
		trader = _trader;
   	}

	function approve(address _token, address payable _uni, uint256 _amount) internal {
        ERC20 token = ERC20(_token);
        token.approve(_uni, _amount);
    }

	function sellBuyOptimizedUnprofitable(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _position) onlyTrader public {
      require(_position + _gasFees > sellBuyTransaction(_bnb, _token, _pancake, _burger, _position) , "Unprofitable trade !");
  	}

	function sellBuyOptimized(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _position) onlyTrader public {
      require(_position + _gasFees < sellBuyTransaction(_bnb, _token, _pancake, _burger, _position) , "Unprofitable trade !");
    }

    // ETH-ETH
	function sellBuyTransaction(address _bnb, address _token, address _pancake, address _burger, uint256 _value) public returns(uint256){

    	Pancake burger;
    	Pancake pancake;

    	address[] memory path = new address[](2);

    	pancake = Pancake(_pancake);
    	burger = Pancake(_burger);

        path[0] = _bnb;
        path[1] = _token;

        address payable dex = payable(_pancake);

        approve(path[0], dex, _value);
        approve(path[1], dex, _value);

        uint256[] memory tokensBoughtActual = pancake.swapExactETHForTokens
                                          {value: _value}({
                                              amountOutMin: 0,
                                              path: path,
                                              to: address(this),
                                              deadline: block.timestamp + 1000
                                          });
        path[0] = _token;
        path[1] = _bnb;

        dex = payable(_burger);

        approve(path[0], dex, tokensBoughtActual[1]);
        approve(path[1], dex, tokensBoughtActual[1]);

        uint256[] memory amounts = burger.swapExactTokensForETH({
        															amountIn: tokensBoughtActual[1],
        															amountOutMin: 0,
        															path: path,
        															to: address(this),
        															deadline: block.timestamp + 1000
        														});
        return amounts[1];
	}

	receive() external payable {}
}

//deployed: 0x7412cAE11e3b891Ac38762B8b16DBf0566a56F75
//        : 0x22B26E1842f2b005e4134Cf377A428779A469145
