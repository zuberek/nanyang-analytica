<template>
  <div id="app" :class="{ 'mobile': mobile }">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
    <div id="top" class="top"></div>
    <sidebar :isOpen="sidebarOpen" :query="searchQuery" :loadDynamic="loadData" :dataFields="dataConfig" :set="setSidebarOpen" :load="searchForTweets" :mobile="mobile" :update="updatePreloaded"/>
    <img class="logo-lion" src="./assets/logo-black.png" alt="">
    <main id="page-wrap" v-bind:class="{ 'squizzer': !sidebarOpen }">
      <div class="container mt-4">
        <search-bar :query="searchQuery" v-bind:class="{ 'd-none': sidebarOpen }" :load="searchForTweets" />
        
        <div v-if="!pending">
          <search-summary :loadPage="loadPage" :stats="stats" :sort="sortBy" :text="pageText" />
          <tweet-grid v-if="displayedTwitts.length > 0" :tweets="displayedTwitts" :loadPage="loadPage" :stats="stats" :open="sidebarOpen" :page="page"  :mobile="mobile"/>
        </div>
        <div v-else>
          <loader class="whole-page" :loading="pending" :text="loadingText"/>
        </div>
      </div>
      <!-- <div id="tooltipContent">
        <p>
          Avaiable fields are: name, body <br> 
          For tips on use go to <a rel="noopener noreferrer" target="_blank" href="https://lunrjs.com/guides/searching.html#wildcards"> <strong>Lunr</strong> </a> </p>
      </div> -->
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import TweetGrid from './components/tweets/TweetGrid.vue'
import SearchSummary from './components/tweets/SearchSummary.vue'
import SearchBar from './components/SearchBar.vue'
import Loader from './components/Loader.vue'
import SearchEngine from '../backend/search/search-engine.js';
import { setTimeout } from 'timers';
import returnMarked from "./utils/returnMarked.js";
// import { preprocess, predictGender } from '../backend/ai/predict-gender.js'
import engineAI from '../backend/ai/ai-engine.js';
import msg from "./messages.js";

