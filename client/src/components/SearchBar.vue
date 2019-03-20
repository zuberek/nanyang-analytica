<template>
  <div class="row" style="height:100px">
      <div class="col">
        <form
        action="#"
        method="post"
        @submit.prevent="load"
        >
            <input class="form-control" type="text" v-model="query.search" placeholder="Keyword"> 
        </form>
        <span 
            v-for="key in Object.keys(filteredQuery)" 
            :key="key"
            class="badge badge-info mx-2">
                {{key}}: {{filteredQuery[key]}} | 
                    <span @click="reset(key)"> X </span>
        </span>
      </div>
  </div>
</template>

<script>
export default {
    name: 'searchBar',
    props: {
        query: {
            type: Object,
            required: true,
        },
        load: {
            type: Function,
            required: true,
        },
    },
    computed: {
        filteredQuery() {
            var filteredQuery = {};
            // Remove empty
            Object.keys(this.query).forEach(key => {
                if(this.query[key]) filteredQuery[key] = this.query[key];
            });
            // Remove age if default
            if(this.query.age[0] === 0 && this.query.age[1] === 100) 
                delete filteredQuery.age;
            return filteredQuery;
        }
    },
    methods: {
        reset(key) {
            if (key === 'age') this.query.age = [0, 100];
            else this.query[key] = "";
        }
    },
}
</script>

