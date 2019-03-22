<template>
    <div style="width:200px; margin-top:20vh;" class="mx-auto">
        <pacman-loader  :loading="loading" :color="'#5bc0de'" :size="'30px'"/>
        <p class="mt-2">
        {{ text }}</p>
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
        text: {
            type: String,
            required: true,
        },
    },
}
</script>
