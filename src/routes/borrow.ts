import { Router } from 'express';
import TastytradeClient, { CandleType, MarketDataStreamer, MarketDataSubscriptionType } from "@tastytrade/api"
import { TastyClient } from '../services/tastyclient';


export const borrowRoute = Router();

interface Equity {
  ['borrow-rate']: string;
  symbol: string;
}


// instrument-type Equity, Equity Option, 

borrowRoute.get('/borrow', async (req, res) => {

  const etps = ['UVXY', 'VXX', 'VIXY', 'VIXM']

  const tastyClient = req.app.locals.tastyClient as TastyClient;
  const client = await tastyClient.client();

  const asyncRes = await Promise.all(etps.map(async (i) => {
    const equity = await client.instrumentsService.getSingleEquity(i) as Equity;
    return {name: equity.symbol, borrow: equity['borrow-rate']}
  }));

  res.json(asyncRes)
});
