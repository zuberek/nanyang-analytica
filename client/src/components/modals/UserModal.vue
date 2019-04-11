<template>
    <b-modal size="lg"  :id="tweet.id + user.username">
        <div class="row">
            <div class="col-5">
                <div class="mb-2">
                    <img class="card-img-top" :src="user.photo" alt="Card image cap">
                </div>
                {{user.name}}
            </div>
            <div class="col-7">
                {{ user.age }} {{ user.gender }} <br>
                <small class="mt-2"><strong>Personality</strong></small>
                <div v-for="type in personality" :key="type.type + tweet.id">
                    {{ type.type }}: {{ type.val }}
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import BModal from 'bootstrap-vue/es/components/modal/modal'
export default {
    components: {
        BModal,
    },
    props: {
        tweet: {
            type: Object,
            required: true,
        },
    },
    computed: {
        user() {
            var user = {}
            if(this.tweet.user.age == 0) user.age = 'Young'
            if(this.tweet.user.age == 1) user.age = 'Adult'
            if(this.tweet.user.age == 2) user.age = 'Senior'
            user.gender = (this.tweet.user.gender == 0) ? 'Man' : 'Woman'
            return {
                ...this.tweet.user,
                age: user.age,
                gender: user.gender,
            };
        },
        personality() {
            var personality = this.user.personality;
            var result = []
            for (const type in personality) {
                if(type == 'neuroticism') {
                    result.push({
                        type,
                        val: Math.floor(100 - personality[type] * 100)
                    })
                } else {
                    result.push({
                        type,
                        val: Math.floor(personality[type] * 100)
                    })
                }
            }
            return result;
        },
    },
}
</script>
