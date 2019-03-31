/* eslint-disable no-console */
import mapping from './char_mapping'
import { predictGender } from "./predict-gender";
import * as tf from '@tensorflow/tfjs';

const DATA_LIMIT = 2000;

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

export default class engineAI {
    static data;

    static init() {
        console.log('ai engine init');
        return new Promise((resolve) => {
            console.log('loading data...');
            fetch('https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/data/data.json')
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.data = preprocess(data.slice(0, DATA_LIMIT))
                resolve()
            })
        })
    }



    static predictGender(){
        return new Promise((resolve, reject) => {
            predictGender(this.data, tf)
                .then(predictions => resolve(predictions))
                .catch(err => reject(err))
        })
        
    }
}

function preprocess(data){

    // group tweets by user    
    var userTweets = {};
    data.forEach(tweet => {
        const user = tweet.author;
        if(!user) console.log(tweet);
        if(!userTweets[user.username]) userTweets[user.username] = [];
        userTweets[user.username].push(tweet.body);
    });

    console.log('predicting ' + Object.keys(userTweets).length + ' users');
    console.log('preprocessing...');

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
        userTweets[user] = tf.stack(userTweets[user])
    }
    return userTweets;
}

function tokenize(tweet) {
    var chars = tweet.split('');
    chars = chars.map(char => (mapping[char]) ? mapping[char] : mapping['+']); // map
    chars = chars.slice(0,TWEET_LENGTH) // truncate 
    // console.log(chars);
    // chars = chars.map(char => char.padEnd(TWEET_LENGTH, '0'))
    // console.log(chars);
    chars = tf.oneHot(chars, NUMBER_OF_CHARS); // vectorize
    var padding = [[0, Math.abs(60 - chars.shape[0])] , [0,0]] // [[firstD] , [secondD]]
    chars = chars.pad(padding); // 
    // console.log(chars.shape);   
    return chars;
}