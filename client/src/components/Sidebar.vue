<template>
    <ScaleRotate 
        disableOutsideClick
        noOverlay
        v-click-outside="close"
        width="320"
        :isOpen="isOpen"    
        @openMenu="set(true)"
        @closeMenu="close"
    >
        <div class="flex brand">
            <img height="100px" src="../assets/logo-white.png" alt="">
            <span class="align-self-center">
                Nanyang
                Analytica
            </span>
        </div>
                
        <div class="row px-4" v-if="isOpen">
            <div class="col-12">
                    <h5 class="text-uppercase">Search</h5>
                    <form
                      action="#"
                      method="post"
                      @submit.prevent="submit"
                    >
                    <div 
                      class="form-group"
                      v-tooltip.right="{ html: 'tooltipContent', visible: !mobile }"
                    >
                        <div class="input-group">
                          <input class="form-control" type="text" placeholder="Keyword" v-model="query.search">
                          <div class="input-group-append">
                            <button  
                              class="d-none" 
                              type="submit" />
                            <div  
                              class="btn btn-outline-warning"
                              v-b-toggle.collapse-1>
                              More <i class="fas fa-caret-down" ></i> 
                            </div >
                          </div>
                        </div>
                    </div>
                    <b-collapse id="collapse-1" class="mt-2">
                        <div class="form-group">
                            <label for="">Gender</label>
                            <select class="form-control" v-model="query.gender">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div class="form-group mb-4">
                            <label for="customRange1">Age: {{query.age[0]}} - {{query.age[1]}}</label>
                            <vue-slider 
                                :marks="true"
                                :data="data" 
                                v-model="query.age" 
                                :lazy="true"
                                :enable-cross="false"
                            />
                        </div>

                        <personality-picker :query="query"/>
                    </b-collapse>
                    
                    <div class="row justify-content-around">
                    <button 
                      class="btn btn-warning my-2" 
                      @click="submit"
                      v-scroll-to="'.top'"
                    >Search</button>
                    </div>
                    </form>

                    <h5 class="text-uppercase mt-4" >data</h5>
                    <!-- <div 
                      class="form-check mb-2"
                      v-tooltip.right="{ content: 'Use our preprepared data of random Twitter users.', visible: !mobile }"
                    >
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="useStatic">
                        <label class="form-check-label" for="exampleCheck1">Use preloaded data</label>
                        <small class="form-text text-muted mt-0 mb-1">10k records</small>
                    </div>
                    <div 
                      class="form-check"
                      v-tooltip.right="{ content: 'Input your own usernames and let us analyze it for you.', visible: !mobile }"
                    >
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="fields.dynamic">
                        <label class="form-check-label" for="exampleCheck1">Dynamically load Twitter data</label>
                    </div> -->
                    <div>
                        <form
                        action="#"
                        method="post"
                        @submit.prevent="split"
                        >
                        <div class="form-group mt-2">
                            <label for="">User Names</label>
                            <div class="input-group">
                              <input 
                                  class="form-control" 
                                  type="text" 
                                  placeholder="Usernames" 
                                  v-model="currUserName"
                                  v-tooltip.top="{ content: 'Type in any username to load', visible: !mobile }"
                              >
                              <div class="input-group-append">
                                <button  
                                  class="d-none" 
                                  type="submit" />
                                <button  
                                  class="btn btn-outline-warning" 
                                  @click="preload">
                                  Random
                                </button >
                              </div>
                            </div>
                        </div>
                        </form>
                        <div 
                          class="form-group mb-4"
                          v-tooltip.right="{ content: 'Load our preprocessed, static data', visible: !mobile }"
                        >
                          <label for="customRange1">Load: {{asdf}}k</label>
                          <vue-slider 
                              :marks="marks"
                              v-model="asdf" 
                              :lazy="true"
                              :included="true"
                          />
                        </div>
                        <div 
                            v-if="dataFields.dynamic.length > 0" 
                            class="row mb-2"
                            style="max-width:300px;">
                            <div v-for="(name) in dataFields.dynamic" :key="name" class="badge badge-warning m-1 badge-name">
                                <span>
                                    {{ name }} </span>
                                | <span @click="remove(name)" style="cursor: pointer;"> X </span>
                            </div>
                        </div>
                        <div class="row justify-content-around">
                            
                            <small 
                              v-if="dataFields.dynamic.length>0 && asdf" 
                              class="form-text text-muted mt-0 mb-1"> 
                              {{ msg.side.load }}
                            </small>

                            <button 
                            class="btn btn-warning my-2" 
                            @click="loadDataMethod"
                            v-scroll-to="'.top'"
                            >
                              {{loadText}}
                            </button>

                            <button
                                v-if="dataFields.dynamic.length>0"
                                class="btn btn-warning mb-2" 
                                @click="dataFields.dynamic=[]">
                            Clear</button>

                        </div>               
                    </div>               
            </div>
        </div>
        

    </ScaleRotate>
</template> 

<script>
import { ScaleRotate } from 'vue-burger-menu';
import BCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import VueSlider from 'vue-slider-component';
import PersonalityPicker from './PersonalityPicker.vue';
import randomUsers from "../utils/randomUsers.js";
import msg from '../messages.js';
import BToggleDirective from 'bootstrap-vue/es/directives/toggle/toggle'

