<template>
    <PushRotate 
        disableOutsideClick 
        noOverlay 
        :crossIcon="false"
        :isOpen="isOpen"    
        @openMenu="set(true)"
        @closeMenu="set(false)"
    >
        <div class="flex brand">
            <img height="100px" src="../assets/logo-white.png" alt="">
            <span class="align-self-center">
                Nanyang
                Analytica
            </span>
        </div>
                
        <div class="row" v-if="isOpen">
            <div class="col-12">
                    <h5 class="text-uppercase">Search</h5>
                    <div class="form-group ">
                        <input class="form-control" type="text" placeholder="Keyword" v-model="query.search">
                    </div>
                    <div class="form-group">
                        <label for="">Gender</label>
                        <select class="form-control" v-model="query.gender">
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="customRange1">Age: {{query.age[0]}} - {{query.age[1]}}</label>
                        <vue-slider v-model="query.age" :lazy="true"/>
                    </div>
                    <button class="btn btn-info mb-2" @click="submit">Search</button>

                    <h5 class="text-uppercase mt-4">data</h5>
                    <div class="form-check mb-2">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="useStatic">
                        <label class="form-check-label" for="exampleCheck1">Use preloaded data</label>
                        <small class="form-text text-muted mt-0 mb-1">15k records</small>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="fields.dynamic">
                        <label class="form-check-label" for="exampleCheck1">Dynamically load Twitter data</label>
                        <small class="form-text text-muted mt-0 mb-1">1k, Can take up to few minutes to load.</small>
                    </div>
                    <div v-if="fields.dynamic">
                        <div class="form-group">
                            <label for="">Language</label>
                            <select class="form-control" v-model="fields.language">
                                <option>Any</option>
                                <option>English</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Location</label>
                            <select class="form-control" v-model="fields.location">
                                <option>World</option>
                                <option>Europe</option>
                                <option>Asia</option>
                            </select>
                        </div>
                        <button class="btn btn-info mb-2" @click="submit">Load</button>
                    </div>               
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
    computed: {
        useStatic: {
            get: function () {
                return !this.fields.dynamic
            },
            set: function (newValue) {
                this.fields.dynamic = !newValue
            }
        }
    }
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

