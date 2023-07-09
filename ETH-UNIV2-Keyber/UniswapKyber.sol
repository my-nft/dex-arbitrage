
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

contract Kyber {
	function swapEtherToToken(address token, uint256 minConversionRate) external payable returns(uint256) {}
	function swapTokenToEther(address token, uint256 srcAmount, uint256 minConversionRate) external returns(uint256) {}
}

contract ERC20 {
	// function balanceOf(address) external view returns (uint256) {}
	// function allowance(address, address) external view returns (uint256) {}
	// function transfer(address, uint256) external returns (bool) {}
	function approve(address, uint256) external returns (bool) {}
}

contract ArbBot {

	address payable public owner;
	address public trader;
	uint256 public buffer;
	Uniswap uniswap;
	Kyber kyber;

	constructor(address _trader) {
		owner = msg.sender;
		trader = _trader;
		uniswap = Uniswap("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
		kyber = Kyber("0x9AAb3f75489902f3a48495025729a0AF77d4b11e");
	}

	modifier onlyOwner() {
		require (msg.sender == owner);
		_;
	}

	modifier onlyTrader() {
		require (msg.sender == owner);
		_;
	}

	function withdrawAll() external onlyOwner {
		owner.transfer(address(this).balance);
	}

	function balanceBNB() public view returns(uint256) {
		return address(this).balance;
	}

	function approve(address _token, address payable _uni, uint256 _amount) internal {
        ERC20 token = ERC20(_token);
        token.approve(_uni, _amount);
    }

	// function sellBuyOptimizedUnprofitable(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _interface, uint256 _position) onlyTrader public {
  //     require(positionSize + _gasFees > sellBuyTransaction(_bnb, _token, _pancake, _burger, _position) , "Unprofitable trade !");
  // }
	//
	// function sellBuyOptimized(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _interface, uint256 _position) onlyTrader public {
  //     require(positionSize + _gasFees > sellBuyTransaction(_bnb, _token, _pancake, _burger, _position) , "Unprofitable trade !");
  // }

	function uniKeyber(address _token, uint256 _value, uint256 _gasFees) public onlyTrader {
    		address[] memory path = new address[](2);
        path[0] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        path[1] = _token;

        address payable dex = payable(_pancake);

        approve(path[0], dex, _value);
        approve(path[1], dex, _value);

        uint256[] memory tokensBoughtActual = uniswap.swapExactETHForTokens
                                          {value: _value}({
                                              amountOutMin: 0,
                                              path: path,
                                              to: address(this),
                                              deadline: block.timestamp + 1000
                                          });

        dex = payable(_burger);

        approve(path[0], dex, tokensBoughtActual[1]);
        approve(path[1], dex, tokensBoughtActual[1]);

        uint256 amount = kyber.swapTokenToEther({
																			token: _token,
        															srcAmount: tokensBoughtActual[1],
        															minConversionRate: 0
        														});
        require(_value + _gasFees > amount , "Unprofitable trade !");
	}

	function kyberUni(address _token, uint256 _value, uint256 _gasFees) public onlyTrader {

		dex = payable(_burger);

		approve(path[0], dex, tokensBoughtActual[1]);
		approve(path[1], dex, tokensBoughtActual[1]);

		uint256 amount = kyber.swapEtherToToken
																	{value: _value}({
																	token: _token,
																	minConversionRate: 0
																});

		address[] memory path = new address[](2);
    path[0] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    path[1] = _token;

    address payable dex = payable(_pancake);

    approve(path[0], dex, _value);
    approve(path[1], dex, _value);
		(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    uint256[] memory tokensBoughtActual = uniswap.swapExactTokensForETH
                                     ({
                                          amountIn: amount,
																					amountOutMin: 0,
                                          path: path,
                                          to: address(this),
                                          deadline: block.timestamp + 1000
                                      });

      require(_value + _gasFees > tokensBoughtActual[1] , "Unprofitable trade !");
	}

	receive() external payable {}
}
