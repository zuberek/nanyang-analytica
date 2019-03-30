/* eslint no-console: 0 */ 
// import data from '../data/data.json'
import mapping from './char_mapping'
import * as tf from '@tensorflow/tfjs'

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

async function preprocess(){
    // group tweets by user
    const dataset = require('../data/data.json').slice(0, 5000);

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


        userTweets[user] = tf.stack(userTweets[user])
    }

    const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender3/model.json")
    console.log('loaded!'); 
    var allPredictions = []   
    for (const user in userTweets) {
        console.log('predicting ' + user);
        const prediction = model.predict(userTweets[user]);
        // console.log(await prediction.array());
    
        const result = await prediction.array();
        const predictions =  result.map(array => array[0]);
        var sum = 0;
        predictions.forEach(p => sum = sum+p);
        allPredictions.push({
            user,
            average: sum/predictions.length,
            gender: (sum/predictions.length<0.5) ? 'male' : 'female',
            predictions
        });
    }

    console.log(allPredictions);

    // SUCCESSS
    // const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-examples/mnist-acgan/dist/generator/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/simple/model.json")
    
    
    // FAIL
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender2/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender_classification/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/gh-pages/serve/gender_classification/model.json")

    // console.log(prediction);
}

function test() {
    var x = tf.tensor1d([1, 2, 3, 4]);
    // x.print();
    // x.pad([[1, 2]]).print();

    x = tf.tensor1d([1, 2, 3, 4]);
    x.reshape([2, 2, 1]).print();
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



export { preprocess, test };