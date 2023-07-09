require('dotenv').config()
// const Web3 = require('web3');
const { Web3 } = require('web3');
const Tx = require("ethereumjs-tx");
const BigNumber = require('bignumber.js');
const ethers = require('ethers')

let web3 = new Web3('https://mainnet.infura.io/v3/5272a42e45da4883b505bd3af95c2af9');

let period = process.env.REACT_APP_PERIOD
const position = process.env.REACT_APP_MIN_POSITION
const threshold = process.env.REACT_APP_PROFIT_THRESHOLD

const privateKey = new Buffer.from(process.env.REACT_APP_PRIVATE_KEY, "hex");

let provider = new ethers.getDefaultProvider('https://mainnet.infura.io/v3/5272a42e45da4883b505bd3af95c2af9')
let signer = new ethers.Wallet(privateKey, provider)
let gasPrice = 11000000000
let gasLimit = 1000000

let nonce
async function getNonce(){
  nonce = await web3.eth.getTransactionCount(signer.address)
}
getNonce()
let counter = 0;

const { tokens } = require('./TokensETH.js');

/** PANCAKE SWAP */
const PancakeSwapAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

const PancakeSwapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const PancakeSwapContractInstance = new web3.eth.Contract(PancakeSwapAbi, PancakeSwapAddress);

/** SUSHI SWAP */

const BurgerSwapAbi =[{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}];
const BurgerSwapAddress = "0x9AAb3f75489902f3a48495025729a0AF77d4b11e";
const BurgerSwapContractInstance = new web3.eth.Contract(BurgerSwapAbi, BurgerSwapAddress);

const arbContractAddress = "0x7412cAE11e3b891Ac38762B8b16DBf0566a56F75";
let tradingAgent = new ethers.Contract(
  arbContractAddress,
  [
   'function sellBuyOptimized(address _bnb, address _token1, address _token2, address _pancake, address _burger, uint256 _gasFees, uint256 _interface) public'],
  signer
);

const arbContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bnb",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_pancake",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_burger",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_gasFees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_position",
				"type": "uint256"
			}
		],
		"name": "sellBuyOptimized",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bnb",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_pancake",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_burger",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_gasFees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_position",
				"type": "uint256"
			}
		],
		"name": "sellBuyOptimizedUnprofitable",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "withdrawAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "balanceBNB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "buffer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "trader",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


let oneEth = position

async function run_wbnb(token1, token2, token_name){
	// console.log("run_wbnb: ", run_wbnb);

	var path = [];
	path.push(token1);
	path.push(token2);
	let res
	try{
		// console.log("path: ", path)
		res = await PancakeSwapContractInstance.methods.getAmountsOut(oneEth, path).call();
		// console.log("res: ", res);
	}catch(e){
		console.log("line 214");
		console.log("e: ", e);
		
	}
	
    // if (err) {
    //     // return;
    // }
    pancakeSellPriceBURGER = res[1];
    // console.log("Pancake -> Sushi pancakeSellPriceBURGER: ", pancakeSellPriceBURGER)
	try{
		res  = await BurgerSwapContractInstance.methods.getExpectedRate(token2, token1, pancakeSellPriceBURGER.toString().replace('n','')).call()
	}catch(e){
		console.log("line 227");
		console.log("e: ", e);	
	}
	// console.log("pancakeSellPriceBURGER: ", pancakeSellPriceBURGER);
	// console.log("res[0].toString().replace('n',''): ", res[0].toString().replace('n',''));
	// console.log("oneEth: ", oneEth);
	kyberBuyPriceDAI = new BigNumber(pancakeSellPriceBURGER.toString().replace('n','') * res[0].toString().replace('n','') / oneEth);
    console.log("Pancake -> Sushi ratio: ", token_name, kyberBuyPriceDAI/oneEth)

	if (kyberBuyPriceDAI/oneEth > threshold){
		console.log("Pancake -> Sushi ratio: ", token_name, kyberBuyPriceDAI/oneEth)
	// trade(PancakeSwapAddress, BurgerSwapAddress, token2)
	}

	var path = [];
	path.push(token1);
	path.push(token2);
	// console.log("token1: ", token1)

	try{
		res = await BurgerSwapContractInstance.methods.getExpectedRate(token1, token2, oneEth).call()
	}catch(e){
		console.log("line 247");
		console.log("e: ", e);	
	}

  	pancakeSellPriceBURGER = res[1];
    path = [];
	path.push(token2);
	path.push(token1);
	// console.log("pancakeSellPriceBURGER: ", pancakeSellPriceBURGER);

	try{
		res = await PancakeSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER.toString().replace('n',''), path).call() 
	}catch(e){
		console.log("line 260");
		console.log("e: ", e);	
	}

	pancakeBurgerBURGER = res[1];
	if (pancakeBurgerBURGER.toString().replace('n','')/oneEth > threshold){
		console.log("Sushi --> Pancake ratio", token_name, ": ", pancakeBurgerBURGER.toString().replace('n','')/oneEth)
		// trade(BurgerSwapAddress, PancakeSwapAddress, token2)
	}

//   console.log("run_wbnb: ", run_wbnb);

