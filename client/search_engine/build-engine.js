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
                var gender = Math.floor(Math.random()*2) > 1 ? 'male' : 'female';
                var age = Math.floor(Math.random()*60 + 20);
                twittAsDocument.push({
                    id: key.concat(entry.username),
                    body: entry[key],
                    username: entry.username,
                    photo: 'https://randomuser.me/api/portraits/lego/' + (Math.floor(Math.random() * 8)) + '.jpg',
                    gender,
                    age,
                });
            }
        });
    });

    var trimmed = twittAsDocument.slice(0,15000);
    twittAsDocument = trimmed;

    // create the index and store
    var store = {};
    var index = lunr(function(){
        this.ref('id');
        this.field('body');
        this.field('age');
        this.field('gender');
        this.metadataWhitelist = ['position']
        
        twittAsDocument.forEach(function(entry){
            this.add({
                id: entry.id,
                body: entry.body,
                age: entry.age,
                gender: entry.gender,
            });
            store[entry.id] = {
                username: entry.username,
                photo: entry.photo,
                body: entry.body,
                gender: entry.gender,
                age: entry.age,
            }
        }, this);
    });

    // save
    var indexJSON = JSON.stringify(index); 
    fs.writeFileSync('index.json', indexJSON); 
    
    var storeJSON = JSON.stringify(store); 
    fs.writeFileSync('store.json', storeJSON); 
})

