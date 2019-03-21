<template>
    <div v-if="twitts(0,1).length === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                Hello! 🤗 <br>
                To search Twitter type in a keyword <br>
                or go to options
            </span>
            
        </div>
    </div>
    <div v-else class="list ">
        <p v-if="info">Found {{info.count}} results in {{info.time}} Miliseconds</p>
        <div  class="text-center row">
            <div v-for="(twitt, index) in twitts(0,10)" :key="index" class="col-lg-6 col-12 mb-2">
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
            type: Function,
            required: true,
        },
        info: {
            type: Object,
            required: true,
        },
    },
}
</script>

<style>
.list {
    margin-top: -15px;
}
</style>
