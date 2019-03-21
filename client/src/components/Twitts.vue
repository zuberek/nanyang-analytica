<template>
    <div v-if="twitts.length === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                Hello! 🤗 <br>
                To search Twitter type in a keyword <br>
                or go to options
            </span>
            
        </div>
    </div>
    <div v-else class="list ">
        <div class="d-flex flex-row justify-content-between">
            <div class="mt-2">
                <p v-if="info" class="font-weight-bold">Found {{info.count}} results in {{info.time}} Miliseconds</p>
            </div>
            <div class="mb-2">   
                <div class="dropdown">
                    <button class="btn btn-info dropdown-toggle mx-auto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Sort by
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" @click="sort('match')">Best Match</a>
                        <a class="dropdown-item" @click="sort('lengthDsc')">Long to Short</a>
                        <a class="dropdown-item" @click="sort('lengthAsc')">Short to Long</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="info.count>0"  class="text-center row">
            <div v-for="(twitt, index) in twitts" :key="index" class="col-lg-6 col-12 mb-2">
                <div class="card">
                    <div class="row m-4">
                        <div class="col-sm-3 col-12">
                            <img class="card-img-top" :src="twitt.photo" style="width:100px;height:100px;border-radius: 50%;" alt="Card image cap">
                            <h5 class="card-title mt-2">{{twitt.username}}</h5>
                            <!-- <p>{{twitt.user.registered.date.substring(0, 10)}}</p> -->
                        </div>
                        <div class="col-sm-9 col-12">
                            <div class="card-body">
                                <high-light class="card-text" :text="twitt.body" :positions="twitt.position"/>
                                <a href="#" class="btn btn-info">Go to user</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 

            <nav class="col-12 d-flex justify-content-center" aria-label="Page navigation example">
                <ul class="pagination text-center">
                    <li class="page-item" v-for="(index) in noOfPages" :key="index">
                        <a class="page-link" @click="loadPage(index)">{{index}}</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    
</template>

<script>
import HighLight from '../utils/HighlightText.vue'

export default {
    name: 'twitts',
    components: {
        HighLight,
    },
    props: {
        twitts: {
            type: Array,
            required: true,
        },
        info: {
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
    },
    computed: {
        noOfPages () {
            var num = 0;
            if(this.info.count) num = Math.floor(this.info.count/10);
            if(num > 10) num = 10;
            return num;
        },
    },
}
</script>

<style>
.list {
    margin-top: -15px;
}
</style>
