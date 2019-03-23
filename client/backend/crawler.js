/* eslint-disable no-console */
import Twitter from "twitter";

export default class SearchEngine {
    static client;

    static init() {
        this.client = new Twitter({
            consumer_key: 'CAFQUfr5Tw3rYhTdEXl1x350M',
            consumer_secret: '3DouNQo4oEaLStSSWORJB3EQrX5FIg9k7DTvpYJTLAKETeqnEk',
            access_token_key: '1096400473060327426-pLF9C8lFvtwOvsJOyP1zSVxQiZ9xz1',
            access_token_secret: 'oczm1RtGSSnU1uTwPBwfxXtewYwi3Duev16qZKn70i3eZ'
        })  
        var params = {screen_name: 'nodejs'};
        this.client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
        });
    }

    static crawl(query) {
        var params = {screen_name: 'nodejs'};
        this.client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
        });
    }
}
