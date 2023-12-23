import { Router } from 'express';
import TastytradeClient, { CandleType, MarketDataStreamer, MarketDataSubscriptionType } from "@tastytrade/api"


export const defaultRoute = Router();

defaultRoute.get('/quotes', async (req, res) => {

  const tastytradeClient = new TastytradeClient(process.env.BASE_URL, process.env.ACCOUNTSTREAMERURL)
  await tastytradeClient.sessionService.login(process.env.usernameOrEmail, process.env.password)
  const tokenResponse = await tastytradeClient.accountsAndCustomersService.getApiQuoteToken()
  
  
  const streamer = new MarketDataStreamer()
  streamer.connect(tokenResponse['dxlink-url'], tokenResponse.token)

  function handleMarketDataReceived(data: any) {
    // Triggers every time market data event occurs
    console.log(data)
  }

  // Add a listener for incoming market data. Returns a remove() function that removes the listener from the quote streamer
  const removeDataListener = streamer.addDataListener(handleMarketDataReceived)

  // Subscribe to a single equity quote
  //streamer.addSubscription('AAPL')

  // Subscribe to a single equity option quote
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - 5);


  //const optionChain = await tastytradeClient.instrumentsService.getOptionChain('AAPL');
  streamer.addCandleSubscription('AAPL', fromDate.valueOf(), {period: 5, type: CandleType.Minute, channelId: 1})
   

    //res.render('index', {data: {}});
});
