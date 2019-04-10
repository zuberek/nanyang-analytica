const lunr = require('lunr');
const data = require('../../data/data.99800.json')
const randomDate = require('../../utils/randomDate')
const fs =  require("fs")

const LIMIT = 100 * 1000;

var dataset = []
dataset = data.sort(() => Math.random() - 0.5);
dataset = dataset.slice(0,LIMIT)

// create the index and store
var store = {}
var index = lunr(function(){
    this.ref('id');
    this.field('body');
    this.field('name');
    this.metadataWhitelist = ['position']
    
    var count = 0;
    dataset.forEach(function(entry){
        this.add({
            id: entry.id,
            body: entry.body,
            name: entry.author.name,
        });
        var max = 100;
        var young = randombetween(20, max-60);
        var adult = randombetween(20, max-20-young);
        var senior = 100 - young - adult;

        store[entry.id] = {
            body: entry.body,
            username: entry.author.username,
            time: randomDate(1554860676284, 1547084676284),
            link: entry.link,
            gender: Math.floor((Math.random() * 40) + 30),
            age: {
                young,
                adult,
                senior,
            },
            personality: {
                conscientiousness: Math.floor((Math.random() * 35) + 35),
                neuroticism: Math.floor((Math.random() * 35) + 35),
                extraversion: Math.floor((Math.random() * 35) + 35),
                agreeableness: Math.floor((Math.random() * 35) + 35),
                openess: Math.floor((Math.random() * 35) + 35),        
            },
            user: {
                username: entry.author.username,
                name: entry.author.name,
                profile: entry.author.link,
                photo: entry.author.img,
                gender: entry.author.gender,
                age: entry.author.age,
                personality: {
                    conscientiousness: entry.author.personality.conscientiousness,
                    neuroticism: entry.author.personality.neuroticism,
                    extraversion: entry.author.personality.extraversion,
                    agreeableness: entry.author.personality.agreeableness,
                    openess: entry.author.personality.openess,        
                }
            },
        }
        
        count++;
        if(count%10000 === 0) {
            // console.log(store[entry.id]);
            console.log('Finished ' + count + ' tweets');
        }
    }, this);
});

store.stats = getStats(store);

// save
var indexJSON = JSON.stringify(index); 
fs.writeFileSync('../index.' + LIMIT + '.json', indexJSON); 

var storeJSON = JSON.stringify(store); 
fs.writeFileSync('../store.' + LIMIT + '.json', storeJSON);


function getStats(tweets){
    var users = [];
    var maleCount = 0;
    var youngCount = 0;
    var adultCount = 0;

    var searchPersonality = {
        conscientiousness: 0,
        neuroticism: 0,
        extraversion: 0,
        agreeableness: 0,
        openess: 0,            
    }

    for (const tweetId in tweets) {
        if(!users.includes(tweets[tweetId].user.username)) {
            if(tweets[tweetId].user.username == 'gregbradyTO'){
                console.log(tweets[tweetId].user);
            }
            var user = tweets[tweetId].user;
            users.push(user.username);
            if(user.gender === '0') maleCount++;
            if(user.age === '0') youngCount++;
            else if(user.age === '1') adultCount++;

            searchPersonality.conscientiousness += parseFloat(user.personality.conscientiousness)
            searchPersonality.neuroticism += parseFloat(user.personality.neuroticism)
            searchPersonality.extraversion += parseFloat(user.personality.extraversion)
            searchPersonality.agreeableness += parseFloat(user.personality.agreeableness)
            searchPersonality.openess += parseFloat(user.personality.openess)
            
        }
    }

    var numberOfPerson = users.length;
    console.log('numberOfPerson: ' + numberOfPerson);
    console.log('maleCount: ' + maleCount);
    console.log('youngCount: ' + youngCount);
    console.log('adultCount: ' + adultCount);
    console.log('searchPersonality: ');
    console.log(searchPersonality);

    for (const type in searchPersonality) {
        searchPersonality[type] = Math.floor((searchPersonality[type]/numberOfPerson) * 100);
    }

    var stats = {
        gender: {
            male: maleCount,
            female: users.length - maleCount
        },
        age: {
            young: youngCount,
            adult: adultCount,
            senior: users.length - youngCount - adultCount
        },
        searchPersonality,
    }

    console.log(stats);

    return stats;
}

function randombetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }