/* eslint no-console: 0 */ 
const csvFilePath = '../../data/dataset.min.csv';
const csv = require('csvtojson');
const fs =  require("fs");
const extract = require('../../scrape/main');

const START_ENTRY = 0;
const NUMBER_OF_ENTRIES = 500;

csv()
.fromFile(csvFilePath)
.then((dataset)=>{
    dataset = dataset.slice(START_ENTRY, START_ENTRY + NUMBER_OF_ENTRIES)
    var allTweets = [];
    var allUsers = [];
    var failedUsers = [];
    dataset.forEach(entry => {
        allUsers.push(entry.username)
    })
    console.log('Number of users: ' + allUsers.length);
    var iteration = 1;
    dataset.forEach(function(entry){
        const config = {profiles: [entry.username]}
        setTimeout(() => {
            console.log('going for\t' + entry.username);
            extract(config).then(tweets => {
                tweets = tweets[entry.username]
        
                var realUser = {};
                var found = false;
                var count = 0;
                do {
                    if(tweets[count]){
                        if(tweets[count].author.username.slice(1) === entry.username){
                            realUser = tweets[count].author;
                            found = true;
                        }
                    } else {
                        failedUsers.push(entry.username)
                        break
                    }
                    count++;
                } while (!found);

                if(realUser) {
                    Object.keys(entry).forEach(key => {
                        if(key != 'username') {
                            allTweets.push({
                                id: key.concat(entry.username),
                                body: entry[key],
                                link: realUser.link,
                                author: {
                                    username: entry.username,
                                    name: realUser.name,
                                    link: realUser.link,
                                    img: realUser.img,
                                },
                            });
                        }
                    });
                }
        
                allUsers = allUsers.filter(u => u !== entry.username)
                // console.log(allTweets);
        
                console.log('finished\t' + entry.username + '\t\tdone:' + (NUMBER_OF_ENTRIES - allUsers.length) + '/' + (NUMBER_OF_ENTRIES));
                if (checkIfFinished(allUsers)) {
                    // save
                    console.log('finished all');
                    var allTweetsJSON = JSON.stringify(allTweets); 
                    fs.writeFileSync('../data.json', allTweetsJSON);
                    
                    console.log('failed users:');
                    console.log(failedUsers);
                }
                
            });
        }, iteration * 1000);
        iteration ++;
    });
});

function checkIfFinished(allUsers){
    if(allUsers.length === 0) return true;
    return false;
}