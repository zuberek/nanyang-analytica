/* eslint no-console: 0 */ 
const csvFilePath = '../../data/dataset.csv';
const csv = require('csvtojson');
const fs =  require("fs");
const extract = require('../../scrape/main');

const START_ENTRY = 0;
const NUMBER_OF_ENTRIES = 1000;

const SPECIAL_COLUMNS = ['username', 'Gender', 'Age', 'Extroversion', 'Stability', 'Agreeableness', 'Conscientiousness', 'Openness']

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

                if(realUser.username) {
                    console.log('got\t\t' + entry.username);
                    Object.keys(entry).forEach(key => {
                        if(!SPECIAL_COLUMNS.includes(key)) {
                            allTweets.push({
                                id: key.concat(entry.username),
                                body: entry[key],
                                link: realUser.link,
                                author: {
                                    username: entry.username,
                                    name: realUser.name,
                                    link: realUser.link,
                                    img: realUser.img,
                                    age: entry.Age,
                                    gender: entry.Gender,
                                    personality: {
                                        conscientiousness: entry.Conscientiousness,
                                        neuroticism: entry.Stability,
                                        extraversion: entry.Extroversion,
                                        agreeableness: entry.Agreeableness,
                                        openess: entry.Openness,        
                                    }   
                                },
                            });
                        }
                    });
                } else { 
                    console.log('failed\t\t' + entry.username);
                    Object.keys(entry).forEach(key => {
                        if(!SPECIAL_COLUMNS.includes(key)) {
                            allTweets.push({
                                id: key.concat(entry.username),
                                body: entry[key],
                                link: 'https://twitter.com/',
                                author: {
                                    username: entry.username,
                                    name: entry.username,
                                    link: 'https://twitter.com/',
                                    img: (entry.Gender == 0) ? 'https://randomuser.me/api/portraits/med/men/' + (Math.floor(Math.random() * 90) + 1)  +'.jpg' : 'https://randomuser.me/api/portraits/med/women/' + (Math.floor(Math.random() * 90) + 1)  +'.jpg',
                                    age: entry.Age,
                                    gender: entry.Gender,
                                    personality: {
                                        conscientiousness: entry.Conscientiousness,
                                        neuroticism: entry.Stability,
                                        extraversion: entry.Extroversion,
                                        agreeableness: entry.Agreeableness,
                                        openess: entry.Openness,        
                                    }   
                                },
                            });
                        }

                    });
                
                }
        
                allUsers = allUsers.filter(u => u !== entry.username)

                if(allUsers.length%100 == 0){
                    // save
                    console.log('emergency save ' + allTweets.length +' tweets');
                    fs.writeFileSync('../../data/data.' + allTweets.length +'.json', JSON.stringify(allTweets));

                }

                if(allUsers.length < 5){
                    // save
                    console.log('emergency save ' + allTweets.length +' tweets');
                    fs.writeFileSync('../../data/data.' + allTweets.length +'.json', JSON.stringify(allTweets));

                }
                if(allUsers.length <= 2){
                    // save
                    console.log('emergency save ' + allTweets.length +' tweets');
                    fs.writeFileSync('../../data/data.' + allTweets.length +'.json', JSON.stringify(allTweets));

                }
        
                console.log('finished\t' + entry.username + '\t\tdone:' + (NUMBER_OF_ENTRIES - allUsers.length) + '/' + (NUMBER_OF_ENTRIES));
                if (checkIfFinished(allUsers)) {
                    // save
                    console.log('finished all, fetched for ' + allTweets.length +' tweets');
                    var allTweetsJSON = JSON.stringify(allTweets); 
                    fs.writeFileSync('../../data/data.json', allTweetsJSON);
                    
                    console.log('failed users:');
                    console.log(failedUsers);
                }
                
            });
        }, iteration * 1000);
        iteration ++;
    });
});

function checkIfFinished(allUsers){
    if(allUsers.length < 10) return true;
    return false;
}