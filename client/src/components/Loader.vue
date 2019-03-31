<template>
    <div class="d-flex justify-content-center mx-auto" style="width:200px; margin-top:20vh;">
        <div>
            <pacman-loader  :loading="loading" :color="'#ffc107'" :size="'30px'" class="ml-3"/>
            <p class="mt-2 text-center" v-html="text" />
        </div>
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
