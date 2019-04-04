<template>
  <div class="card p-3">
      <h5 class="font-weight-bold">Search Statistics</h5>
      <div class="row">
          <div class="col-lg-4 pr-0 mb-4" style="font-size:">
              <div class="row justify-content-center">
                    <div class="col-12 mb-2">
                      <p class="font-weight-bold mb-0">Summary</p>
                      <small>This search term is mainly mentioned by <strong>adult </strong> <strong>men</strong> 
                      higher on <strong>openess</strong> and lower on <strong>agreeableness</strong></small>
                    </div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Openness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Conscientiousness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-down" style="color: #DD1B16;"></i> -5% Extraversion<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-up" style="color: #28a745;"></i> +5% Agreeableness<br></small></div>
                    <div class="col-4 col-md-12"><small><i class="fas fa-arrow-circle-down" style="color: #DD1B16;"></i> -5% Neuroticism<br></small></div>
              </div>
          </div>
          <div class="col-lg-8 pl-0">
              <radar-chart :data="personalityData" :options="bigOptions" :styles="bigStyle"></radar-chart>
          </div>
      </div>
      <div class="row">
          <div class="col-6">
              <pie-chart :data="genderData" :options="smallOptions" :styles="smallStyle" title="Gender"></pie-chart>
          </div>
          <div class="col-6">
              <pie-chart :data="ageData" :options="smallOptions" :styles="smallStyle" title="Age"></pie-chart>
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
            labels: ['Young', 'Adult', 'Senior'],
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
            // labels: ['O', 'C', 'E', 'A', 'N'],
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
        smallStyle: {
            maxHeight: '150px',
            position: 'relative' // ☝ Important!
        },
        bigStyle: {
            maxHeight: '300px',
            maxWidth: '320px',
            position: 'relative' // ☝ Important!
        },
        windowWidth: window.innerWidth,
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.windowWidth = window.innerWidth;
        });
      });
    },
    computed: {
      mobile() {
        return this.windowWidth < 800;
      },
      smallOptions() {
        var options = {
          legend: {
            position: 'right',
            labels: {
                boxWidth: 30,
                fontSize: 12,
            }
          },
          responsive: true, 
          maintainAspectRatio: false,
          title: {
            display: true,
            padding: 2,
          }
        }
        if(this.mobile) {
          options.legend.position  = 'top';
          options.legend.labels.boxWidth  = 10;
          options.legend.labels.fontSize  = 10;
        }

        return options;
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
    }
  }
</script>

<style>
  .small-chart {
    max-width: 200px;
    max-height: 200px;
    position: relative;
  }
  .big-chart {
    max-width: 400px;
    max-height: 400px;
    position: relative;
  }
</style>