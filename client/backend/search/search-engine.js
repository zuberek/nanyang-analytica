/* eslint-disable no-console */
import lunr from "lunr";

export default class SearchEngine {
    static idx;
    static store;

    static init() {
        return new Promise((resolve)    => {
            console.log('loading indexing...');
            import('./index.json')
                .then(index => {
                    this.idx = lunr.Index.load(index);

                    console.log('loading store...');
                    import('./store.json')
                        .then(store => {
                            this.store = store;
                        })
                    console.log('loaded!');
                    resolve();
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

    static load(data) {
        var allTweets = [];
        for (const user in data) {
            allTweets = allTweets.concat(data[user]);
        }
        allTweets = allTweets.sort(() => Math.random() - 0.5)
        // for (const tweetId in this.store) {
        //     allTweets.push(this.store[tweetId])
        // }

        // create the index and store
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

        this.idx = index;
        this.store = store;
    }
}
