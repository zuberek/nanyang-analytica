/* eslint-disable no-console */
import unidecode from 'unidecode';
import mapping from './char_mapping'
import * as tf from '@tensorflow/tfjs';
import extract from "../scrape/main";

const DATA_LIMIT = 200;

const VOCAB_SIZE = 41
const MAX_WORDS = 10
const MAX_CHARS = 10
const URL_REGEX = /http\S+|www.\S+/g
const MENTION_REGEX = /@\S+/g
const NON_ALPHANUMERIC_REGEX = /[^0-9a-z #@~]/g
const REPEAT_SPACE_REGEX = / +/g
const YOUNG = 0, ADULT = 1, SENIOR = 2
const EXT_MIN = 0.53, EXT_MAX = 0.63
const STA_MIN = 0.43, STA_MAX = 0.68
const AGR_MIN = 0.48, AGR_MAX = 0.61
const CON_MIN = 0.48, CON_MAX = 0.59
const OPN_MIN = 0.48, OPN_MAX = 0.65

export default class engineAI {
    static processed;

    static init() {
        console.log('ai engine init');
        return new Promise((resolve) => {
            console.log('loading data...');
            extract({ profiles: ['BarackObama', 'realDonaldTrump']})
            .then(data => {
                // this.processed = preprocess(data.slice(0, DATA_LIMIT))
                this.processed = preprocess(data);
                resolve(data)
            })
        })
    }

    static predictOpenness(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/openness_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting openness for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                var predictions = result.map(array => Math.floor(100*(array[0] - OPN_MIN)/(OPN_MAX-OPN_MIN)));
                                predictions = predictions.map(pred => (pred > 100) ? 100 : ((pred < 0) ? 0 : pred))
                                
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = sum/predictions.length
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.openness = user_prediction;
                                    tweet.openness = predictions[count++];
                                })
                                resolve(data)
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

    static predictConscientiousness(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/conscientiousness_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting conscientiousness for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                var predictions = result.map(array => Math.floor(100*(array[0] - CON_MIN)/(CON_MAX-CON_MIN)));
                                predictions = predictions.map(pred => (pred > 100) ? 100 : ((pred < 0) ? 0 : pred))
                                
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = sum/predictions.length
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.conscientiousness = user_prediction;
                                    tweet.conscientiousness = predictions[count++];
                                })
                                resolve(data)
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

    static predictAgreeableness(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/agreeableness_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting agreeableness for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                var predictions = result.map(array => Math.floor(100*(array[0] - AGR_MIN)/(AGR_MAX-AGR_MIN)));
                                predictions = predictions.map(pred => (pred > 100) ? 100 : ((pred < 0) ? 0 : pred))
                                
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = sum/predictions.length
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.agreeableness = user_prediction;
                                    tweet.agreeableness = predictions[count++];
                                })
                                resolve(data)
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

    static predictStability(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/stability_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting stability for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                var predictions = result.map(array => Math.floor(100*(array[0] - STA_MIN)/(STA_MAX-STA_MIN)));
                                predictions = predictions.map(pred => (pred > 100) ? 100 : ((pred < 0) ? 0 : pred))
                                
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = sum/predictions.length
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.stability = user_prediction;
                                    tweet.stability = predictions[count++];
                                })
                                resolve(data)
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

    static predictExtraversion(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/extroversion_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting extraversion for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                var predictions = result.map(array => Math.floor(100*(array[0] - EXT_MIN)/(EXT_MAX-EXT_MIN)));
                                predictions = predictions.map(pred => (pred > 100) ? 100 : ((pred < 0) ? 0 : pred))
                                
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = sum/predictions.length
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.extraversion = user_prediction;
                                    tweet.extraversion = predictions[count++];
                                })
                                resolve(data)
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

    static predictAge(data) {
        var self = this;

        return new Promise(function (resolve, reject) {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/age_model/model.json")
                .then(model => {
                    for (const user in self.processed) {
                        console.log('predicting age for user ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                // Take argmax to receive age group predictions
                                const predictions =  result.map(array => array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]);

                                var young_predictions = 0;
                                var adult_predictions = 0;
                                var senior_predictions = 0;
    
                                predictions.forEach(p => {
                                    if (p == YOUNG) {
                                        young_predictions++;
                                    } else if (p == ADULT) {
                                        adult_predictions++;
                                    } else if (p == SENIOR) {
                                        senior_predictions++;
                                    }
                                });
    
                                var user_prediction;
                                if (young_predictions >= adult_predictions && young_predictions >= senior_predictions) {
                                    user_prediction = YOUNG;
                                } else if (adult_predictions >+ senior_predictions) {
                                    user_prediction = ADULT;
                                } else {
                                    user_prediction = SENIOR;
                                }
    
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.age = user_prediction;
                                    tweet.age = predictions[count++];
                                })
                                resolve(data)
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

    static predictGender(data) {
        var self = this;

        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/ai/gender_model/model.json")
                .then(model => {
                    for (const user in self.processed) {

                        console.log('predicting gender for ' + user);
                        const prediction = model.predict(self.processed[user]);
                        // console.log(await prediction.array());
                    
                        prediction.array()
                            .then(result => {
                                const predictions =  result.map(array => array[0]);
                                var sum = 0;
                                predictions.forEach(p => sum = sum+p);
                                var user_prediction = (sum/predictions.length<0.5) ? 0 : 1;
                                
                                var count = 0;
                                data[user].forEach(tweet => {
                                    if (!tweet.user) tweet.user = {};
                                    tweet.user.gender = user_prediction;
                                    tweet.gender = predictions[count++];
                                })
                                resolve(data)
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
}

function preprocess(data){

    // group tweets by user 
    var userTweets = {};
    // data.forEach(tweet => {
    //     const user = tweet.author;
    //     if(!user) console.log(tweet);
    //     if(!userTweets[user.username]) userTweets[user.username] = [];
    //     userTweets[user.username].push(tweet.body);
    // });

    console.log('predicting ' + Object.keys(data).length + ' users');
    console.log('preprocessing...');

    var userTweets = {};
    for (const user in data) {
        var tweets = data[user];
        userTweets[user] = tweets.map(tweet => {
            tweet = tweet.body;
            tweet = tweet.toLowerCase()
            tweet = tweet.replace(URL_REGEX, '~');
            tweet = tweet.replace(MENTION_REGEX, '@');
            tweet = unidecode(tweet);
            tweet = tweet.replace(NON_ALPHANUMERIC_REGEX, '')
            tweet = tweet.replace(REPEAT_SPACE_REGEX, ' ')
            tweet = format_input(tweet);
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

function format_input(tweet) {
    var words = tweet.split(' ');

    var encoded_tweet = [];
    for (var k = 0; k < MAX_WORDS; k++) {
        var one_hot_vectors;
        if (k < words.length) {
            var word = words[k].split('');
            word = word.map(char => (mapping[char]) ? mapping[char] : mapping['UNK']);

            // Adjust length of word by padding with zeros or truncating
            if (word.length < MAX_CHARS) {
                word = word.concat(new Array(MAX_CHARS - word.length).fill(0));
            }
            else if (word.length > MAX_CHARS) {
                word = word.slice(0, MAX_CHARS);
            }

            one_hot_vectors = tf.oneHot(word, VOCAB_SIZE)
        }
        else {
            var word = new Array(MAX_CHARS).fill(0);
            one_hot_vectors = tf.oneHot(word, VOCAB_SIZE)
        }

        encoded_tweet.push(one_hot_vectors)
    }

    return tf.stack(encoded_tweet)
}

