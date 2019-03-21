/* eslint-disable no-console */
import index from "./index.json";
import store from "./store.json";
import lunr from "lunr";

export default class SearchEngine {
    static idx;
    static store;

    static init() {
        console.log('loading indexing...');
        this.idx = lunr.Index.load(index);
        console.log('loading store...');
        this.store = store;
        console.log('loaded!');
    }

    static search(query) {
        var results = {
            twitts: [],
            time: "",
        };
        var start = new Date()
        this.idx.search(query).forEach(index => {
            results.twitts.push({
                ...this.store[index.ref],
                position: index.matchData.metadata[query].body.position
            })
        });      
        var time = new Date() - start
        results.time = time;        
        return results;
    }
}
