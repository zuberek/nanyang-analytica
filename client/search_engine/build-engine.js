const csvFilePath = 'dataset.min.csv';
const csv = require('csvtojson');
const fs =  require("fs");
const lunr = require('lunr');

csv()
.fromFile(csvFilePath)
.then((dataset)=>{

    // preprocess
    // each twitt as a separate document instead of each user
    var twittAsDocument = [];
    dataset.forEach(function(entry){
        Object.keys(entry).forEach(key => {
            if(key != 'username') {
                twittAsDocument.push({
                    id: key.concat(entry.username),
                    body: entry[key],
                    username: entry.username,
                    photo: 'https://randomuser.me/api/portraits/lego/' + (Math.floor(Math.random() * 8)) + '.jpg',
                });
            }
        });
    });

    var trimmed = twittAsDocument.slice(0,10000);
    twittAsDocument = trimmed;

    // create the index and store
    var store = {};
    var index = lunr(function(){
        this.ref('id');
        this.field('body');
        this.metadataWhitelist = ['position']
        
        twittAsDocument.forEach(function(entry){
            this.add({
                id: entry.id,
                body: entry.body,
            });
            store[entry.id] = {
                username: entry.username,
                photo: entry.photo,
                body: entry.body,
            }
        }, this);
    });

    // save
    var indexJSON = JSON.stringify(index); 
    fs.writeFileSync('index.json', indexJSON); 
    
    var storeJSON = JSON.stringify(store); 
    fs.writeFileSync('store.json', storeJSON); 
})

