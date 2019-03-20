<template>
    <div style="width:150px; margin-top:30vh;" class="mx-auto">
        <pacman-loader  :loading="loading" :color="'#5bc0de'" :size="'30px'"/>
        <p class="mt-2">
        We're working on it...</p>
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