export default {
    components: {
        ScaleRotate,
        VueSlider,
        PersonalityPicker,
        BCollapse,
    },
    directives: {
      'b-toggle': BToggleDirective
    },
    data () {
        return {
            msg,
            asdf: 10,
            currUserName: '',
            marks: [0, 10, 50, 100],
            data: [18, 25, 34, 100],
            loadText: 'Load',
        }
    },
    methods: {
        loadDataMethod(){
          if(this.currUserName) this.dataFields.dynamic.push(this.currUserName);
          this.update(this.asdf);
          this.dataFields.static = this.asdf;
          this.loadText = 'Reload';
          this.loadDynamic();
        },
        submit() {
            this.set(false);
            this.load();
        },
        preload() {
          var random = randomUsers
              .filter(u => !this.dataFields.dynamic.includes(u) && u.length>0)
              .sort(() => Math.random() - 0.5)
              .slice(0,3);
          this.dataFields.dynamic = this.dataFields.dynamic.concat(random);
          this.loadDataMethod();
        },
        remove(name){
            this.dataFields.dynamic = this.dataFields.dynamic.filter(n => n != name);
        },
        close(){
          this.set(false);
        },
        split(){
          if(this.currUserName) this.dataFields.dynamic.push(this.currUserName);
          this.currUserName = '';
        }
    },
    watch: {
        currUserName: function (val) {
            var elems = val.split(' ');
            if(elems.length > 1){
                this.dataFields.dynamic = this.dataFields.dynamic.concat(elems.filter(e => e.length > 0));
                this.currUserName = '';
            }
        },
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
        set: {
            type: Function,
            required: true,
        },
        load: {
            type: Function,
            required: true,
        },
        dataFields: {
          type: Object,
          required: true,
        },
        loadDynamic: {
            type: Function,
            required: true,
        },
        mobile: {
            type: Boolean,
            required: true,
        },
        update: {
            type: Function,
            required: true,
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
    font-size: 15px !important;
    margin-left: 0 !important;
}
.badge-name input{
    background-color: #ffc107;
    border: 0;
    outline: none;
}
.badge-name input:active{
    border: 0;
}
.vue-slider-disabled .vue-slider-rail {
  background-color: #ccc;
}
.vue-slider-disabled .vue-slider-dot-handle {
  background-color: #666;
}
.vue-slider-disabled .vue-slider-process {
  background-color: #666;
}
.vue-slider-disabled .vue-slider-mark-step {
  background-color: #666;
}
.vue-slider-disabled .vue-slider-mark-step-active {
  background-color: #ccc;
}

.vue-slider-rail {
  background-color: #f1d39f;
  border-radius: 15px;
}

.vue-slider-process {
  background-color: #eeaa00;
  color: #666;
  border-radius: 15px;
}

.vue-slider-mark {
  z-index: 4;
}
.vue-slider-mark-step {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eeaa00;
  /* background-color: #eeaa00; */
}
.vue-slider-mark-step-active {
  background-color: #f1d39f;
}

.vue-slider-mark-label {
  font-size: 14px;
  white-space: nowrap;
}
.vue-slider-dot-handle {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eeaa00;
  box-sizing: border-box;
}
.vue-slider-dot-handle::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200%;
  height: 200%;
  background-color: rgba(238, 194, 0, 0.38);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: -1;
  transition: transform 0.2s;
}
.vue-slider-dot-handle-focus::after {
  transform: translate(-50%, -50%) scale(1);
}

.vue-slider-dot-handle-disabled {
  cursor: not-allowed;
  background-color: #666;
}

.vue-slider-dot-tooltip {
  visibility: visible;
}
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner {
  opacity: 1;
}
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner-top {
  transform: rotateZ(-45deg);
}
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner-bottom {
  transform: rotateZ(135deg);
}
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner-left {
  transform: rotateZ(-135deg);
}
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner-right {
  transform: rotateZ(45deg);
}

.vue-slider-dot-tooltip-inner {
  border-radius: 50% 50% 50% 0px;
  background-color: #e09100;
  color: #666;
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s linear;
}
.vue-slider-dot-tooltip-inner-top {
  transform: translate(0, 50%) scale(0.01) rotate(-45deg);
}
.vue-slider-dot-tooltip-inner-bottom {
  transform: translate(0, -50%) scale(0.01) rotateZ(135deg);
}
.vue-slider-dot-tooltip-inner-left {
  transform: translate(50%, 0) scale(0.01) rotateZ(-135deg);
}
.vue-slider-dot-tooltip-inner-right {
  transform: translate(-50%, 0) scale(0.01) rotateZ(45deg);
}
.vue-slider-dot-tooltip-text {
  font-size: 12px;
  white-space: nowrap;
  text-align: center;
  color: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
}

.vue-slider-dot-tooltip-inner-top .vue-slider-dot-tooltip-text {
  transform: rotateZ(45deg);
}
.vue-slider-dot-tooltip-inner-bottom .vue-slider-dot-tooltip-text {
  transform: rotateZ(-135deg);
}
.vue-slider-dot-tooltip-inner-left .vue-slider-dot-tooltip-text {
  transform: rotateZ(135deg);
}
.vue-slider-dot-tooltip-inner-right .vue-slider-dot-tooltip-text {
  transform: rotateZ(-45deg);
}

/*# sourceMappingURL=material.css.map */


</style>

