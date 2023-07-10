require('dotenv').config()
const { Web3 } = require('web3');
const Tx = require("ethereumjs-tx");
const BigNumber = require('bignumber.js');
const ethers = require('ethers')

let web3 = new Web3('https://mainnet.infura.io/v3/550129ac336a48789ab8993e35ad699a');

const period = process.env.REACT_APP_PERIOD
const position = process.env.REACT_APP_MIN_POSITION
const threshold = process.env.REACT_APP_PROFIT_THRESHOLD

const privateKey = new Buffer.from(process.env.REACT_APP_PRIVATE_KEY, "hex");

let provider = new ethers.getDefaultProvider('https://mainnet.infura.io/v3/550129ac336a48789ab8993e35ad699a')
let signer = new ethers.Wallet(privateKey, provider)
let gasPrice = 11000000000
let gasLimit = 1000000

let nonce
async function getNonce(){
  nonce = await web3.eth.getTransactionCount(signer.address)
}
getNonce()
let counter = 0;

/** PANCAKE SWAP */
const PancakeSwapAbi = require('./uniswapv2Abi.json');

const Erc20Abi = require('./erc20.json');

/** SUSHI SWAP */

const BurgerSwapAbi = require('./BurgerSwapAbi.json')

const arbContractAddress = "0x8b650b9232aF12e9f0B1d75289b8E36EaDdC5d0B";
let tradingAgent = new ethers.Contract(
  arbContractAddress,
  ['function sellBuyOptimized(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _position) public'],
  signer
);

let oneEth = position

async function run_wbnb(token1, token2, token_name, pancakeAddress, burgerAddress){
  const PancakeSwapContractInstance = new web3.eth.Contract(PancakeSwapAbi, pancakeAddress);

  const BurgerSwapContractInstance = new web3.eth.Contract(BurgerSwapAbi, burgerAddress);

  var path = [];
  path.push(token1);
  path.push(token2);
  try{
    const erc20ContractInstance = new web3.eth.Contract(Erc20Abi, token2);

    const decimals = await erc20ContractInstance.methods.decimals().call();

    const dex1 = await PancakeSwapContractInstance.methods.getAmountsOut(oneEth.toString(), path).call();

    pancakeSellPriceBURGER = dex1[1];
    path = [];
    path.push(token2);
    path.push(token1);
    try{
      const dex2 = await BurgerSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER.toString().replace('n',''), path).call();
      pancakeBurgerBURGER = dex2[1];
      if (Number(pancakeBurgerBURGER)/oneEth > threshold){
        console.log("Uniswap -> Sushi ratio: ", token_name, Number(pancakeBurgerBURGER)/oneEth)
        trade(pancakeAddress, burgerAddress, token2)
      }
    }catch(e){
      // console.log("path: ", path);
      // console.log("dex2 e: ", e);
    }
    
  }catch(e){
    // console.log("path: ", path);
    // console.log("dex 1e: ", e);
  }

  try{
    path = [];
    path.push(token1);
    path.push(token2);
    const dex1 = await BurgerSwapContractInstance.methods.getAmountsOut(oneEth.toString(), path).call();
    pancakeSellPriceBURGER = dex1[1];
    path = [];
    path.push(token2);
    path.push(token1);
    try{
      const dex2 = await PancakeSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER.toString().replace('n',''), path).call();
      pancakeBurgerBURGER = dex2[1];
      if (Number(pancakeBurgerBURGER)/oneEth > threshold){
        console.log("Sushi -> Uniswap ratio: ", token_name, Number(pancakeBurgerBURGER)/oneEth)
        trade(burgerAddress, pancakeAddress, token2)
      }
    }catch(e){
      // console.log("path: ", path);
      // console.log("2-dex2 e: ", e);
    }
    
  }catch(e){
    // console.log("path: ", path);
    // console.log("dex 1e: ", e);
  }
}

function tokensLoop(tokensFile, dex1, dex2){
  let { tokens } = require(tokensFile);
  for (token in tokens){
    // console.log("tokens[token]: ", tokens[token])
    if (tokens['WETH'] != tokens[token]){
      run_wbnb(tokens['WETH'], tokens[token], token, dex1, dex2);
    } 
  }
}

tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_2);
tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_3);
tokensLoop('./Tokens.js', process.env.DEX_2, process.env.DEX_3);
tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_4);
tokensLoop('./Tokens.js', process.env.DEX_2, process.env.DEX_4);
tokensLoop('./Tokens.js', process.env.DEX_3, process.env.DEX_4);

setInterval(function(){
  tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_2);
  tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_3);
  tokensLoop('./Tokens.js', process.env.DEX_2, process.env.DEX_3);
  tokensLoop('./Tokens.js', process.env.DEX_1, process.env.DEX_4);
  tokensLoop('./Tokens.js', process.env.DEX_2, process.env.DEX_4);
  tokensLoop('./Tokens.js', process.env.DEX_3, process.env.DEX_4);

}, period);

console.log("loading data...")

async function trade(dexBuy, dexSell, token) {
	console.log("trading wbnb");
	//gasFees = 317157*web3.utils.fromWei(gasPrice, "wei")
	// gasFees = gasPrice * gasLimit - 50000
	// console.log("WBNB: ", tokens['WETH']);
  console.log("dexBuy: ", dexBuy);
	console.log("dexSell: ", dexSell);
	console.log("token: ", token);

}