export default {
  name: 'app',
  components: {
    Sidebar,
    TweetGrid,
    SearchSummary,
    SearchBar,
    Loader,
  },
  data () {
    return {
      msg,
      sidebarOpen: false,
      searchQuery: {  
        search: "",
        gender: "",
        age: [0, 100],
        personality: [
            {
              name: 'Conscientiousness',
              val: [0, 100]
            },
            {
              name: 'Neuroticism',
              val: [0, 100]
            },
            {
              name: 'Extraversion',
              val: [0, 100]
            },
            {
              name: 'Agreeableness',
              val: [0, 100]
            },
            {
              name: 'Openess',
              val: [0, 100]
            },      
        ],
      },
      dataConfig: {
        preloaded: "asdfasdfasdfafds",
        dynamic: [],
      },
      pending: false,
      loadingText: msg.load.work,
      pageText: msg.hello,
      page: 1,
      twitts: [],
      stats: {
        count: 0,
        time: 0,
      },
      windowWidth: window.innerWidth,
    }
  },
  params: {
    searchQuery: Object,
    sidebarOpen: Boolean,
  },
  computed: {
    info() {
      var info = {};
      if(this.twitts) info.count = this.twitts.length;
      if(this.twitts.time) info.time = this.twitts.time;
      return info;
    },
    displayedTwitts() {
      if(!this.twitts) return [];
      var page = [];
      for (let i = (this.page-1)*8; i < this.page*8; i++) {
        if(this.twitts[i]) page.push(this.twitts[i])
      }
      return page.map(t => returnMarked(t.positions, t));
    },
    mobile() {
      return this.windowWidth < 800;
    }
  },
  mounted() {
    this.start(msg.load.search)
    this.$nextTick(() => {
      setTimeout(() => {
        SearchEngine.init()
          .then(() => {
            this.pending = false;
          })
      }, 1);
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
      });
    });
  },
  methods: {
    updatePreloaded(value) {
      this.dataConfig.preloaded = value;
    },
    setSidebarOpen(bool) {
      this.sidebarOpen = bool;
      
    },
    sortBy(type) {
      switch (type) {
        case 'match':
          this.twitts.twitts.sort((a,b) => b.score - a.score);
          break;
        case 'lengthDsc':
          this.twitts.twitts.sort((a,b) => b.body.length - a.body.length);
          break;
        case 'lengthAsc':
          this.twitts.twitts.sort((a,b) => a.body.length - b.body.length);
          break;
      
        default:
          break;
      }
      
    },
    searchForTweets() {
      // this.cleanSeach();
      this.start()
      setTimeout(() => {
        
        if(!this.searchQuery.search) {
          this.pageText = msg.search;
          this.twitts = [];
          this.pending = false;
          return;
        }

        var result = SearchEngine.search(this.searchQuery.search);

        var { age, gender, personality } = this.searchQuery;
        gender = gender.toLowerCase();

        var tweets = result.twitts;
        
        if (gender) {
          var genderCode = (gender === 'Male') ? 1 : 0;
          tweets = tweets.filter(twitt => parseInt(twitt.user.gender) === genderCode);
        }
        if(!(age[0] === 0 && age[1] === 100)) {
          var options = [];
          if(age[0] == 18 && age[1] > 18) options.push('0')
          if(age[0] <= 25 && age[1] > 25) options.push('1')
          if(age[0] <= 34 && age[1] > 34) options.push('2')
          tweets = tweets.filter(twitt => options.includes(twitt.user.age));
        }

        personality = personality.filter(type => type.val[0] !== 0 || type.val[1] !== 100)
        personality.forEach(type => {
          tweets = tweets.filter(twitt => {
            var tweetVal = parseFloat(twitt.user.personality[type.name.toLowerCase()]);
            return tweetVal >= type.val[0]/100 && tweetVal <= type.val[1]/100;
        })})

        tweets.slice(0, 10000)

        this.twitts = tweets;
        this.stats.count = result.twitts.length;
        this.stats.time = result.time;
        this.stats.average = result.average;
        this.stats.search = SearchEngine.getStats(result.twitts)
        // console.log(result);
        this.page = 1;
        if(result.twitts.length === 0) this.pageText = msg.error;
        this.pending = false;
        
      }, 100)
    },
    loadPage(index){
      if(index - 1 < 1) index = 1;
      if(index + 1 > 10) index = 10;
      this.page = index;
      
    },
    async loadData(){
      this.start('Fetching your tweets...');
      await new Promise(resolve => setTimeout(resolve, 10)) // udpate FE

      var data = await SearchEngine.load(this.dataConfig);
      if(typeof data == "undefined" || !data) return

      await new Promise(resolve => setTimeout(resolve, 1000))

      this.start(msg.load.ai + '<br>Feedback in console');

      data = await engineAI.init(data)
      this.loadingText = 'Waking up the AI ✔️<br>Predicting age...'
      data = await engineAI.predictAge(data)

      this.loadingText = this.loadingText + '✔️<br>Predicting gender...'
      data = await engineAI.predictGender(data)

      this.loadingText = this.loadingText + '✔️<br>Predicting personality...<br>Conscientiousness...'
      data = await engineAI.predictConscientiousness(data)

      this.loadingText = this.loadingText + '✔️<br>Openess...'
      data = await engineAI.predictOpenness(data)

      this.loadingText = this.loadingText + '✔️<br>Agreeableness...'
      data = await engineAI.predictAgreeableness(data)

      this.loadingText = this.loadingText + '✔️<br>Neuroticism...'
      data = await engineAI.predictStability(data)

      this.loadingText = this.loadingText + '✔️<br>Extraversion...'
      data = await engineAI.predictExtraversion(data)

      this.loadingText = this.loadingText + ' ✔️<br>Indexing your tweets...'
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // update FE
      SearchEngine.index(data, true);

      this.loadingText = 'Quering the store...';
      this.cleanSeach();
      var result = SearchEngine.search(this.searchQuery.search);
      this.twitts = result.twitts;
      this.stats.count = result.twitts.length;
      this.stats.time = result.time;
      this.stats.average = result.average;
      this.stats.search = SearchEngine.getStats(result.twitts)
      this.page = 1;
      this.pending = false;
      
    },
    start(text){
      this.pending = true;
      this.sidebarOpen = false;
      var loadText = (text) ? text : msg.load.work;
      this.loadingText = loadText;
    },
    cleanSeach(){
      this.searchQuery = {  
        search: "",
        gender: "",
        age: [0, 100],
        personality: [
            {
              name: 'Conscientiousness',
              val: [0, 100]
            },
            {
              name: 'Neuroticism',
              val: [0, 100]
            },
            {
              name: 'Extraversion',
              val: [0, 100]
            },
            {
              name: 'Agreeableness',
              val: [0, 100]
            },
            {
              name: 'Openess',
              val: [0, 100]
            },      
        ],
      }
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.whole-page {
    height: 100vh;
}

@media only screen and (max-width: 1300px) {
  .squizzer {
    margin-top: 100px;
  }
}

mark {
  background-color: yellow !important;
  color: black;
}

.logo-lion {
  position: absolute;
  right: 20px;
  top: 20px;
  height: 60px;
  width: 60px;
}

.top {
  position: absolute;
  right: 0;
  top: 0;
  height: 10px;
  width: 10px;
}

.hoverable {
  transition: all 0.3s ease-in-out;
  box-shadow: 0 1px 1px rgba(0,0,0,0.02);
}

.hoverable:hover {
  /* background-color: #f1f1f1; */
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

a {
  color: #2c3e50 !important;
  text-decoration: none !important;
}
</style>
