<template>
    <div style="width:120px; margin-top:30vh;" class="mx-auto">
        <pacman-loader  :loading="loading" :color="'#5bc0de'" :size="'30px'"/>
    </div>
</template>

<script>
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'

export default {
    name: 'loader',
    components: {
        PacmanLoader
    },
    props: {
        loading: {
            type: Boolean,
            required: true,
        },
    },
}
</script>

<style>
.loader {
    position: relative;
    top: 50%;
    margin-top: -10px;
  }
</style>

