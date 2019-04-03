const lunr = require('lunr');
const data = require('../../data/data.json')
const fs =  require("fs")

var dataset = []
dataset = data.sort(() => Math.random() - 0.5);
dataset = dataset.slice(0,10000);

// create the index and store
var store = {} 
var index = lunr(function(){
    this.ref('id');
    this.field('body');
    this.field('name');
    this.metadataWhitelist = ['position']
    
    dataset.forEach(function(entry){
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

// save
var indexJSON = JSON.stringify(index); 
fs.writeFileSync('../index.json', indexJSON); 

var storeJSON = JSON.stringify(store); 
fs.writeFileSync('../store.json', storeJSON); 