<template>
  <div class="card p-3">
      <h5 class="font-weight-bold">Search Statistics</h5>
      <div v-if="stats">
        <div  class="row mb-2">
            <div class="col-lg-4 pr-0 mb-4" style="font-size:">
                <div class="row justify-content-center">
                      <div class="col-12 mb-2">
                        <!-- <p class="font-weight-bold mb-0">Summary</p> -->
                        <small>This search term is mainly mentioned by people that are <strong>{{ short.gender }}</strong>  and <strong> {{ short.age }}</strong>,
                        higher on <strong>{{ diff.sort((a, b) => b.val - a.val)[0].name }}</strong> and lower on <strong>{{ diff.sort((a, b) => a.val - b.val)[0].name }}</strong></small>
                      </div>
                      <small>Summary: </small>
                      <div v-for="type in diff" :key="type.name" class="col-4 col-md-12">
                        <small>
                          <i :class="getClass(type.val)"></i> 
                          {{ type.val }}% {{ type.name }}<br>
                        </small>
                      </div>
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
      <div v-else>
        Cracking up the numbers...
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
    props: {
      stats: {
        type: Object,
        required: false,
      },
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.windowWidth = window.innerWidth;
        });
      });
    },
    computed: {
      short() {
        if (!this.stats.search) return;
        var short = {}
        short.gender = (this.stats.search.gender.male >= this.stats.search.gender.female) ? 'man' : 'woman';
        var ages = [];
        for (const age in this.stats.search.age) {
          ages.push({name: age, val: this.stats.search.age[age]})
        }
        short.age = ages.sort((a, b) => b.val - a.val)[0].name;
        return short;
      },
      diff() {
        if (!this.stats.search) return;
        var search = this.stats.search.personality;
        var average = this.stats.average.searchPersonality;
        return [
          {
            name: 'Conscientiousness',
            val: search.conscientiousness - average.conscientiousness
          },
          {
            name: 'Neuroticism',
            val:  search.neuroticism - average.neuroticism
          },
          {
            name: 'Extraversion',
            val:  search.extraversion - average.extraversion
          },
          {
            name: 'Agreeableness',
            val:  search.agreeableness - average.agreeableness
          },
          {
            name: 'Openess',
            val:  search.openess - average.openess
          },
        ]
      },
      mobile() {
        return this.windowWidth < 800;
      },
      genderData() {            
        var gender = [];
        if (!this.stats.search) return;
        for (const type in this.stats.search.gender) {
            gender.push(this.stats.search.gender[type])
        }

        var data = {
            labels: ['Man', 'Woman'],
            datasets: [
                {
                    backgroundColor: [
                        '#DD1B16',
                        '#28a745',
                    ],
                    data: gender
                }
            ]
        }
        return data;
      },
      ageData() {             
        var age = [];
        if (!this.stats.search) return;
        for (const type in this.stats.search.age) {
            age.push(this.stats.search.age[type])
        }
        var data = {
          labels: ['Young', 'Adult', 'Senior'],
          datasets: [
              {
                  backgroundColor: [
                      '#007bff',
                      '#DD1B16',
                      '#ffc107',
                  ],
                  data: age
              }
          ]
        }
        return data;
      },
      personalityData() {
            var search = [];
            var average = [];
            if (!this.stats.search) return;
            for (const type in this.stats.search.personality) {
                if(type == 'neuroticism') {
                  search.push(100 - this.stats.search.personality[type])
                  average.push(100 - this.stats.average.searchPersonality[type])
                } else {
                  search.push(this.stats.search.personality[type])
                  average.push(this.stats.average.searchPersonality[type])
                }
            }
            var data =  { labels: ['Conscientiousness','Neuroticism', 'Extraversion', 'Agreeableness', 'Openess'],
                datasets: [
                    {
                        label: 'Search',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgb(255, 10, 122)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: search,
                    },
                    {
                        label: 'Average',
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgb(23, 162, 184)',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                        data: average,
                    },
                ]
            }
            return data;
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
    },
    methods: {
      getClass(val) {
        if(val > 0) return 'fas fa-chevron-circle-up'
        if(val == 0) return 'fas fa-minus-circle'
        if(val < 0) return 'fas fa-chevron-circle-down'
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
  .fa-chevron-circle-up {
    color: #28a745
  }
  .fa-minus-circle {
    color: #ffc107
  }
  .fa-chevron-circle-down {
    color: #DD1B16
  }
</style>