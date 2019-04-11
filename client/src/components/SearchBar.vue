<template>
  <div class="row" style="height:80px">
      <div class="col">
        <form
        action="#"
        method="post"
        @submit.prevent="load"
        >
            <input class="form-control" type="text" v-model="query.search" placeholder="Keyword" @input="load" @focus="show=true" @blur="show=false">
            <small v-if="show" class="form-text text-muted mt-0 mb-1">Avaiable fields are: name, body.
          For tips on use go to <a rel="noopener noreferrer" target="_blank" href="https://lunrjs.com/guides/searching.html#wildcards"> <strong>Lunr</strong> </a></small>
        </form>
        <div v-if="Object.keys(filteredQuery).length > 0" class="mb-4">
            <span 
                v-for="key in Object.keys(filteredQuery)" 
                :key="key"
                class="badge badge-warning mx-2">
                    {{key}}: {{filteredQuery[key]}} | 
                        <span @click="reset(key)" style="cursor: pointer;"> X </span>
            </span>
        </div>
        
      </div>
  </div>
</template>

<script>
export default {
    name: 'searchBar',
    data () {
        return {
            show: false,
        }
    },
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
                if(key == 'personality') {
                    this.query[key].forEach(type => {
                        if(type.val[0] !== 0 || type.val[1] !== 100)
                            filteredQuery[type.name] = type.val
                    })
                } else if(this.query[key]) filteredQuery[key] = this.query[key];
            });
            // Remove age if default
            if(this.query.age[0] === 0 && this.query.age[1] === 100) 
                delete filteredQuery.age;
            return filteredQuery;
        },
        mobile() {
            return this.windowWidth < 800;
        }
    },
    methods: {
        reset(key) {
            if (key === 'age') this.query.age = [0, 100];
            else this.query[key] = "";

            this.load();
        }
    },
}
</script>

