<template>
  <div id="app">
    <sidebar :isOpen="sidebarOpen" :query="searchQuery" :set="setSidebarOpen" :load="loadTwitts"/>
    <main id="page-wrap">
      <div class="container mt-4">
        <search-bar :query="searchQuery" v-bind:class="{ 'd-none': sidebarOpen }" :load="loadTwitts"/>
        
        <twitts v-if="!pending" :twitts="twitts"/>
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
import axios from 'axios';
import SearchEngine from '../search_engine/engine.js';

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
      twitts: [],
    }
  },
  params: {
    searchQuery: Object,
    sidebarOpen: Boolean,
  },
  created() {
    SearchEngine.init();
  },
  methods: {
    setSidebarOpen(bool) {
      this.sidebarOpen = bool;
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

</style>
