<template>
  <div id="app">
    <sidebar :isOpen="sidebarOpen" :query="searchQuery" :fields="dynamicFields" :set="setSidebarOpen" :load="loadTwitts"/>
    <img class="logo-lion" src="./assets/logo-black.png" alt="">
    <main id="page-wrap" v-bind:class="{ 'squizzer': !sidebarOpen }">
      <div class="container mt-4">
        <search-bar :query="searchQuery" v-bind:class="{ 'd-none': sidebarOpen }" :load="loadTwitts"/>
        
        <twitts v-if="!pending" :twitts="displayedTwitts" :loadPage="loadPage" :info="info" :sort="sortBy" :open="sidebarOpen"/>
        <div v-else>
          <loader class="whole-page" :loading="pending" :text="loadingText"/>
        </div>
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
      sidebarOpen: false,
      searchQuery: {
        search: "",
        gender: "",
        age: [0, 100],
      },
      dynamicFields: {
        dynamic: false,
        location: "World",
        language: "Any",      
      },
      pending: true,
      loadingText: 'Loading the data...',
      page: 1,
      twitts: {},
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
      for (let i = (this.page-1)*6; i < this.page*6; i++) {
        if(this.twitts.twitts[i]) page.push(this.twitts.twitts[i])
        else return page;
      }
      return page;
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        SearchEngine.init();
        this.pending = false;
        this.loadingText = 'We`re working on it...';
      }, 1)
		});
  },
  methods: {
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
    loadTwitts() {
      this.pending = true;
      this.sidebarOpen = false;
      setTimeout(() => {
        var result = SearchEngine.search(this.searchQuery.search);

        var { age, gender } = this.searchQuery;
        age.sort((a,b) => a - b);
        gender = gender.toLowerCase();      
        
        if (gender)
          result.twitts = result.twitts.filter(twitt => twitt.gender === gender);
        if(!(age[0] === 0 && age[1] === 100)) 
          result.twitts = result.twitts.filter(twitt => twitt.age >= age[0] && twitt.age <= age[1]);

        this.twitts = result;

        this.pending = false;
      }, 10)
    },
    loadPage(index){
      if(index - 1 < 1) index = 1;
      if(index + 1 > 10) index = 10;
      this.page = index;
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

</style>
