/* eslint-disable no-console */
import lunr from "lunr";

export default class SearchEngine {
    static idx;
    static store;

    static init() {
        console.log('loading indexing...');
        this.idx = lunr.Index.load(require('./index.json'));
        console.log('loading store...');
        this.store = require('./store.json');
        console.log('loaded!');
    }

    static search(query) {
        var results = {
            twitts: [],
            time: "",
        };

        var start = new Date()
        this.idx.search(query).forEach(index => {
            //console.log(index);
            var positions = [];
            Object.keys(index.matchData.metadata).forEach(key => {
                index.matchData.metadata[key].body.position.forEach(position => {
                    positions.push(position)  
                });
            });
            positions.sort((a,b) => a[0]-b[0]);
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

    static load(data) {
        var allTweets = [];
        for (const user in data) {
            allTweets = allTweets.concat(data[user]);
        }

        // shuffle
        allTweets = allTweets.sort(() => Math.random() - 0.5)
        
        // create the index and store
        var store = {};
        var index = lunr(function(){
            this.ref('id');
            this.field('body');
            this.metadataWhitelist = ['position']
            
            allTweets.forEach(function(entry){
                this.add({
                    id: entry.id,
                    body: entry.body,
                });
                store[entry.id] = {
                    username: entry.author.username,
                    name: entry.author.name,
                    photo: entry.author.img,
                    body: entry.body,
                }
            }, this);
        });

        this.idx = index;
        this.store = store;
    }
}
