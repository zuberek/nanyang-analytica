/* eslint no-console: 0 */ 
// import data from '../data/data.json'
import mapping from './char_mapping'
import * as tf from '@tensorflow/tfjs'

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

function preprocess(){
    // group tweets by user
    const dataset = require('../data/data.json').slice(0, 10);

    var userTweets = {};
    dataset.forEach(tweet => {
        const user = tweet.author;
        if(!userTweets[user.username]) userTweets[user.username] = [];
        userTweets[user.username].push(tweet.body);
    });

    for (const user in userTweets) {
        var tweets = userTweets[user];

        tweets = tweets.map(tweet => {
            tweet = encode(tweet);
            return tweet;
        })
    }
}

function test() {
    const x = tf.tensor1d([1, 2, 3, 4]);
    x.print();
    x.pad([[1, 2]]).print();
}

function encode(tweet) {
    var chars = tweet.split('');
    chars = chars.map(char => (mapping[char]) ? mapping[char] : mapping['+']); // map
    chars = chars.slice(0,TWEET_LENGTH) // truncate 
    chars = tf.oneHot(chars, NUMBER_OF_CHARS); // vectorize
    var padding = [[0, Math.abs(60 - chars.shape[0])] , [0,0]] // [[firstD] , [secondD]]
    chars = chars.pad(padding); // 
    console.log(chars.shape);   
    return chars;
}



export { preprocess, test };