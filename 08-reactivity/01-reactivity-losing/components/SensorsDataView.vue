<template>
  <div v-if="!sensors">Loading...</div>
  <template v-else>
    <SensorsDataRow v-for="sensor in sensors" :key="sensor.id" :sensor="sensor" />
  </template>
</template>

<script>
import { SensorsDataController } from '../services/SensorsDataController';
import { SensorsDataStreamingService } from '../services/SensorsDataStreamingService';
import SensorsDataRow from './SensorsDataRow';
import {reactive, computed, ref, toRefs } from '../vendor/vue.esm-browser.js';

export default {
  name: 'SensorsDataView',

  components: { SensorsDataRow },

  data() {
    return {
      sensors: null,
    };
  },

  mounted() {
    const SensorsDataStream = new SensorsDataStreamingService()
    this.sensorsDataController = new SensorsDataController(SensorsDataStream);
    
    this.sensorsDataController.addDataCallback(this.callback);

    // Раз в секунду запрашиваем и выводим новые данные сенсоров
    setInterval(() => {
      this.sensorsDataController.getData(); 
    }, 1000);
  },

  beforeUnmount() {
    this.sensorsDataController.removeDataCallback(this.callback);
    this.sensorsDataController.close();
  },

  methods: {
    callback(data) {
      this.setData(data);
    },

    setData(sensors) {
      this.sensors = {}
      for (let key in sensors){
        let sensor = sensors[key]
         this.sensors[key] = sensor
         this.sensors[key].value = ref(sensor.value)
      }
    },
  },


};
</script>

<style scoped></style>
