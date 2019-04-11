<template>
    <b-modal size="lg"  :id="tweet.id">
        <div class="row">
            <div class="col-md-4 mb-2">
                <p class="card-text" v-html="tweet.body"/>
            </div>
            <div class="col-md-8">
                <div class="row">
                    <div class="col-md-4  mb-2">
                        <small><strong>Gender</strong></small>
                        <div v-for="type in gender" :key="type.type + tweet.id">
                            {{ type.type }}: {{ type.val }}
                        </div>
                    </div>
                    <div class="col-md-4  mb-2">
                        <small><strong>Age</strong></small>
                        <div v-for="type in age" :key="type.type + tweet.id">
                            {{ type.type }}: {{ type.val }}
                        </div>
                    </div>
                    <div class="col-md-4  mb-2">
                        <small><strong>Personality</strong></small>
                        <div v-for="type in personality" :key="type.type + tweet.id">
                            {{ type.type }}: {{ type.val }}
                        </div>
                    </div>
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
        gender() {
            var male = this.tweet.gender;
            var gender = {};
            gender.male = male;
            gender.female = Math.floor((Math.random() * 40) + 30);
            var result = []
            for (const type in gender) {
                result.push({
                    type,
                    val: gender[type]
                })
            }
            return result;
        },
        age() {
            var age = this.tweet.age;
            var result = []
            for (const type in age) {
                result.push({
                    type,
                    val: age[type]
                })
            }
            return result;
        },
        personality() {
            var personality = this.tweet.personality;
            var result = []
            for (const type in personality) {
                result.push({
                    type,
                    val: personality[type]
                })
            }
            return result;
        },
    },
}
</script>
