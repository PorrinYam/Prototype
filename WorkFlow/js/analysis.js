// 数据分析功能实现

// 移除自动初始化，改为只在对应模块被激活时初始化
// document.addEventListener('DOMContentLoaded', function() {
//     // 当DOM加载完成后初始化数据分析功能
//     if (document.getElementById('data-analysis')) {
//         initDataAnalysisInteractions();
//     }
// });

// 初始化数据分析交互功能
function initDataAnalysisInteractions() {
    // 初始化图表
    initCharts();
    
    // 添加筛选器事件监听
    const filterSelects = document.querySelectorAll('.analysis-filter select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateCharts();
        });
    });
    
    // 添加日期范围选择器事件监听
    const dateInputs = document.querySelectorAll('.analysis-filter input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateCharts();
        });
    });
    
    // 添加导出按钮事件监听
    const exportButtons = document.querySelectorAll('.btn-export');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            exportChart(chartType);
        });
    });
}

// 初始化图表
function initCharts() {
    // 模拟数据
    const processData = {
        labels: ['员工入职', '报销申请', '请假申请', '物资采购', '合同审批'],
        datasets: [15, 28, 22, 10, 7]
    };
    
    const statusData = {
        labels: ['待处理', '处理中', '已完成', '已拒绝'],
        datasets: [12, 19, 35, 8]
    };
    
    const timeData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [5, 8, 12, 15, 20, 25]
    };
    
    const departmentData = {
        labels: ['人事部', '财务部', '技术部', '市场部', '行政部'],
        datasets: [18, 22, 30, 15, 10]
    };
    
    // 渲染流程分布图表
    renderProcessChart(processData);
    
    // 渲染状态分布图表
    renderStatusChart(statusData);
    
    // 渲染时间趋势图表
    renderTimeChart(timeData);
    
    // 渲染部门分布图表
    renderDepartmentChart(departmentData);
}

