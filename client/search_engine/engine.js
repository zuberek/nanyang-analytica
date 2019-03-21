import index from "./index.json";
import store from "./store.json";
import lunr from "lunr";

export default class SearchEngine {
    static idx;
    static store;

    static init() {
        this.idx = lunr.Index.load(index);
        this.store = store;
    }

    static search(query) {
        var results = [];
        this.idx.search(query).forEach(index => {
            results.push(this.store[index.ref])
        });        
        return results
    }
}
