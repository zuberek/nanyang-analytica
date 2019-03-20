<template>
    <div v-if="twitts.length === 0" class="whole-page">
        <div style="width:250px; margin-top:20vh;" class="mx-auto text-center">

            <span>
                Hello! 🤗 <br>
                To search Twitter type in a keyword <br>
                or go to options
            </span>
            
        </div>
    </div>
    <div v-else class="row text-center">
        <div v-for="twitt in twitts" :key="twitt.id" class="col-lg-6 col-12 mb-2">
            <div class="card">
                <div class="row m-4">
                    <div class="col-sm-3 col-12">
                        <img class="card-img-top" :src="twitt.user.picture.medium" style="width:100px;height:100px;border-radius: 50%;" alt="Card image cap">
                        <h5 class="card-title mt-2">{{twitt.user.name.first}} {{twitt.user.name.last}}</h5>
                        <p>{{twitt.user.registered.date.substring(0, 10)}}</p>
                    </div>
                    <div class="col-sm-9 col-12">
                        <div class="card-body">
                            <p class="card-text">{{twitt.joke}}</p>
                            <a href="#" class="btn btn-info">Go to user</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>   
    </div>
</template>

<script>
export default {
    name: 'twitts',
    props: {
        twitts: {
            type: Array,
            required: true,
        },
    },
}
</script>