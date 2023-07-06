require('dotenv').config()
const { Web3 } = require('web3');
const Tx = require("ethereumjs-tx");
const BigNumber = require('bignumber.js');
const ethers = require('ethers')

let web3 = new Web3('https://mainnet.infura.io/v3/550129ac336a48789ab8993e35ad699a');
// let web3 = new Web3('https://rpc.ankr.com/eth');

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

const { tokens } = require('./TokensETH.js');

/** PANCAKE SWAP */
const PancakeSwapAbi = require('./uniswapv2Abi.json');

// const PancakeSwapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const PancakeSwapAddress = process.env.DEX_1; 
const PancakeSwapContractInstance = new web3.eth.Contract(PancakeSwapAbi, PancakeSwapAddress);

/** SUSHI SWAP */

const BurgerSwapAbi = require('./BurgerSwapAbi.json')
const BurgerSwapAddress = process.env.DEX_2; 

const BurgerSwapContractInstance = new web3.eth.Contract(BurgerSwapAbi, BurgerSwapAddress);

const arbContractAddress = "0x552f8ea9d4dB31D3b4C1ddA689B2d636DdEEA345";
let tradingAgent = new ethers.Contract(
  arbContractAddress,
  ['function sellBuyOptimized(address _bnb, address _token, address _pancake, address _burger, uint256 _gasFees, uint256 _position) public'],
  signer
);

let oneEth = position

async function run_wbnb(token1, token2, token_name){

  var path = [];
  path.push(token1);
  path.push(token2);
  try{
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
        trade(PancakeSwapAddress, BurgerSwapAddress, token2)
      }
    }catch(e){
      console.log("path: ", path);
      console.log("dex2 e: ", e);
    }
    
  }catch(e){
    console.log("path: ", path);
    console.log("dex 1e: ", e);
  }
  
  // PancakeSwapContractInstance.methods.getAmountsOut(oneEth, path).call(function(err, res) {
  //   if (err) {
  //       console.log("err: ", err);
  //       // return;
  //   }
  //   pancakeSellPriceBURGER = res[1];
  //   path = [];
  //   path.push(token2);
  //   path.push(token1);
  //   BurgerSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER, path).call(function(err, res) {
  //     if (err) {
  //         console.log("err 2: ", err);
  //         // return;
  //     }
  //     pancakeBurgerBURGER = res[1];
  //     if (pancakeBurgerBURGER/oneEth > threshold){
  //       console.log("Pancake -> Sushi ratio: ", token_name, pancakeBurgerBURGER/oneEth)
  //       trade(PancakeSwapAddress, BurgerSwapAddress, token2)
  //     }
  //   });
  // });
  // var path = [];
  // path.push(token1);
  // path.push(token2);
  // BurgerSwapContractInstance.methods.getAmountsOut(oneEth, path).call(function(err, res) {
  //   if (err) {
  //       // return;
  //   }
  //   pancakeSellPriceBURGER = res[1];
  //   path = [];
  //   path.push(token2);
  //   path.push(token1);
  //   PancakeSwapContractInstance.methods.getAmountsOut(pancakeSellPriceBURGER, path).call(function(err, res) {
  //     if (err) {
  //         // return;
  //     }
  //     pancakeBurgerBURGER = res[1];
  //     // console.log("BurgerSwap --> PancakeSwap ")
  //     // console.log("token1: ", token1)
  //     // console.log("token2: ", token2)
  //     counter = counter + 1

  //     if (pancakeBurgerBURGER/oneEth > threshold){
  //       console.log("Sushi --> Pancake ratio", token_name, ": ",pancakeBurgerBURGER/oneEth)
  //       trade(BurgerSwapAddress, PancakeSwapAddress, token2)
  //     }
  //   });
  // });
}

for (token in tokens){
  // console.log("tokens[token]: ", tokens[token])
  if (tokens['WETH'] != tokens[token]){
    run_wbnb(tokens['WETH'], tokens[token], token);
  } 
}

setInterval(function(){
  for (token in tokens){
    // console.log("tokens[token]: ", tokens[token])
    if (tokens['WETH'] != tokens[token]){
      run_wbnb(tokens['WETH'], tokens[token], token);
    } 
  }
}, period);

console.log("loading data...")

async function trade(dexSell, dexBuy, token) {
	console.log("trading wbnb");
	//gasFees = 317157*web3.utils.fromWei(gasPrice, "wei")
	// gasFees = gasPrice * gasLimit - 50000
	console.log("WBNB: ", tokens['WETH']);
	console.log("dexSell: ", dexSell);
	console.log("dexBuy: ", dexBuy);
	console.log("token: ", token);

}
