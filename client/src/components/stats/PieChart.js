import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    data: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  mounted () {
    this.options.title.text = this.title;
    this.renderChart(this.data, this.options)
  }
}