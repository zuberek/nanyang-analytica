<template>
    <div class="row " style="margin-top: 40px !important;">
        <div class="col-10 pt-3 pl-1 pb-3 pr-0">
            <div v-for="type in query.personality" :key="type.name">
                <div class="row">
                    <div class="col-7 mb-1 pr-0 pl-4">
                        {{ type.name }}:
                    </div>
                    <div class="col-5 px-0 pl-2">
                        <div class="row">
                            <div class="col-7 pr-0">
                                {{ type.val[0] }} - {{ type.val[1] }}
                            </div>
                            <div class="col-4 px-0 pr-2">
                                <div class="d-inline"
                                @click="curr = type.name">
                                    <i v-bind:class="{ 'far fa-circle': type.name != curr, 'far fa-dot-circle': type.name == curr }" ></i> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 
            </div>
        </div>
        <div class="col-2 px-0">
            <vue-slider
                :tooltip-placement="'right'"
                v-model="values"
                :marks="marks"
                :lazy="true"
                :enable-cross="false"
                direction="btt"
                :height="150"
                style="m-4"
            />
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
export default {
    components: {
        VueSlider,
    },
    data () {
        return {
            curr: 'Conscientiousness',
            marks: [0, 50, 100],
            loadText: 'Load',
        }
    },
    props: {
        query: {
            type: Object,
            required: true,
        },
    },
    computed: {
        values: {
            get: function() {
                return this.query.personality.find(p => p.name == this.curr).val
            },
            set: function(val) {
                var index = this.query.personality.findIndex(p => p.name == this.curr)
                this.query.personality[index].val = val
            }
        },
    },
}
</script>

<style>
  .far {
    font-size: 22px;
    color: #ffc107;
    cursor: pointer;
  }
</style>
