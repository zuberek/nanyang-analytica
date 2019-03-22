<template>
    <PushRotate 
        disableOutsideClick 
        noOverlay 
        :crossIcon="false"
        :isOpen="isOpen"    
        @openMenu="set(true)"
    >
        <div class="flex brand">
            <img height="100px" src="../assets/logo-white.png" alt="">
            <span class="align-self-center">
                Nanyang
                Analytica
            </span>
        </div>
                
        <div class="row" v-bind:class="{ 'd-none': !isOpen }">
            <div class="col-12">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Search</label>
                        <input class="form-control" type="text" placeholder="Keyword" v-model="query.search">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Gender</label>
                        <select class="form-control" v-model="query.gender">
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="customRange1">Age: {{query.age[0]}} - {{query.age[1]}}</label>
                        <vue-slider v-model="query.age" :lazy="true"/>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1">
                        <label class="form-check-label" for="exampleCheck1">Dynamically load Twitter data</label>
                        <small class="form-text text-muted mt-0 mb-1">Can take up to few minutes.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Language</label>
                        <select class="form-control" v-model="fields.language">
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Location</label>
                        <select class="form-control" v-model="fields.location">
                            <option>Europe</option>
                            <option>Asia</option>
                        </select>
                    </div>
                    <button class="btn btn-info" @click="submit">Submit</button>
            </div>
        </div>
        

    </PushRotate>
</template> 

<script>
import { PushRotate } from 'vue-burger-menu';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
    components: {
        PushRotate,
        VueSlider,
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        query: {
            type: Object,
            required: true,
        },
        fields: {
            type: Object,
            required: true,
        },
        set: {
            type: Function,
            required: true,
        },
        load: {
            type: Function,
            required: true,
        }
    },
    methods: {
        submit() {
            this.set(false);
            this.load();
        }
    },
}
</script>

<style>
.brand {
    font-size: 20px;
    font-weight: 900;
}

.bm-item-list {
    font-size: 15px;
}
</style>

