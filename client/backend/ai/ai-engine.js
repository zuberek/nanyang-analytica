/* eslint-disable no-console */
import mapping from './char_mapping'

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

export default class engineAI {
    static tf;
    static data;

    static init() {
        import('@tensorflow/tfjs')
            .then(tf => {
               this.tf = tf;

               import('../data/data.json')
                .then(data => {
                    this.data = data;
                })
            })
    }

    static preprocess(){
        // group tweets by user
        const dataset = this.data;
    
        var userTweets = {};
        dataset.forEach(tweet => {
            const user = tweet.author;
            if(!userTweets[user.username]) userTweets[user.username] = [];
            userTweets[user.username].push(tweet.body);
        });
    
        console.log(userTweets);
    
        for (const user in userTweets) {
            var tweets = userTweets[user];
            userTweets[user] = tweets.map(tweet => {
                tweet = tokenize(tweet);
                return tweet;
            })
    
            // var monster = tf.oneHot(userTweets[user], NUMBER_OF_CHARS); // vectorize
            // console.log(monster.shape);
            // var padding = [[0, Math.abs(60 - chars.shape[0])] , [0,0]] // [[firstD] , [secondD]]
            // chars = chars.pad(padding); // 
            // reshape
            // userTweets[user] = userTweets[user].reshape([1, TWEET_LENGTH, NUMBER_OF_CHARS]).print();
            userTweets[user] = this.tf.stack(userTweets[user])
        }
        return userTweets;
    }
}

function tokenize(tweet) {
    var chars = tweet.split('');
    chars = chars.map(char => (mapping[char]) ? mapping[char] : mapping['+']); // map
    chars = chars.slice(0,TWEET_LENGTH) // truncate 
    // console.log(chars);
    // chars = chars.map(char => char.padEnd(TWEET_LENGTH, '0'))
    // console.log(chars);
    chars = this.tf.oneHot(chars, NUMBER_OF_CHARS); // vectorize
    var padding = [[0, Math.abs(60 - chars.shape[0])] , [0,0]] // [[firstD] , [secondD]]
    chars = chars.pad(padding); // 
    // console.log(chars.shape);   
    return chars;
}