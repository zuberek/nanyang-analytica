<template>
  <div class="card hoverable p-2">
      <h5>Search Statistics</h5>
      <div class="row">
          <div class="col-6">
                <pie-chart :data="genderData" :options="smallOptions" :styles="smallStyle"></pie-chart>
          </div>
          <div class="col-6">
                <pie-chart :data="ageData" :options="smallOptions" :styles="smallStyle"></pie-chart>
          </div>
      </div>
      <div class="row mt-2">
          <div class="col-lg-8">
              <radar-chart :data="personalityData" :options="smallOptions" :styles="bigStyle"></radar-chart>
          </div>
          <div class="col-lg-4 mt-4" style="font-size:">
              <div class="row justify-content-center">
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Openness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Conscientiousness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-down" style="color: #DD1B16;"></i> -5% Extraversion<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Agreeableness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-down" style="color: #DD1B16;"></i> -5% Neuroticism<br></small></div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import RadarChart from './RadarChart.js'
  import PieChart from './PieChart.js'

  export default {
    components: {
      RadarChart,
      PieChart
    },
    data () {
      return {
        genderData: {
            labels: ['Man', 'Woman'],
            datasets: [
                {
                    backgroundColor: [
                        '#DD1B16',
                        '#28a745',
                    ],
                    data: [160, 90]
                }
            ]
        },
        ageData: {
            labels: ['Young', 'Middle Aged', 'Senior'],
            datasets: [
                {
                    backgroundColor: [
                        '#007bff',
                        '#DD1B16',
                        '#ffc107',
                    ],
                    data: [70, 90, 90]
                }
            ]
        },
        personalityData: {
            labels: ['Conscientiousness','Neuroticism', 'Extraversion', 'Agreeableness', 'Openess'],
            datasets: [
              {
                  label: 'Search',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgb(255, 10, 122)',
                  pointBackgroundColor: 'rgba(255,99,132,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(255,99,132,1)',
                  data: [28, 48, 40, 19, 96]
              },
              {
                  label: 'Average',
                  backgroundColor: 'rgba(179,181,198,0.2)',
                  borderColor: 'rgb(23, 162, 184)',
                  pointBackgroundColor: 'rgba(179,181,198,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(179,181,198,1)',
                  data: [65, 59, 90, 81, 56]
              },
            ]
        },
        smallOptions: {
            legend: {
                // Overrides the global setting
                position: 'right',
                labels: {
                // This more specific font property overrides the global property
                    fontColor: 'blue'
                }
            },
            responsive: true, 
            maintainAspectRatio: false
        },
        smallStyle: {
            maxHeight: '150px',
            position: 'relative' // ☝ Important!
        },
        bigStyle: {
            maxHeight: '300px',
            position: 'relative' // ☝ Important!
        }
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: [this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }
          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }
    }
  }
</script>

<style>
  .small-chart {
    max-width: 150px;
    max-height: 200px;
  }
  .big-chart {
    max-width: 400px;
    max-height: 400px;
  }
</style>