//   var path = [];
//   path.push(token1);
//   path.push(token2);
//   PancakeSwapContractInstance.methods.getAmountsOut(oneEth, path).call(function(err, res) {
//     if (err) {
//         // return;
//     }
//     pancakeSellPriceBURGER = res[1];
//     console.log("Pancake -> Sushi pancakeSellPriceBURGER: ", pancakeSellPriceBURGER)
//     BurgerSwapContractInstance.methods.getExpectedRate(token2, token1, pancakeSellPriceBURGER).call(function(err, res) {
//   				if (err) {
//   						// console.log("kyberBuyPriceDAI err: ", err);
//   						// return;
//   				}

// 		  kyberBuyPriceDAI = new BigNumber(pancakeSellPriceBURGER * res[0] / oneEth);
// 		  if (kyberBuyPriceDAI/oneEth > threshold){
//             console.log("Pancake -> Sushi ratio: ", token_name, kyberBuyPriceDAI/oneEth)
//             // trade(PancakeSwapAddress, BurgerSwapAddress, token2)
//           }
//   	});

//   });
//   var path = [];
//   path.push(token1);
//   path.push(token2);
//   BurgerSwapContractInstance.methods.getExpectedRate(token1, token2, oneEth).call(function(err, res) {
//     if (err) {
//         // return;
//     }

//     pancakeSellPriceBURGER = res[1];
//     path = [];
//     path.push(token2);
//     path.push(token1);
//     PancakeSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER, path).call(function(err, res) {
//       if (err) {
//         //   return;
//       }
//       pancakeBurgerBURGER = res[1];
// 	  if (pancakeBurgerBURGER/oneEth > threshold){
//         console.log("Sushi --> Pancake ratio", token_name, ": ",pancakeBurgerBURGER/oneEth)
      
//       }
//     });
//   });
}

// for (token in tokens){
//   // console.log("tokens[token]: ", tokens[token])
//   run_wbnb(tokens['WETH'], tokens[token], token)
// }

setInterval(async function(){
  console.log("start of loop")
  for (token in tokens){
    // console.log("tokens[token]: ", tokens[token])
	// try{
		// console.log("call:", token)
		if (tokens['WETH'] != tokens[token]){
			await run_wbnb(tokens['WETH'], tokens[token], token);
		}
		// console.log("end call:", token)
	// }catch(e){
	// 	console.log("call error e: ", e);
	// }
    
  }
  console.log("end of loop")

  // for (token in tokens){
  //   if (token != 'WETH'){
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 2000000000000000000)
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 1500000000000000000)
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 1000000000000000000)
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 500000000000000000)
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 400000000000000000)
  //     await trade(PancakeSwapAddress, BurgerSwapAddress, tokens[token], 300000000000000000)
  //
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 2000000000000000000)
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 1500000000000000000)
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 1000000000000000000)
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 500000000000000000)
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 400000000000000000)
  //     await trade(BurgerSwapAddress, PancakeSwapAddress, tokens[token], 300000000000000000)
  //   }
  //
  //   // run_wbnb(tokens['WBNB'], tokens[token])
  // }
  console.log("end of loop after comments")
}, period);

console.log("loading data...")

async function trade(dexSell, dexBuy, token, position) {
	// console.log("trading wbnb");
  //
	// console.log("WETH: ", tokens['WETH']);
	// console.log("dexSell: ", dexSell);
	// console.log("dexBuy: ", dexBuy);
	// console.log("token: ", token);
  // console.log("position: ", position);
  var arbitrage = new web3.eth.Contract(arbContractAbi, arbContractAddress);

  arbitrage.methods.sellBuyOptimized(tokens['WETH'],
			token,
			dexSell,
			dexBuy,
			position.toString(),
			0)
    .estimateGas(
        {
            from: signer.address,
            gasPrice: ethers.BigNumber.from(5000000000).toHexString()
        }, function(error, estimatedGas) {
            if(error){
              // console.log("Unprofitable with ", position)
            }else{
              console.log("Profitable")
              console.log("WETH: ", tokens['WETH']);
              console.log("dexSell: ", dexSell);
              console.log("dexBuy: ", dexBuy);
              console.log("token: ", token);
              console.log("position: ", position);
              // execute(dexSell, dexBuy, token, position)
            }
        }
    )
}

async function execute(dexSell, dexBuy, token, position) {
	console.log("Execution");
	console.log("WETH: ", tokens['WETH']);
	console.log("dexSell: ", dexSell);
	console.log("dexBuy: ", dexBuy);
	console.log("token: ", token);
	// try{
	// 	const tx = await tradingAgent.sellBuyOptimized(
	//    tokens['WETH'],
	// 		token,
	// 		dexSell,
	// 		dexBuy,
	// 		position.toString(),
	// 		0,
	//     {
	//       gasPrice: ethers.BigNumber.from(5000000000).toHexString(),
	//       gasLimit: ethers.BigNumber.from(1000000).toHexString(),
    //     nonce: nonce
	//     }
    // );
    // nonce = nonce + 1
	// 	console.log("sent")
	// 	console.log("tx:", tx)
	// }catch(e){
	// 		console.log("error building transaction: ", e)
	// }
}
