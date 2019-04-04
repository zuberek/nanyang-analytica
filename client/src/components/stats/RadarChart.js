import { Radar } from 'vue-chartjs'
// import Chart from 'chart.js'

// Chart.defaults.global.defaultFontColor = 'red';

export default {
  extends: Radar,
  props: {
    data: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    console.log('renders!');
    this.renderChart(this.data, this.options)
  }
}