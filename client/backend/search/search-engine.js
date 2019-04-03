/* eslint-disable no-console */
import lunr from "lunr";
import extract from "../scrape/main";

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

    static init() {
        var text = (SEARCH_ENGINE_ACTIVE) ? 'search engine init' : 'search engine not active'
        console.log(text);

        return new Promise((resolve)    => {
            if(!SEARCH_ENGINE_ACTIVE) return resolve();
            console.log('loading indexing...');
            fetch(BASE_URL + INDEX + OPTIONS.small)
                .then(response => {
                    return response.json()
                })
                .then(indexing => {
                    this.idx = lunr.Index.load(indexing);
                    console.log('loading store...');

                    fetch(BASE_URL + STORE + OPTIONS.small)
                    .then(response => {
                        return response.json()
                    })
                    .then(store => {
                        this.store = store;
                        console.log('search engine loaded');
                        resolve()
                    })
                })
        })
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
        if(config.static){
            var store = (await fetch(BASE_URL + STORE + OPTIONS[config.static])).json()

            if(config.dynamic){
                var extractConfig = {
                    profiles: config.dynamic, 
                    showRetweets: false, 
                    showEmpty: false 
                  }
                var extraTweets = await extract(extractConfig)

                // join them together, shuffle and return
            } else {
                var index = (await fetch(BASE_URL + INDEX + OPTIONS[config.static])).json()
                this.idx = index;
                this.store = store;
                return false;
            }
        }
    }

    static async index(data) {
        var allTweets = [];
        
        for (const user in data) {
            allTweets = allTweets.concat(data[user]);
        }

        var store = {};
        var index = lunr(function(){
            this.ref('id');
            this.field('body');
            this.field('name');
            this.metadataWhitelist = ['position']
            
            allTweets.forEach(function(entry){
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
                }
            }, this);
        });
        return {store, index}
    }
}