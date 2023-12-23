import TastytradeClient from "@tastytrade/api"

export class TastyClient {

    _client: TastytradeClient;

    public async login(): Promise<void> {
        this._client = new TastytradeClient(process.env.BASE_URL, process.env.ACCOUNTSTREAMERURL)
        await this._client.sessionService.login(process.env.usernameOrEmail, process.env.password)
    }

    public async token(): Promise<any> {
        return await this._client.accountsAndCustomersService.getApiQuoteToken()
    }

    public async client(): Promise<TastytradeClient> {
        if(this._client === undefined || !this._client.session.isValid) 
            await this.login();
        return this._client;
    }
} 
