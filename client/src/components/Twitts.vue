<template>
    <div v-if="twitts.length === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                {{ text }}
            </span>
            <br><br>
            <button class="btn btn-warning" @click="runAI">FUCK THE AI!</button>
            
        </div>
    </div>
    <div v-else class="list">
        <div class="d-flex flex-row justify-content-between">
            <div class="mt-2">
                <p v-if="info" class="font-weight-bold">Found {{info.count}} results in {{info.time}} Miliseconds</p>
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
        
        <div v-if="info.count>0"  class="text-center row">
            <div v-for="(twitt, index) in twitts" :key="index" class="col-lg-6 mb-2" v-bind:class="{ 'col-6': open }" >
                <div class="card hoverable">
                    <div class="row m-4">
                        <div class="col-sm-4 col-12" v-bind:class="{ 'col-sm-12 my-4': open }">
                            <img class="card-img-top" :src="twitt.photo" style="width:100px;height:100px;border-radius: 50%;" alt="Card image cap">
                            <h5 class="card-title mt-2 mb-0" v-html="twitt.name" />
                            <!-- <small class="text-muted mt-0 mb-1">{{twitt.gender}}, {{twitt.age}} years</small> -->
                            <small class="text-muted mt-0 mb-1">{{twitt.username}} {{twitt.time}}</small>
                             
                        </div>
                        <div class="col-sm-8 col-12" v-if="!open">
                            <div class="card-body">
                                <p class="card-text" v-html="twitt.body"/>
                                <a :href="twitt.link" rel="noopener noreferrer" target="_blank" class="btn btn-warning">Go to tweet</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="twitts.length<5" class="screen-pusher"></div>

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
export default {
    name: 'twitts',
    props: {
        runAI: {
            type: Function,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
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
        open: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        noOfPages () {
            var num = 0;
            if(this.info.count) num = Math.ceil(this.info.count/8);
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
</style>