// 渲染流程分布图表
function renderProcessChart(data) {
    const chartContainer = document.getElementById('process-chart');
    if (!chartContainer) return;
    
    // 清空容器
    chartContainer.innerHTML = '';
    
    // 创建图表
    const chart = document.createElement('div');
    chart.className = 'chart-content';
    
    // 计算最大值以确定比例
    const maxValue = Math.max(...data.datasets);
    
    // 创建柱状图
    let chartHTML = '<div class="chart-bars">';
    
    data.labels.forEach((label, index) => {
        const value = data.datasets[index];
        const percentage = (value / maxValue) * 100;
        
        chartHTML += `
            <div class="chart-bar">
                <div class="bar-label">${label}</div>
                <div class="bar-container">
                    <div class="bar" style="height: ${percentage}%">
                        <span class="bar-value">${value}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    chartHTML += '</div>';
    chart.innerHTML = chartHTML;
    
    chartContainer.appendChild(chart);
}

// 渲染状态分布图表
function renderStatusChart(data) {
    const chartContainer = document.getElementById('status-chart');
    if (!chartContainer) return;
    
    // 清空容器
    chartContainer.innerHTML = '';
    
    // 创建图表
    const chart = document.createElement('div');
    chart.className = 'chart-content pie-chart';
    
    // 计算总和
    const total = data.datasets.reduce((sum, value) => sum + value, 0);
    
    // 创建饼图
    let chartHTML = '<div class="pie-container">';
    let cumulativePercentage = 0;
    const colors = ['#4fc3f7', '#ff9800', '#4caf50', '#f44336'];
    
    // 创建饼图扇区
    chartHTML += '<div class="pie">';
    data.datasets.forEach((value, index) => {
        const percentage = (value / total) * 100;
        const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
        const endAngle = (cumulativePercentage + percentage) * 3.6;
        
        chartHTML += `
            <div class="pie-slice" style="
                background-color: ${colors[index]};
                transform: rotate(${startAngle}deg);
                clip-path: polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0);
                clip: rect(0, 100px, 100px, 50px);
                transform: rotate(${endAngle}deg);
            "></div>
        `;
        
        cumulativePercentage += percentage;
    });
    chartHTML += '</div>';
    
    // 创建图例
    chartHTML += '<div class="chart-legend">';
    data.labels.forEach((label, index) => {
        const value = data.datasets[index];
        const percentage = ((value / total) * 100).toFixed(1);
        
        chartHTML += `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${colors[index]}"></span>
                <span class="legend-label">${label}: ${percentage}% (${value})</span>
            </div>
        `;
    });
    chartHTML += '</div>';
    
    chartHTML += '</div>';
    chart.innerHTML = chartHTML;
    
    chartContainer.appendChild(chart);
}

// 渲染时间趋势图表
function renderTimeChart(data) {
    const chartContainer = document.getElementById('time-chart');
    if (!chartContainer) return;
    
    // 清空容器
    chartContainer.innerHTML = '';
    
    // 创建图表
    const chart = document.createElement('div');
    chart.className = 'chart-content';
    
    // 计算最大值以确定比例
    const maxValue = Math.max(...data.datasets);
    
    // 创建折线图
    let chartHTML = '<div class="line-chart">';
    
    // 创建Y轴
    chartHTML += '<div class="chart-y-axis">';
    for (let i = 5; i >= 0; i--) {
        const value = Math.round(maxValue * i / 5);
        chartHTML += `<div class="y-axis-label">${value}</div>`;
    }
    chartHTML += '</div>';
    
    // 创建图表内容
    chartHTML += '<div class="line-chart-content">';
    
    // 创建X轴
    chartHTML += '<div class="chart-x-axis">';
    data.labels.forEach(label => {
        chartHTML += `<div class="x-axis-label">${label}</div>`;
    });
    chartHTML += '</div>';
    
    // 创建折线和点
    chartHTML += '<div class="line-chart-lines">';
    
    // 创建点
    data.datasets.forEach((value, index) => {
        const percentage = (value / maxValue) * 100;
        const left = (index / (data.labels.length - 1)) * 100;
        
        chartHTML += `
            <div class="chart-point" style="bottom: ${percentage}%; left: ${left}%">
                <span class="point-value">${value}</span>
            </div>
        `;
    });
    
    // 创建线
    chartHTML += '<svg class="chart-lines" width="100%" height="100%">';
    let pathD = '';
    
    data.datasets.forEach((value, index) => {
        const percentage = (value / maxValue) * 100;
        const x = (index / (data.labels.length - 1)) * 100;
        
        if (index === 0) {
            pathD += `M ${x} ${100 - percentage}`;
        } else {
            pathD += ` L ${x} ${100 - percentage}`;
        }
    });
    
    chartHTML += `<path d="${pathD}" fill="none" stroke="#4fc3f7" stroke-width="2" />`;
    chartHTML += '</svg>';
    
    chartHTML += '</div>'; // 结束 line-chart-lines
    chartHTML += '</div>'; // 结束 line-chart-content
    chartHTML += '</div>'; // 结束 line-chart
    
    chart.innerHTML = chartHTML;
    chartContainer.appendChild(chart);
}

// 渲染部门分布图表
function renderDepartmentChart(data) {
    const chartContainer = document.getElementById('department-chart');
    if (!chartContainer) return;
    
    // 清空容器
    chartContainer.innerHTML = '';
    
    // 创建图表
    const chart = document.createElement('div');
    chart.className = 'chart-content';
    
    // 计算最大值以确定比例
    const maxValue = Math.max(...data.datasets);
    
    // 创建水平柱状图
    let chartHTML = '<div class="horizontal-bars">';
    
    data.labels.forEach((label, index) => {
        const value = data.datasets[index];
        const percentage = (value / maxValue) * 100;
        
        chartHTML += `
            <div class="horizontal-bar">
                <div class="bar-label">${label}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%">
                        <span class="bar-value">${value}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    chartHTML += '</div>';
    chart.innerHTML = chartHTML;
    
    chartContainer.appendChild(chart);
}

// 更新图表
function updateCharts() {
    // 在实际应用中，这里应该根据筛选条件获取新数据
    // 这里仅做模拟
    const processFilter = document.querySelector('.process-filter').value;
    const dateStart = document.querySelector('.date-start').value;
    const dateEnd = document.querySelector('.date-end').value;
    
    console.log(`更新图表：流程=${processFilter}, 日期范围=${dateStart}至${dateEnd}`);
    
    // 模拟新数据
    const newProcessData = {
        labels: ['员工入职', '报销申请', '请假申请', '物资采购', '合同审批'],
        datasets: [Math.floor(Math.random() * 20) + 5, 
                  Math.floor(Math.random() * 30) + 10, 
                  Math.floor(Math.random() * 25) + 5, 
                  Math.floor(Math.random() * 15) + 5, 
                  Math.floor(Math.random() * 10) + 5]
    };
    
    const newStatusData = {
        labels: ['待处理', '处理中', '已完成', '已拒绝'],
        datasets: [Math.floor(Math.random() * 15) + 5, 
                  Math.floor(Math.random() * 20) + 5, 
                  Math.floor(Math.random() * 40) + 10, 
                  Math.floor(Math.random() * 10) + 5]
    };
    
    const newTimeData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [Math.floor(Math.random() * 10) + 5, 
                  Math.floor(Math.random() * 15) + 5, 
                  Math.floor(Math.random() * 20) + 5, 
                  Math.floor(Math.random() * 25) + 5, 
                  Math.floor(Math.random() * 30) + 5, 
                  Math.floor(Math.random() * 35) + 5]
    };
    
    const newDepartmentData = {
        labels: ['人事部', '财务部', '技术部', '市场部', '行政部'],
        datasets: [Math.floor(Math.random() * 20) + 10, 
                  Math.floor(Math.random() * 25) + 10, 
                  Math.floor(Math.random() * 35) + 10, 
                  Math.floor(Math.random() * 20) + 5, 
                  Math.floor(Math.random() * 15) + 5]
    };
    
    // 更新图表
    renderProcessChart(newProcessData);
    renderStatusChart(newStatusData);
    renderTimeChart(newTimeData);
    renderDepartmentChart(newDepartmentData);
    
    // 显示更新提示
    showUpdateNotification();
}

// 导出图表
function exportChart(chartType) {
    // 在实际应用中，这里应该实现图表导出功能
    // 这里仅做模拟
    console.log(`导出图表：${chartType}`);
    alert(`${chartType}图表已导出`);
}

// 显示更新提示
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>数据已更新</span>
    `;
    
    document.body.appendChild(notification);
    
    // 2秒后自动消失
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}