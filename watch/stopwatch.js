'use strict';

// --- 1. DOM 元素选择 ---
const display = document.getElementById('display');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const millisecondsEl = document.getElementById('milliseconds');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const lapsList = document.getElementById('lapsList');

// --- 2. 状态变量 ---
let startTime = 0;            // 开始计时的时间戳
let elapsedTime = 0;          // 已经过去的时间 (毫秒)
let animationFrameId = null;  // requestAnimationFrame 的 ID
let isRunning = false;        // 秒表是否正在运行
let lapCounter = 1;           // 计次计数器

// --- 3. 核心功能函数 ---

/**
 * 更新显示的时间
 * @param {number} totalMilliseconds - 总毫秒数
 */
function updateDisplay(totalMilliseconds) {
    const minutes = Math.floor(totalMilliseconds / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // 显示两位数毫秒

    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    millisecondsEl.textContent = String(milliseconds).padStart(2, '0');
}

/**
 * 动画循环函数，由 requestAnimationFrame 调用
 */
function tick() {
    // 如果秒表已经停止，则不再继续循环
    if (!isRunning) {
        return;
    }

    // 计算已经过的时间
    elapsedTime = Date.now() - startTime;
    updateDisplay(elapsedTime);

    // 请求下一帧动画，从而创建一个循环
    animationFrameId = requestAnimationFrame(tick);
}

/**
 * 开始或继续计时
 */
function start() {
    if (!isRunning) {
        // 记录开始时间，减去已经过去的时间，以支持“继续”功能
        startTime = Date.now() - elapsedTime;
        
        // 启动动画循环
        animationFrameId = requestAnimationFrame(tick);
        
        isRunning = true;
        
        // 更新按钮状态
        startBtn.textContent = '继续';
        resetBtn.textContent = '计次';
    }
}

/**
 * 停止计时
 */
function stop() {
    if (isRunning) {
        // 取消下一帧的动画请求，停止循环
        cancelAnimationFrame(animationFrameId);
        isRunning = false;
        
        // 更新按钮状态
        startBtn.textContent = '继续';
        resetBtn.textContent = '重置';
    }
}

/**
 * 处理计次或重置
 */
function lapOrReset() {
    if (isRunning) {
        // 如果正在运行，则执行“计次”
        const lapTime = `${minutesEl.textContent}:${secondsEl.textContent}:${millisecondsEl.textContent}`;
        const lapItem = document.createElement('li');
        lapItem.textContent = `计次 ${lapCounter}: ${lapTime}`;
        // 将新的计次记录插入到列表顶部
        lapsList.prepend(lapItem);
        lapCounter++;
    } else {
        // 如果已停止，则执行“重置”
        // 确保动画帧被取消
        cancelAnimationFrame(animationFrameId); 
        
        elapsedTime = 0;
        isRunning = false;
        lapCounter = 1;
        
        updateDisplay(0); // 清空显示
        lapsList.innerHTML = ''; // 清空计次列表
        
        // 恢复按钮初始状态
        startBtn.textContent = '开始';
        resetBtn.textContent = '重置';
    }
}

// --- 4. 事件监听器 ---
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', lapOrReset);

// --- 5. 初始化 ---
// 页面加载时，确保显示是 00:00:00
updateDisplay(0);
