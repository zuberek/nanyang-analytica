<template>
    <div v-if="twitts.length === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                {{ text }}
            </span>
            <br><br>
            <!-- <button class="btn btn-warning" @click="runAI">WAKE UP THE AI!</button> -->
            
        </div>
    </div>
    <div v-else class="list">
        <div class="d-flex flex-row justify-content-between">
            <div class="mt-2">
                <p v-if="stats.count > 0" class="font-weight-bold">Found {{stats.count}} results in {{stats.time}} Miliseconds</p>
            </div>
            <div class="mb-2">   
                <div class="dropdown">
                    <button class="btn btn-warning dropdown-toggle mx-auto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Sort by
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" @click="sort('match');loadPage(1)">Best Match</a>
                        <a class="dropdown-item" @click="sort('lengthDsc');loadPage(1)">Long to Short</a>
                        <a class="dropdown-item" @click="sort('lengthAsc');loadPage(1)">Short to Long</a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- <div v-if="info.count>0"  class="text-center row"> -->
        <div class="text-center row">
            <div class="col-12 col-md-6 mb-2" style="padding-right:30px; padding-left:30px;">
                <Stats :stats="stats.search"/>
            </div>
            <div v-for="(twitt, index) in slicedTweets" :key="index" class="col-lg-6 mb-2" v-bind:class="{ 'col-6': open }" >
                <div class="card hoverable fancy-tweet" @mouseenter="toggleCollapse(twitt.user.username + index)" @mouseleave="toggleCollapse(twitt.user.username + index)">
                    <div class="row m-4">
                        <div class="col-sm-4 p-2" v-bind:class="{ 'col-sm-12 my-4': open }">
                            <div>
                                <img class="card-img-top" :src="twitt.user.photo" alt="Card image cap">
                            </div>
                            <h5 class="card-title mt-2 mb-0" v-html="twitt.name" />
                            <!-- <small class="text-muted mt-0 mb-1">{{twitt.gender}}, {{twitt.age}} years</small> -->
                            <small class="text-muted mt-0 mb-1">{{twitt.user.username}} {{twitt.time}}</small>
                             
                        </div>
                        <div class="col-sm-8" v-if="!open">
                            <div class="card-body">
                                <!-- <a class="btn btn-primary" v-b-toggle="twitt.user.username + index">Toggle first element</a> -->
  
                                <p class="card-text" v-html="twitt.body"/>
                            </div>
                        </div>
                    </div>
                    <b-collapse :id="twitt.user.username + index" :visible="mobile">
                        <div class="card-footer text-muted row mx-0">
                            <div class="mt-2 col-4">
                                <div style="cursor: pointer;" @click="toggleModal(icon.type, twitt.user.username, index)">
                                    <div>
                                        <i class="fas fa-user-circle" ></i> <br>
                                        Profile
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 col-4">
                                <div style="cursor: pointer;" @click="toggleModal(icon.type, twitt.user.username, index)">
                                    <div>
                                        <i class="fas fa-user-circle" ></i> <br>
                                        Tweet
                                    </div>
                                </div>
                                </div>
                                <div class="mt-2 col-4">
                                <div style="cursor: pointer;" @click="toggleModal(icon.type, twitt.user.username, index)">
                                    <a :href="twitt.link" rel="noopener noreferrer" target="_blank" > 
                                        <i class="fas fa-play-circle" ></i> <br>
                                        Link
                                    </a>
                                </div>
                                </div>
                        </div>  
                    </b-collapse>
                    <b-modal size="lg" :id="twitt.user.username + index">
                        <div class="d-block"> {{ twitt.body }}</div>
                    </b-modal>
                </div>
            </div>
            <div v-if="twitts.length<5" class="screen-pusher"></div>

            <user-modal :twitt="user" v-for="user in users" :key="user"/>

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
import BCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import BModal from 'bootstrap-vue/es/components/modal/modal'
// import BToogleDirective from 'bootstrap-vue/es/directives/toggle/toggle.js'
import Stats from './stats/Stats.vue'
import UserModal from './modals/UserModal.vue'
export default {
    name: 'twitts',
    components: {
        Stats,
        BCollapse,
        UserModal,
        BModal,
    },
    // directives: {
    //     'b-toggle': BToogleDirective
    // },
    props: {
        text: {
            type: String,
            required: true,
        },
        page: {
            type: Number,
            required: true,
        },
        twitts: {
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
        sort: {
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
        firstTwo(){
            return this.twitts.slice(0,2);
        },
        slicedTweets() {
            if(this.page === 1 && !this.mobile) return this.twitts.slice(2,8);
            else return this.twitts;
        },
        users() {
            var users = [];
            this.twitts.forEach(element => {
                users.push(element.user);
            });
            var userNames = users.map(u => u.username)
            users = users.filter((user, index) => userNames.indexOf(user.username) == index)
            return users;
        },
        tweetIcons() {
            return [
                {
                    class: "fas fa-user-circle",
                    text: 'Profile',
                    type: 'profile'
                    //  : 'position:absolute;right: 100px;'
                },
                {
                    class: "fas fa-info-circle",
                    text: 'Tweet',
                    type: 'tweet'
                    //  : 'position:absolute;right: 60px;'
                },
                {
                    class: "fas fa-play-circle",
                    text: 'Link',
                    type: 'link'
                    //  : 'position:absolute;right: 20px;'
                },
            ]
        }
    },
    methods: {
        toggleCollapse(id) {
            console.log('toogle collapse ' + id);
            this.$root.$emit('bv::toggle::collapse', id)
        },
        toggleModal(type, username, index) {
            switch (type) {
                case 'profile':
            console.log('toogle profile ' + username);
                    this.$root.$emit('bv::toggle::modal', username)
                    break;
                case 'tweet':
                    this.$root.$emit('bv::toggle::modal', username+index)
                    break;
            
                default:
                    break;
            }
        },
    }
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
