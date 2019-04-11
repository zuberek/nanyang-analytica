/* eslint-disable no-console */
import lunr from "lunr";
import extract from "../scrape/main";
import fetchJson from '../utils/fetch'

const BASE_URL = 'https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/'
const INDEX = 'search/index'
const STORE = 'search/store'

const OPTIONS = {
    small: '.10000.json',
    medium: '.50000.json',
    large: '.100000.json'
}


var bool = true;
// bool = false
const SEARCH_ENGINE_ACTIVE = bool


export default class SearchEngine {
    static idx;s
    static store;
    static average;

    static async init() {
        var text = (SEARCH_ENGINE_ACTIVE) ? 'search engine init' : 'search engine not active'
        console.log(text);
        if(!SEARCH_ENGINE_ACTIVE) return
        console.log('loading indexing...');

        var index = await fetchJson(BASE_URL + INDEX + OPTIONS.small)
        this.idx = lunr.Index.load(index);
        console.log('loading store...');
        
        var store = await fetchJson(BASE_URL + STORE + OPTIONS.small);
        this.store = store;
        this.average = store.stats;
        console.log('search engine loaded');
    }

    static search(query) {
        var results = {
            twitts: [],
            time: "",
        };
        var start = new Date()
        this.idx.search(query).forEach(index => {
            //console.log(index);
            var positions = index.matchData;
            results.twitts.push({
                ...this.store[index.ref],
                id: index.ref,
                positions: positions,
                score: index.score,
            })
        });      
        var time = new Date() - start
        results.time = time;
        results.average = this.average;
        console.log('Found ' + results.twitts.length + ' results in ' + time + ' Miliseconds');      
        return results;
    }

    static async load(config) {
        console.log(config);
        var extractConfig = {};
        if(config.preloaded){
            config.preloaded = mapValue(config.preloaded)
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Loading store...');
            var store = await fetchJson(BASE_URL + STORE + OPTIONS[config.preloaded]);
            if(config.dynamic.length>0){
                console.log('Loading tweets...');
                extractConfig = {
                    profiles: config.dynamic, 
                    showRetweets: false, 
                    showEmpty: false,
                    noOfTweets: 100,
                }
                var extraTweets = await extract(extractConfig) 
                console.log('Pulled in: ' + extraTweets[Object.keys(extraTweets)[0]].length + ' tweets');

                var allTweets = extraTweets;       
                // for (const user in extraTweets) {
                //     allTweets = allTweets.concat(extraTweets[user]);
                // }
                // allTweets = allTweets.sort(() => Math.random() - 0.5);
                for (const tweetId in store) {
                    var tweet = store[tweetId]
                    if(tweetId != 'stats'){
                        var userTweets = (allTweets[tweet.username]) ? allTweets[tweet.username] : [];
                        userTweets.push({
                            author: {
                                username: tweet.user.username,
                                name: tweet.user.name,
                                link: tweet.user.profile,
                                img: tweet.user.photo,
                                gender: tweet.user.gender,
                                age: tweet.user.age,
                                personality: tweet.user.personality,
                            },
                            id: tweetId,
                            time: tweet.time,
                            link: tweet.link,
                            body: tweet.body, 
                            gender: tweet.gender,
                            age: tweet.age,
                            personality: tweet.personality
                        })
                        allTweets[tweet.username] = userTweets;
                    }
                }
                return allTweets;
            } else {
                console.log('Loading indexing...');
                var index = await fetchJson(BASE_URL + INDEX + OPTIONS[config.preloaded]);
                this.idx = lunr.Index.load(index);
                this.store = store;
                return false;
            }
        } else {
            extractConfig = {
                profiles: config.dynamic, 
                showRetweets: false, 
                showEmpty: false,
                noOfTweets: 100,
            }
            var data = await extract(extractConfig)
            // eslint-disable-next-line no-redeclare

            return data
        }
    }

    static async index(data, assign) {
        console.log(`Indexing ${Object.keys(data).length} users`);
        var store = {};
        var index = lunr(function(){
            this.ref('id');
            this.field('body');
            this.field('name');
            this.metadataWhitelist = ['position']

            for (const userId in data) {
                var tweets = data[userId];

                tweets.forEach(entry => {
                    this.add({
                        id: entry.id,
                        body: entry.body,
                        name: entry.author.name,
                    });
                    if(!entry.author) console.log(entry);
                    store[entry.id] = {
                        time: entry.time,
                        link: entry.link,
                        body: entry.body,
                        age: entry.age,
                        gender: entry.gender,
                        user: {
                            username: entry.author.username,
                            name: entry.author.name,
                            profile: entry.author.link,
                            photo: entry.author.img,
                            gender: entry.author.gender,
                            age: entry.author.age,
                            personality: {
                                conscientiousness: entry.author.personality.conscientiousness,
                                neuroticism: entry.author.personality.neuroticism,
                                extraversion: entry.author.personality.extraversion,
                                agreeableness: entry.author.personality.agreeableness,
                                openess: entry.author.personality.openess,        
                            }
                        }
                    }
                }, this)
            }
        });
        if(assign){
            this.idx = index;
            this.store = store;
        }
        return {store, index}
    }

    static getStats(tweets){
        var users = [];
        var maleCount = 0;
        var youngCount = 0;
        var adultCount = 0;
    
        var personality = {
            conscientiousness: 0,
            neuroticism: 0,
            extraversion: 0,
            agreeableness: 0,
            openess: 0,            
        }
    
        for (const tweetId in tweets) {
            if(!users.includes(tweets[tweetId].user.username)) {
                var user = tweets[tweetId].user;
                users.push(user.username);
                if(user.gender === '0' || user.gender === 0) maleCount++;
                if(user.age === '0' || user.age === 0) youngCount++;
                else if(user.age === '1' || user.age === 1) adultCount++;
    
                personality.conscientiousness += parseFloat(user.personality.conscientiousness)
                personality.neuroticism += parseFloat(user.personality.neuroticism)
                personality.extraversion += parseFloat(user.personality.extraversion)
                personality.agreeableness += parseFloat(user.personality.agreeableness)
                personality.openess += parseFloat(user.personality.openess)
            }
        }
    
        var numberOfPerson = users.length;
    
        for (const type in personality) {
            personality[type] = Math.floor((personality[type]/numberOfPerson) * 100);
        }
    
        var stats = {
            gender: {
                male: maleCount,
                female: users.length - maleCount
            },
            age: {
                young: youngCount,
                adult: adultCount,
                senior: users.length - youngCount - adultCount
            },
            personality,
        }    
        return stats;
    }
}

function mapValue(value){
    switch (value) {
        case 10:
            return 'small'
        case 50:
            return 'medium'
        case 100:
            return 'large'
    }
}
