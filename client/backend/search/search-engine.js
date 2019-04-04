/* eslint-disable no-console */
import lunr from "lunr";
import extract from "../scrape/main";
import fetchJson from '../utils/fetch'

const BASE_URL = 'https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/server/'
const INDEX = 'search/index'
const STORE = 'search/store'

const OPTIONS = {
    small: '_small.json',
    medium: '_medium.json',
    large: '_large.json'
}


var bool = true;
// bool = false
const SEARCH_ENGINE_ACTIVE = bool


export default class SearchEngine {
    static idx;
    static store;

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
                positions: positions,
                score: index.score,
            })
        });      
        var time = new Date() - start
        results.time = time;
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
                    showEmpty: false 
                  }
                var extraTweets = await extract(extractConfig) 
                var allTweets = []       
                for (const user in extraTweets) {
                    allTweets = allTweets.concat(extraTweets[user]);
                }
                allTweets = allTweets.sort(() => Math.random() - 0.5);
                for (const tweetId in store) {
                    var tweet = store[tweetId]
                    allTweets.push({
                        author: {
                            username: tweet.username,
                            name: tweet.name,
                            link: tweet.link,
                            img: tweet.photo,
                        },
                        id: tweetId,
                        time: tweet.time,
                        link: tweet.link,
                        body: tweet.body, 
                    })
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
                showEmpty: false 
            }
            var data = await extract(extractConfig)
            // eslint-disable-next-line no-redeclare
            var allTweets = []
            for (const user in data) {
                allTweets = allTweets.concat(data[user]);
            }
            allTweets = allTweets.sort(() => Math.random() - 0.5)

            return allTweets
        }
    }

    static async index(data, assign) {
        console.log(`Indexing ${data.length} tweets`);
        var store = {};
        var index = lunr(function(){
            this.ref('id');
            this.field('body');
            this.field('name');
            this.metadataWhitelist = ['position']
            
            data.forEach(function(entry){
                this.add({
                    id: entry.id,
                    body: entry.body,
                    name: entry.author.name,
                });
                store[entry.id] = {
                    username: entry.author.username,
                    name: entry.author.name,
                    profile: entry.author.link,
                    photo: entry.author.img,
                    time: entry.time,
                    link: entry.link,
                    body: entry.body,
                    user: {
                        username: entry.author.username,
                        name: entry.author.name,
                        profile: entry.author.link,
                        photo: entry.author.img,
                        gender: (Math.random() > 0.5) ? 'male' : 'female',
                        age: (Math.random() > 0.7) ? 'young' : (Math.random() > 0.5) ? 'adult' : 'senior',
                        personality: {
                            conscientiousness: Math.floor(Math.random() * 100),
                            neuroticism: Math.floor(Math.random() * 100),
                            extraversion: Math.floor(Math.random() * 100),
                            agreeableness: Math.floor(Math.random() * 100),
                            openess: Math.floor(Math.random() * 100),        
                        }
                    }
                }
            }, this);
        });
        if(assign){
            this.idx = index;
            this.store = store;
        }
        return {store, index}
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