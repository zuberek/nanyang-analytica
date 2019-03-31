/* eslint-disable no-console */
import mapping from './char_mapping'
import { predictGender } from "./predict-gender";
import * as tf from '@tensorflow/tfjs';

const DATA_LIMIT = 1000;

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

export default class engineAI {
    static data;
    // static tf;

    static init() {
        return new Promise((resolve) => {
            import('../data/data.json')
                .then(data => {
                    var min = [];
                    for (const key in data) {
                        min.push(data[key])
                        if(min.length > DATA_LIMIT-1) break
                    }
                    this.data = min;
                    resolve(true);

                    // import('@tensorflow/tfjs')
                    //     .then(tf => {
                    //         this.tf = tf;
                    //         resolve(true);
                    //     })
                })
        })
    }

    static preprocess(){

        // group tweets by user    
        var userTweets = {};
        this.data.forEach(tweet => {
            const user = tweet.author;
            if(!user) console.log(tweet);
            if(!userTweets[user.username]) userTweets[user.username] = [];
            userTweets[user.username].push(tweet.body);
        });
    
        console.log(Object.keys(userTweets).length + ' users');
    
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

    static predictGender(data){
        return new Promise((resolve, reject) => {
            predictGender(data, tf)
                .then(predictions => resolve(predictions))
                .catch(err => reject(err))
        })
        
    }
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