/* eslint no-console: 0 */ 
// import data from '../data/data.json'
import mapping from './char_mapping'
import * as tf from '@tensorflow/tfjs'

const NUMBER_OF_CHARS = 92;
const TWEET_LENGTH = 60;

function preprocess() {
    // group tweets by user
    const dataset = require('../data/data.json').slice(0, 200);

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
    return userTweets;
}

function predictGender(data){
    return new Promise(function (resolve, reject) {
        tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/codes/models/gender3/model.json")
            .then(model => {
                console.log('loaded!'); 
                var allPredictions = []   
                for (const user in data) {
                    console.log('predicting ' + user);
                    const prediction = model.predict(data[user]);
                    // console.log(await prediction.array());
                
                    prediction.array()
                        .then(result => {
                            const predictions =  result.map(array => array[0]);
                            var sum = 0;
                            predictions.forEach(p => sum = sum+p);
                            allPredictions.push({
                                user,
                                average: sum/predictions.length,
                                gender: (sum/predictions.length<0.5) ? 'male' : 'female',
                                predictions
                            });
                            // console.log(allPredictions);
                            resolve(allPredictions)
                        })
                        .catch(err => {
                            console.log('Failed exporting the predictions to an array');
                            reject(err);
                        })
                }
                        })
            .catch(err => {
                console.log('Failed loading the model');
                reject(err);
            })
    })
}


    // SUCCESSS
    // const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-examples/mnist-acgan/dist/generator/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/simple/model.json")
    
    
    // FAIL
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender2/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender_classification/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/gh-pages/serve/gender_classification/model.json")

    // console.log(prediction);


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



export { preprocess, predictGender, test };