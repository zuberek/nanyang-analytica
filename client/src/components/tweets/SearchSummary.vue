<template>
    <div v-if="stats.count === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                {{ text }}
            </span>
            <br><br>
            <!-- <button class="btn btn-warning" @click="runAI">WAKE UP THE AI!</button> -->
            
        </div>
    </div>
    <div v-else class="d-flex flex-row justify-content-between">
        <div class="mt-2">
            <p v-if="stats.count > 0" class="font-weight-bold">Found {{stats.count}} results in {{stats.time}} Miliseconds</p>
        </div>
        <div class="mb-2">   
            <div class="dropdown">
                <button class="btn btn-warning dropdown-toggle mx-auto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Sort by
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" @click="sort('match');loadPage(1)">Best Match</a>
                    <a class="dropdown-item" @click="sort('lengthDsc');loadPage(1)">Long to Short</a>
                    <a class="dropdown-item" @click="sort('lengthAsc');loadPage(1)">Short to Long</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        stats: {
            type: Object,
            required: true,
        },
        sort: {
            type: Function,
            required: true,
        },
        loadPage: {
            type: Function,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
}
</script>

