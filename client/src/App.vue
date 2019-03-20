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
      sidebarOpen: true,
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
  methods: {
    setSidebarOpen(bool) {
      this.sidebarOpen = bool;
    },
    loadTwitts() {
      this.pending = true;
      const NUMBER_OF_TWITTS = 10;
      const NUMBER_OF_USERS = 30;
      

      axios
        .get('https://api.icndb.com/jokes/random/' + NUMBER_OF_TWITTS)
        .then(resulted => {
          var twitts = resulted.data.value;

          axios
            .get('https://randomuser.me/api/?inc=gender,name,picture,dob,registered&results=' + NUMBER_OF_USERS)
            .then(anotherResulted => {
              var users = anotherResulted.data.results;

              twitts.forEach(twitt => {                
                twitt.user = users[Math.floor(Math.random() * NUMBER_OF_USERS)]
              });
              
              this.twitts = twitts;
              this.pending = false;
            });

        });
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

</style>
