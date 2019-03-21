<template>
  <div id="app">
    <sidebar :isOpen="sidebarOpen" :query="searchQuery" :set="setSidebarOpen" :load="loadTwitts"/>
    <main id="page-wrap">
      <div class="container mt-4">
        <search-bar :query="searchQuery" v-bind:class="{ 'd-none': sidebarOpen }" :load="loadTwitts"/>
        
        <twitts v-if="!pending" :twitts="paginateTwitts" :info="info"/>
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
    }
  },
  created() {
    SearchEngine.init();
  },
  methods: {
    setSidebarOpen(bool) {
      this.sidebarOpen = bool;
    },
    paginateTwitts(from, to) {
      if(!this.twitts.twitts) return [];
      this.pending = true;

      var page = [];
      for (let i = from; i < to; i++) {
        page.push(this.twitts.twitts[i])
      }

      this.pending = false;
      return page;
    },
    loadTwitts() {
      this.pending = true;

      this.twitts = SearchEngine.search(this.searchQuery.search);

      this.pending = false;
    },
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
