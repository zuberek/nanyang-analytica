<template>
    <b-modal size="lg"  :id="twitt.username">
        asdfasdf
        <radar-chart :data="personalityData" :options="bigOptions"></radar-chart>
    </b-modal>
</template>

<script>
import RadarChart from '../stats/RadarChart.js'
import BModal from 'bootstrap-vue/es/components/modal/modal'
export default {
    components: {
        RadarChart,
        BModal,
    },
    props: {
        twitt: {
            type: Object,
            required: true,
        },
    },
    computed: {
        personalityData() {
            var personality = [];
            if (!this.twitt.predictions) return;
            for (const type in this.twitt.predictions.personality) {
                personality.push(this.twitt.predictions.personality[type])
            }
            var data =  { labels: ['Conscientiousness','Neuroticism', 'Extraversion', 'Agreeableness', 'Openess'],
                // labels: ['O', 'C', 'E', 'A', 'N'],
                datasets: [
                    {
                        label: 'Personality',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgb(255, 10, 122)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: personality
                    },
                ]
            }
            return data;
        },
        bigOptions() {
            var options = {
            legend: {
                position: 'top',
            },
            responsive: true, 
            maintainAspectRatio: false,
            title: {
                display: true,
                position: 'top',
                padding: 2,
                text: 'Personality'
            }
            }
            return options;
      },
    },
    data () {
      return {

        bigStyle: {
            maxHeight: '300px',
            maxWidth: '320px',
            position: 'relative' // ☝ Important!
        }
      }
    },
}
</script>
