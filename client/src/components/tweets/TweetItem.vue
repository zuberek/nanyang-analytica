<template>
    <div class="card hoverable fancy-tweet" @mouseenter="toggleCollapse(tweet.id)" @mouseleave="toggleCollapse(tweet.id)">
        <div class="row m-4">
            <div class="col-sm-4 p-2" v-bind:class="{ 'col-sm-12 my-4': sidebarOpen }">
                <div>
                    <img class="card-img-top" :src="tweet.user.photo" alt="Card image cap">
                </div>
                <h5 class="card-title mt-2 mb-0" v-html="tweet.name" />
                <!-- <small class="text-muted mt-0 mb-1">{{tweet.gender}}, {{tweet.age}} years</small> -->
                <small class="text-muted mt-0 mb-1">{{tweet.user.username}} <br> {{getHumanDate(tweet.time)}}</small>
                    
            </div>
            <div class="col-sm-8" v-if="!sidebarOpen">
                <div class="card-body">

                    <p class="card-text" v-html="tweet.body"/>
                </div>
            </div>
        </div>
        <b-collapse :id="tweet.id" :visible="mobile">
            <div class="card-footer text-muted row mx-0">
                <div class="mt-2 col-4">
                    <div style="cursor: pointer;" @click="toggleModal(tweet.id + tweet.user.username)">
                        <div>
                            <i class="fas fa-user-circle" ></i> <br>
                            Profile
                        </div>
                    </div>
                </div>
                <div class="mt-2 col-4">
                    <div style="cursor: pointer;" @click="toggleModal(tweet.id)">
                        <div>
                            <i class="fas fa-info-circle" ></i> <br>
                            Tweet
                        </div>
                    </div>
                    </div>
                    <div class="mt-2 col-4">
                    <div style="cursor: pointer;" @click="toggleModal('asdf')">
                        <a :href="tweet.link" rel="noopener noreferrer" target="_blank" > 
                            <i class="fas fa-play-circle" ></i> <br>
                            Link
                        </a>
                    </div>
                    </div>
            </div>  
        </b-collapse>
        <b-modal size="lg" :id="tweet.id">
            <div class="d-block"> {{ tweet.body }}</div>
        </b-modal>

        
        <user-modal :tweet="tweet"/>
    </div>
</template>

<script>
import BCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import BModal from 'bootstrap-vue/es/components/modal/modal'
import UserModal from '../modals/UserModal.vue'

export default {
    components: {
        BCollapse,
        BModal,
        UserModal,
    },
    props: {
        tweet: {
            type: Object,
            required: true,
        },
        sidebarOpen: {
            type: Boolean,
            required: true,
        },
        mobile: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        getHumanDate(dateString) {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var date = new Date(dateString);
            return date.toDateString(options)
        },
        toggleCollapse(id) {
            // console.log('toogle collapse ' + id);
            this.$root.$emit('bv::toggle::collapse', id)
        },
        toggleModal(id) {
            // console.log('toogle modal ' + id);
            this.$root.$emit('bv::toggle::modal', id)
        },
    }
}
</script>
