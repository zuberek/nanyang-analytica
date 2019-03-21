<template>
  <div id="app">
    <sidebar :isOpen="sidebarOpen" :query="searchQuery" :set="setSidebarOpen" :load="loadTwitts"/>
    <main id="page-wrap">
      <div class="container mt-4">
        <search-bar :query="searchQuery" v-bind:class="{ 'd-none': sidebarOpen }" :load="loadTwitts"/>
        
        <twitts v-if="!pending" :twitts="displayedTwitts" :loadPage="loadPage" :info="info" :sort="sortBy"/>
        <div v-else>
          <loader class="whole-page" :loading="pending" />
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
import SearchEngine from '../search_engine/search-engine.js';

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
        location: "",
        language: "",
      },
      pending: false,
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
      for (let i = (this.page-1)*10; i < this.page*10; i++) {
        if(this.twitts.twitts[i]) page.push(this.twitts.twitts[i])
        else return page;
      }
      return page;
    }
  },
  created() {
    SearchEngine.init();
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

      this.twitts = SearchEngine.search(this.searchQuery.search);

      this.pending = false;
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
  #page-wrap {
    margin-top: 100px;
  }
}

mark {
  background-color: yellow !important;
  color: black;
}

</style>
