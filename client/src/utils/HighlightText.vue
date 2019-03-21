<template>
    <div>
        <p v-html="rawHTML"/>
    </div>
    
</template>

<script>
export default {
    name: 'highlight',
    props: {
        text: {
            type: String,
            required: true,
        },
        positions: {
            type: Array,
            required: true
        }
    },
    computed: {
        rawHTML() {
            var html = this.text;
            var shift = 0;

            this.positions.forEach(pos => {
                html = html.slice(0, pos[0]+shift) + "<mark>" + 
                    html.slice(pos[0]+shift, pos[0]+pos[1]+shift) + "</mark>" 
                    + html.slice(pos[0]+pos[1]+shift);

                shift = shift + 13;
            });
            return html
        }
    },
}
</script>

