import { Router } from 'express';
import TastytradeClient, { CandleType, MarketDataStreamer, MarketDataSubscriptionType } from "@tastytrade/api"
import { TastyClient } from '../services/tastyclient';


export const accountsRoute = Router();

interface Position {
  symbol: string;
  ['underlying-symbol']: string;
  quantity: number;
  ["quantity-direction"]: string;
  ["instrument-type"]: string;
  ["average-open-price"]: string;
}

interface Balance {
  ["cash-balance"]: string;
  ["net-liquidating-value"]: string;

}

// instrument-type Equity, Equity Option, 

accountsRoute.get('/accounts', async (req, res) => {
  const tastyClient = req.app.locals.tastyClient as TastyClient;
  const client = await tastyClient.client();

  const accounts = await client.accountsAndCustomersService.getCustomerAccounts();
  console.log(accounts)

  const positions = await client.balancesAndPositionsService.getPositionsList(accounts[0].account['account-number']) as Position[];
  const balance = await client.balancesAndPositionsService.getAccountBalanceValues(accounts[0].account['account-number']) as Balance;

  console.log(positions);
  console.log(balance);

  const positionsFormatted = positions.map( pos => {
    return { symbol: pos.symbol, underlying: pos['underlying-symbol'], direction: pos['quantity-direction'], quantity: pos.quantity, openPrice: Number(pos['average-open-price'])}
  });

  const balanceFormatted = { cash: Number(balance['cash-balance']), netliq: Number(balance['net-liquidating-value'])};


  res.json({positions: positionsFormatted, balance: balanceFormatted });
});
