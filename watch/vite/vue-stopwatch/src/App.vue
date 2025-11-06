<template>
  <div class="stopwatch-container">
    <h1 class="title">⏱️ Vue Stopwatch</h1>
    
    <div class="display">
      {{ formattedTime }}
    </div>
    
    <div class="controls">
      <button 
        v-if="!isRunning" 
        @click="start" 
        class="btn btn-start"
      >
        Start
      </button>
      <button 
        v-if="isRunning" 
        @click="stop" 
        class="btn btn-stop"
      >
        Stop
      </button>
      <button 
        @click="reset" 
        class="btn btn-reset"
        :disabled="elapsedTime === 0"
      >
        Reset
      </button>
      <button 
        v-if="isRunning" 
        @click="recordLap" 
        class="btn btn-lap"
      >
        Lap
      </button>
    </div>
    
    <div class="laps-container" v-if="laps.length > 0">
      <div 
        v-for="(lap, index) in laps" 
        :key="index" 
        class="lap-item"
      >
        <span class="lap-number">Lap {{ laps.length - index }}</span>
        <span class="lap-time">{{ formatTime(lap) }}</span>
      </div>
    </div>
    <div class="laps-container" v-else>
      <div class="no-laps">No laps recorded yet</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const startTime = ref(null)
const elapsedTime = ref(0)
const timerInterval = ref(null)
const isRunning = ref(false)
const laps = ref([])

const formattedTime = computed(() => {
  return formatTime(elapsedTime.value)
})

const start = () => {
  startTime.value = Date.now() - elapsedTime.value
  timerInterval.value = setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value
  }, 10)
  isRunning.value = true
}

const stop = () => {
  clearInterval(timerInterval.value)
  isRunning.value = false
}

const reset = () => {
  clearInterval(timerInterval.value)
  elapsedTime.value = 0
  isRunning.value = false
  laps.value = []
}

const recordLap = () => {
  laps.value.push(elapsedTime.value)
}

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10)
  
  return `${pad(minutes)}:${pad(seconds)}.${pad(ms)}`
}

const pad = (number) => {
  return number.toString().padStart(2, '0')
}

onBeforeUnmount(() => {
  clearInterval(timerInterval.value)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#app {
  width: 100%;
  max-width: 500px;
}

.stopwatch-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.display {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-size: 4rem;
    font-weight: 300;
    text-align: center;
    padding: 30px;
    border-radius: 20px;
    margin-bottom: 30px;
    font-family: 'Courier New', monospace;
    /* 删除或减小这行 */
    /* letter-spacing: 0.1em; */
    letter-spacing: 0.02em; /* 或者使用更小的值 */
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    transition: transform 0.2s;
}



.display:hover {
  transform: translateY(-2px);
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-start {
  background: linear-gradient(135deg, #48c774, #3ec46d);
  color: white;
  box-shadow: 0 5px 20px rgba(72, 199, 116, 0.4);
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 25px rgba(72, 199, 116, 0.5);
}

.btn-stop {
  background: linear-gradient(135deg, #ff3860, #ff4757);
  color: white;
  box-shadow: 0 5px 20px rgba(255, 56, 96, 0.4);
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 25px rgba(255, 56, 96, 0.5);
}

.btn-reset {
  background: linear-gradient(135deg, #ffa502, #ff6348);
  color: white;
  box-shadow: 0 5px 20px rgba(255, 165, 2, 0.4);
}

.btn-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 25px rgba(255, 165, 2, 0.5);
}

.btn-lap {
  background: linear-gradient(135deg, #3742fa, #5f27cd);
  color: white;
  box-shadow: 0 5px 20px rgba(55, 66, 250, 0.4);
}

.btn-lap:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 25px rgba(55, 66, 250, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.laps-container {
  max-height: 300px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 15px;
  padding: 20px;
}

.laps-container::-webkit-scrollbar {
  width: 8px;
}

.laps-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.laps-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  margin-bottom: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.lap-number {
  font-weight: 600;
  color: #667eea;
}

.lap-time {
  font-family: 'Courier New', monospace;
  color: #333;
  font-weight: 500;
}

.no-laps {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

@media (max-width: 480px) {
  .display {
    font-size: 3rem;
    padding: 20px;
  }
  
  .btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>