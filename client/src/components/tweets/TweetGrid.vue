<template>
    <div class="list">
        
        <!-- <div v-if="info.count>0"  class="text-center row"> -->
        <div class="text-center row">
            <div v-if="stats.count>0" class="col-12 col-md-6 mb-2">
                <Stats :stats="stats"/>
            </div>

            <div class="col-md-6">
                <div class="row p-0">
                    <div 
                        v-for="tweet in tweets.slice(0,2)" 
                        :key="tweet.id" 
                        class="col-12 mb-2" 
                        v-bind:class="{ 'col-6': open }">
                        
                        <tweet-item 
                            :tweet="tweet" 
                            :sidebarOpen="open"
                            :mobile="mobile"
                        />
                    </div>
                </div>
            </div>

            <div 
                v-for="tweet in tweets.slice(2,8)" 
                :key="tweet.id" 
                class="col-lg-6 mb-2" 
                v-bind:class="{ 'col-6': open }">
                
                <tweet-item 
                    :tweet="tweet" 
                    :sidebarOpen="open"
                    :mobile="mobile"
                />
                
            </div>

            <div v-if="tweets.length<5" class="screen-pusher"></div>

            <nav class="col-12 d-flex justify-content-center" aria-label="Page navigation example" >
                <ul class="pagination text-center" 
                    style="cursor: pointer;"
                    v-scroll-to="'.top'"
                >
                    <li class="page-item" v-for="(index) in noOfPages" :key="index" >
                        <a class="page-link" @click="loadPage(index)">{{index}}</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    
</template>

<script>
import TweetItem from "./TweetItem.vue";
// import BToogleDirective from 'bootstrap-vue/es/directives/toggle/toggle.js'
import Stats from '../stats/Stats.vue'

export default {
    name: 'TweetGrid',
    components: {
        Stats,
        TweetItem,
    },
    // directives: {
    //     'b-toggle': BToogleDirective
    // },
    props: {
        page: {
            type: Number,
            required: true,
        },
        tweets: {
            type: Array,
            required: true,
        },
        stats: {
            type: Object,
            required: true,
        },
        loadPage: {
            type: Function,
            required: true,
        },
        open: {
            type: Boolean,
            required: true,
        },
        mobile: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        noOfPages () {
            var num = 0;
            if(this.stats.count) num = Math.ceil(this.stats.count/8);
            if(num > 10) num = 10;
            return num;
        },
    },
}
</script>

<style>
.list {
    margin-top: 5px;
}
.screen-pusher {
    height: 90vh;
    width: 10px;
}
.fancy-tweet img {
    width:100px;
    height:100px;
    border-radius: 50%;
    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}
.fancy-tweet:hover img {
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
.fancy-tweet i {
    color: #2c3e50;
    font-size:30px;
    margin: 0 10px;
}
</style>
