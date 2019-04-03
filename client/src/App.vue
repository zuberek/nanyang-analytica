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
        
        <twitts v-if="!pending" :twitts="displayedTwitts" :loadPage="loadPage" :info="info" :sort="sortBy" :open="sidebarOpen" :page="page" :text="pageText" :mobile="mobile"/>
        <div v-else>
          <loader class="whole-page" :loading="pending" :text="loadingText"/>
        </div>
      </div>
      <div id="tooltipContent">
        <p>
          <!-- You can just type or specify the field - name:Kate <br>  -->
          Avaiable fields are: name, body <br> 
          <!-- Note: FOR NOW ONLY WHEN LOADED DYNAMICALLY <br> -->
          For tips on use go to <a rel="noopener noreferrer" target="_blank" href="https://lunrjs.com/guides/searching.html#wildcards"> <strong>Lunr</strong> </a> </p>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Twitts from './components/Twitts.vue'
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
    Twitts,
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
      },
      dataConfig: {
        preloaded: "asdfasdfasdfafds",
        dynamic: [],
      },
      pending: false,
      loadingText: msg.load.work,
      pageText: msg.hello,
      page: 1,
      twitts: {},
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
      if(this.twitts.twitts) info.count = this.twitts.twitts.length;
      if(this.twitts.time) info.time = this.twitts.time;
      return info;
    },
    displayedTwitts() {
      if(!this.twitts.twitts) return [];
      var page = [];
      for (let i = (this.page-1)*8; i < this.page*8; i++) {
        if(this.twitts.twitts[i]) page.push(this.twitts.twitts[i])
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

        var { age, gender } = this.searchQuery;
        gender = gender.toLowerCase();      
        
        if (gender)
          result.twitts = result.twitts.filter(twitt => twitt.gender === gender);
        if(!(age[0] === 0 && age[1] === 100)) 
          result.twitts = result.twitts.filter(twitt => twitt.age >= age[0] && twitt.age <= age[1]);

        this.twitts = result;
        // console.log(result);
        this.page = 1;
        if(result.twitts.length === 0) this.pageText = msg.error;

        // cool off
        setTimeout(() => {
          this.pending = false;
        },500)
        
      }, 10)
    },
    loadPage(index){
      if(index - 1 < 1) index = 1;
      if(index + 1 > 10) index = 10;
      this.page = index;
      
    },
    async loadData(){
      this.start('Fetching your tweets...');
      await new Promise(resolve => setTimeout(resolve, 10))

      var data = await SearchEngine.load(this.dataConfig);
      if(typeof data != "undefined" && data) {
        this.loadingText = 'Indexing your tweets...';
        SearchEngine.index(data, true);
      }

      this.loadingText = 'Quering the store...';
      this.cleanSeach();
      var result = SearchEngine.search(this.searchQuery.search);
      this.twitts = result;
      this.page = 1;
      this.pending = false;
    },
    runAI(){
      this.start(msg.load.ai + '<br>Feedback in console');
      engineAI.init()
        .then(() => {
          this.loadingText = 'Waking up the AI ✔️<br>Predicting gender...'

          setTimeout(() => {
            engineAI.predictGender()
              .then(predictions => {
                this.loadingText = this.loadingText + ' ✔️<br>Success'
                console.log(predictions);
              });
          }, 10)

        })
    },
    start(text){
      this.pending = true;
      this.sidebarOpen = false;
      var loadText = (text) ? text : msg.load.work;
      this.loadingText = loadText;
    },
    cleanSeach(){
      this.search = "";
      this.gender = "";
      this.age = [0, 100];
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
  background-color: #f1f1f1;
  box-shadow: 0 1px 1px rgba(0,0,0,0.02);
}

.hoverable:hover {
  background-color: #f1f1f1;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}
</style>
