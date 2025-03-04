// 页面导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户角色
    const userRole = localStorage.getItem('userRole') || 'user';
    const username = localStorage.getItem('username') || '用户';
    
    // 更新用户信息显示
    const userInfoSpan = document.querySelector('.user-info span');
    if (userInfoSpan) {
        userInfoSpan.textContent = username;
    }
    
    // 新建流程按钮点击事件
    const createWorkflowBtn = document.getElementById('create-workflow');
    if (createWorkflowBtn) {
        createWorkflowBtn.addEventListener('click', function() {
            window.location.href = 'workflow-wizard-new.html';
        });
    }
    
    // 根据用户角色设置导航菜单
    const navMenu = document.querySelector('.nav-menu');
    const designerItems = document.querySelectorAll('[data-target="form-designer"], [data-target="workflow-designer"]');
    
    if (userRole !== 'admin') {
        designerItems.forEach(item => item.style.display = 'none');
    }
    
    // 侧边栏导航切换
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.querySelector('.page-title h1');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 更新活动导航项
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应内容
            const target = this.getAttribute('data-target');
            pageContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 更新页面标题
                pageTitle.textContent = this.querySelector('span').textContent;
                
                // 初始化对应模块
                if (target === 'task-tracking') {
                    initTaskTracking();
                } else if (target === 'data-analysis') {
                    initDataAnalysis();
                } else if (target === 'publish-management') {
                    initPublishManagement();
                } else if (target === 'workflow-designer') {
                    // 先初始化流程设计器的HTML结构，再添加交互功能
                    initWorkflowDesigner();
                    initWorkflowDesignerInteractions();
                } else if (target === 'form-designer') {
                    initFormDesigner();
                }
            }
        });
    });
    
    // 移除自动初始化，改为只在对应模块被激活时初始化
    // initFormDesigner();
    // initWorkflowDesigner();
});

// 表单设计器初始化
function initFormDesigner() {
    const componentItems = document.querySelectorAll('.component-item');
    const canvasContent = document.querySelector('.canvas-content');
    
    // 拖拽功能
    componentItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.querySelector('span').textContent);
        });
    });
    
    // 放置功能
    if (canvasContent) {
        canvasContent.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        canvasContent.addEventListener('drop', function(e) {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('text/plain');
            addFormComponent(componentType, canvasContent);
        });
    }
    
    // 表单项操作
    document.addEventListener('click', function(e) {
        // 删除表单项
        if (e.target.classList.contains('fa-trash-alt')) {
            const formItem = e.target.closest('.form-item');
            if (formItem) {
                // 添加删除动画
                formItem.classList.add('item-removing');
                setTimeout(() => {
                    formItem.remove();
                }, 300);
            }
        }
        
        // 复制表单项
        if (e.target.classList.contains('fa-copy')) {
            const formItem = e.target.closest('.form-item');
            if (formItem && canvasContent) {
                const clone = formItem.cloneNode(true);
                // 添加新增动画
                clone.classList.add('item-adding');
                canvasContent.appendChild(clone);
                setTimeout(() => {
                    clone.classList.remove('item-adding');
                }, 300);
            }
        }
        
        // 编辑表单项标签
        if (e.target.closest('.form-item-label')) {
            const labelElement = e.target.closest('.form-item-label').querySelector('span:not(.required)');
            if (labelElement) {
                const currentText = labelElement.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.className = 'edit-label';
                
                // 替换标签为输入框
                labelElement.replaceWith(input);
                input.focus();
                
                // 失去焦点时保存
                input.addEventListener('blur', function() {
                    const newLabel = document.createElement('span');
                    newLabel.textContent = this.value || '新字段';
                    this.replaceWith(newLabel);
                });
                
                // 按回车保存
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        this.blur();
                    }
                });
            }
        }
    });
    
    // 实现表单项拖动排序
    if (canvasContent) {
        let draggedItem = null;
        
        document.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('fa-arrows-alt')) {
                draggedItem = e.target.closest('.form-item');
                draggedItem.classList.add('dragging');
                
                // 记录初始位置
                const rect = draggedItem.getBoundingClientRect();
                const offsetY = e.clientY - rect.top;
                
                // 鼠标移动事件
                function onMouseMove(e) {
                    if (!draggedItem) return;
                    
                    const canvasRect = canvasContent.getBoundingClientRect();
                    const y = e.clientY - canvasRect.top - offsetY;
                    
                    // 计算位置并移动
                    const formItems = Array.from(canvasContent.querySelectorAll('.form-item:not(.dragging)'));
                    
                    // 找到应该插入的位置
                    const nextItem = formItems.find(item => {
                        const box = item.getBoundingClientRect();
                        return e.clientY < box.top + box.height / 2;
                    });
                    
                    if (nextItem) {
                        canvasContent.insertBefore(draggedItem, nextItem);
                    } else if (formItems.length > 0) {
                        canvasContent.appendChild(draggedItem);
                    }
                }
                
                // 鼠标释放事件
                function onMouseUp() {
                    if (draggedItem) {
                        draggedItem.classList.remove('dragging');
                        draggedItem = null;
                    }
                    
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });
    }

}

// 添加表单组件
function addFormComponent(type, container) {
    const formItem = document.createElement('div');
    formItem.className = 'form-item';
    
    // 组件标题和操作
    const header = document.createElement('div');
    header.className = 'form-item-header';
    
    const label = document.createElement('div');
    label.className = 'form-item-label';
    
    const required = document.createElement('span');
    required.className = 'required';
    required.textContent = '*';
    
    const labelText = document.createElement('span');
    labelText.textContent = getComponentLabel(type);
    
    label.appendChild(required);
    label.appendChild(labelText);
    
    const actions = document.createElement('div');
    actions.className = 'form-item-actions';
    actions.innerHTML = `
        <i class="fas fa-arrows-alt"></i>
        <i class="fas fa-copy"></i>
        <i class="fas fa-trash-alt"></i>
    `;
    
    header.appendChild(label);
    header.appendChild(actions);
    
    // 组件内容
    const content = document.createElement('div');
    content.className = 'form-item-content';
    content.innerHTML = getComponentContent(type);
    
    formItem.appendChild(header);
    formItem.appendChild(content);
    
    container.appendChild(formItem);
}

// 获取组件标签
function getComponentLabel(type) {
    const labels = {
        '单行文本': '文本字段',
        '多行文本': '描述',
        '复选框': '选项',
        '单选框': '选择',
        '下拉选择': '下拉菜单',
        '日期选择': '日期',
        '文件上传': '附件',
        '表格': '数据表格',
        '计算公式': '计算结果',
        '签名': '签名',
        '地址': '地址'
    };
    
    return labels[type] || '新字段';
}

// 获取组件内容HTML
function getComponentContent(type) {
    switch(type) {
        case '单行文本':
            return '<input type="text" placeholder="请输入">';
        case '多行文本':
            return '<textarea placeholder="请输入"></textarea>';
        case '复选框':
            return `
                <div class="checkbox-group">
                    <label><input type="checkbox"> 选项1</label>
                    <label><input type="checkbox"> 选项2</label>
                    <label><input type="checkbox"> 选项3</label>
                </div>
            `;
        case '单选框':
            return `
                <div class="radio-group">
                    <label><input type="radio" name="radio-group"> 选项1</label>
                    <label><input type="radio" name="radio-group"> 选项2</label>
                    <label><input type="radio" name="radio-group"> 选项3</label>
                </div>
            `;
        case '下拉选择':
            return `
                <select>
                    <option value="">请选择</option>
                    <option value="1">选项1</option>
                    <option value="2">选项2</option>
                    <option value="3">选项3</option>
                </select>
            `;
        case '日期选择':
            return '<input type="date">';
        case '文件上传':
            return `
                <div class="file-upload">
                    <input type="file" id="file-upload" hidden>
                    <label for="file-upload" class="btn-secondary">
                        <i class="fas fa-cloud-upload-alt"></i> 上传文件
                    </label>
                    <span class="file-name">未选择文件</span>
                </div>
            `;
        case '表格':
            return `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>列1</th>
                            <th>列2</th>
                            <th>列3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>数据1</td>
                            <td>数据2</td>
                            <td>数据3</td>
                        </tr>
                        <tr>
                            <td>数据4</td>
                            <td>数据5</td>
                            <td>数据6</td>
                        </tr>
                    </tbody>
                </table>
            `;
        case '计算公式':
            return `
                <div class="formula-field">
                    <input type="text" value="0" readonly>
                    <div class="formula-info">公式: {字段1} + {字段2}</div>
                </div>
            `;
        case '签名':
            return `
                <div class="signature-area">
                    <div class="signature-pad">点击此处签名</div>
                    <button class="btn-secondary">清除</button>
                </div>
            `;
        case '地址':
            return `
                <div class="address-fields">
                    <select class="province">
                        <option value="">省份</option>
                    </select>
                    <select class="city">
                        <option value="">城市</option>
                    </select>
                    <select class="district">
                        <option value="">区县</option>
                    </select>
                    <input type="text" placeholder="详细地址">
                </div>
            `;
        default:
            return '<input type="text" placeholder="请输入">';
    }
}

// 流程设计器初始化
function initWorkflowDesigner() {
    // 这里将在后续实现流程设计器的功能
    const workflowDesigner = document.getElementById('workflow-designer');
    
    if (workflowDesigner) {
        // 创建流程设计器的基本结构
        workflowDesigner.innerHTML = `
            <div class="designer-container">
                <div class="designer-sidebar">
                    <div class="sidebar-section">
                        <h3>流程节点</h3>
                        <div class="component-list">
                            <div class="component-item" draggable="true">
                                <i class="fas fa-play-circle"></i>
                                <span>开始节点</span>
                            </div>
                            <div class="component-item" draggable="true">
                                <i class="fas fa-user-check"></i>
                                <span>审批节点</span>
                            </div>
                            <div class="component-item" draggable="true">
                                <i class="fas fa-code-branch"></i>
                                <span>条件分支</span>
                            </div>
                            <div class="component-item" draggable="true">
                                <i class="fas fa-random"></i>
                                <span>并行节点</span>
                            </div>
                            <div class="component-item" draggable="true">
                                <i class="fas fa-envelope"></i>
                                <span>通知节点</span>
                            </div>
                            <div class="component-item" draggable="true">
                                <i class="fas fa-stop-circle"></i>
                                <span>结束节点</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="designer-canvas">
                    <div class="canvas-header">
                        <input type="text" class="form-title" value="新建流程">
                        <div class="canvas-actions">
                            <button class="btn-secondary"><i class="fas fa-eye"></i> 预览</button>
                            <button class="btn-primary"><i class="fas fa-save"></i> 保存</button>
                        </div>
                    </div>
                    <div class="canvas-content workflow-canvas">
                        <div class="workflow-start-node">
                            <div class="node-icon"><i class="fas fa-play-circle"></i></div>
                            <div class="node-title">开始</div>
                            <div class="node-connector"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// 发布管理功能
function initPublishManagement() {
    const publishManagement = document.getElementById('publish-management');
    
    if (publishManagement) {
        // Clear any existing padding
        publishManagement.style.padding = '20px';
        
        publishManagement.innerHTML = `
            <div style="position: relative; width: 100%; margin-bottom: 20px;">
                <h2 style="display: inline-block; margin: 0;">发布管理</h2>
                <button class="btn-primary" id="create-workflow" style="position: absolute; right: 0; top: 0;"><i class="fas fa-plus"></i> 新建流程</button>
            </div>
            <div style="width: 100%;">
                <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>类型</th>
                                <th>状态</th>
                                <th>发布时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>员工入职流程</td>
                                <td>流程</td>
                                <td><span class="status-active">已发布</span></td>
                                <td>2023-06-15</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>报销申请表</td>
                                <td>表单</td>
                                <td><span class="status-active">已发布</span></td>
                                <td>2023-06-10</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>请假审批流程</td>
                                <td>流程</td>
                                <td><span class="status-draft">草稿</span></td>
                                <td>-</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 添加新建流程按钮点击事件
        const createWorkflowBtn = publishManagement.querySelector('#create-workflow');
        if (createWorkflowBtn) {
            createWorkflowBtn.addEventListener('click', function() {
                // 切换到工作流向导页面
                window.location.href = 'workflow-wizard-new.html';
            });
        }
    }
}

// 数据分析功能
function initDataAnalysis() {
    // 这个函数在analysis.js中已经实现为initDataAnalysisInteractions
    // 这里只需要调用该函数即可
    if (typeof initDataAnalysisInteractions === 'function') {
        initDataAnalysisInteractions();
    }
}

// 任务跟踪功能
function initTaskTracking() {
    const taskTracking = document.getElementById('task-tracking');
    
    if (taskTracking) {
        taskTracking.innerHTML = `
            <div class="task-container">
                <div class="task-header">
                    <h2>任务跟踪</h2>
                    <div class="task-filters">
                        <select class="task-process-filter">
                            <option value="all">全部流程</option>
                            <option value="employee">员工入职</option>
                            <option value="expense">报销申请</option>
                            <option value="leave">请假申请</option>
                        </select>
                        <select class="task-status-filter">
                            <option value="all">全部状态</option>
                            <option value="pending">待处理</option>
                            <option value="processing">处理中</option>
                            <option value="completed">已完成</option>
                            <option value="rejected">已拒绝</option>
                        </select>
                        <div class="date-range">
                            <input type="date" class="date-start" placeholder="开始日期">
                            <span>至</span>
                            <input type="date" class="date-end" placeholder="结束日期">
                        </div>
                        <button class="btn-secondary"><i class="fas fa-search"></i> 搜索</button>
                    </div>
                </div>
                
                <div class="task-list">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>任务名称</th>
                                <th>流程类型</th>
                                <th>发起人</th>
                                <th>当前节点</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>张三入职申请</td>
                                <td>员工入职</td>
                                <td>李四</td>
                                <td>人事审批</td>
                                <td><span class="status-pending">待处理</span></td>
                                <td>2023-06-18</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                    <button class="btn-icon"><i class="fas fa-check-circle"></i></button>
                                    <button class="btn-icon"><i class="fas fa-times-circle"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>王五报销申请</td>
                                <td>报销申请</td>
                                <td>王五</td>
                                <td>财务审批</td>
                                <td><span class="status-processing">处理中</span></td>
                                <td>2023-06-17</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                    <button class="btn-icon"><i class="fas fa-check-circle"></i></button>
                                    <button class="btn-icon"><i class="fas fa-times-circle"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>赵六请假申请</td>
                                <td>请假申请</td>
                                <td>赵六</td>
                                <td>部门经理审批</td>
                                <td><span class="status-completed">已完成</span></td>
                                <td>2023-06-15</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>钱七报销申请</td>
                                <td>报销申请</td>
                                <td>钱七</td>
                                <td>财务审批</td>
                                <td><span class="status-rejected">已拒绝</span></td>
                                <td>2023-06-14</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="pagination">
                    <button class="btn-page"><i class="fas fa-angle-double-left"></i></button>
                    <button class="btn-page"><i class="fas fa-angle-left"></i></button>
                    <button class="btn-page active">1</button>
                    <button class="btn-page">2</button>
                    <button class="btn-page">3</button>
                    <button class="btn-page"><i class="fas fa-angle-right"></i></button>
                    <button class="btn-page"><i class="fas fa-angle-double-right"></i></button>
                    <span class="page-info">第1页/共3页</span>
                </div>
            </div>
        `;
        
        // 添加任务操作事件监听
        const taskButtons = taskTracking.querySelectorAll('.btn-icon');
        taskButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.querySelector('.fa-eye')) {
                    // 查看任务详情
                    alert('查看任务详情');
                } else if (this.querySelector('.fa-check-circle')) {
                    // 批准任务
                    alert('批准任务');
                } else if (this.querySelector('.fa-times-circle')) {
                    // 拒绝任务
                    alert('拒绝任务');
                }
            });
        });
        
        // 添加筛选功能
        const processFilter = taskTracking.querySelector('.task-process-filter');
        const statusFilter = taskTracking.querySelector('.task-status-filter');
        const searchButton = taskTracking.querySelector('.btn-secondary');
        
        searchButton.addEventListener('click', function() {
            const processValue = processFilter.value;
            const statusValue = statusFilter.value;
            const dateStart = taskTracking.querySelector('.date-start').value;
            const dateEnd = taskTracking.querySelector('.date-end').value;
            
            // 这里可以添加实际的筛选逻辑
            console.log('筛选条件:', { processValue, statusValue, dateStart, dateEnd });
            alert('应用筛选条件');
        });
    }
}

// 数据分析功能
function initDataAnalysis() {
    const dataAnalysis = document.getElementById('data-analysis');
    
    if (dataAnalysis) {
        dataAnalysis.innerHTML = `
            <div class="analysis-container">
                <div class="analysis-header">
                    <h2>数据分析</h2>
                    <div class="analysis-filters">
                        <select class="time-range">
                            <option value="week">本周</option>
                            <option value="month" selected>本月</option>
                            <option value="quarter">本季度</option>
                            <option value="year">本年度</option>
                        </select>
                        <button class="btn-secondary"><i class="fas fa-sync-alt"></i> 刷新数据</button>
                        <button class="btn-primary"><i class="fas fa-download"></i> 导出报表</button>
                    </div>
                </div>
                
                <div class="analysis-overview">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="stat-info">
                            <h3>表单提交量</h3>
                            <p>128</p>
                            <span class="trend up"><i class="fas fa-arrow-up"></i> 12%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-tasks"></i></div>
                        <div class="stat-info">
                            <h3>流程完成量</h3>
                            <p>85</p>
                            <span class="trend up"><i class="fas fa-arrow-up"></i> 8%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-info">
                            <h3>平均处理时间</h3>
                            <p>2.5天</p>
                            <span class="trend down"><i class="fas fa-arrow-down"></i> 15%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info">
                            <h3>审批通过率</h3>
                            <p>92%</p>
                            <span class="trend up"><i class="fas fa-arrow-up"></i> 3%</span>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-charts">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>流程类型分布</h3>
                        </div>
                        <div class="chart-content" id="process-type-chart">
                            <!-- 这里将通过JavaScript插入图表 -->
                            <div class="placeholder-chart">
                                <div class="pie-chart">
                                    <div class="pie-slice" style="transform: rotate(0deg); background-color: #4fc3f7; clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)"></div>
                                    <div class="pie-slice" style="transform: rotate(180deg); background-color: #ff9800; clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)"></div>
                                    <div class="pie-slice" style="transform: rotate(270deg); background-color: #4caf50; clip-path: polygon(50% 50%, 50% 0%, 75% 0%, 75% 50%, 50% 50%)"></div>
                                </div>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #4fc3f7"></span>
                                        <span>员工入职 (45%)</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #ff9800"></span>
                                        <span>报销申请 (35%)</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #4caf50"></span>
                                        <span>请假申请 (20%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>流程处理时间趋势</h3>
                        </div>
                        <div class="chart-content" id="process-time-chart">
                            <!-- 这里将通过JavaScript插入图表 -->
                            <div class="placeholder-chart">
                                <div class="line-chart">
                                    <div class="chart-grid">
                                        <div class="grid-line"></div>
                                        <div class="grid-line"></div>
                                        <div class="grid-line"></div>
                                        <div class="grid-line"></div>
                                    </div>
                                    <div class="chart-line" style="background: linear-gradient(to right, transparent, #4fc3f7, #4fc3f7, #4fc3f7, #4fc3f7, #4fc3f7, transparent); height: 2px; position: absolute; top: 70%; width: 100%;"></div>
                                    <div class="chart-line" style="background: linear-gradient(to right, transparent, #ff9800, #ff9800, #ff9800, transparent); height: 2px; position: absolute; top: 40%; width: 100%;"></div>
                                    <div class="chart-line" style="background: linear-gradient(to right, transparent, #4caf50, #4caf50, #4caf50, #4caf50, transparent); height: 2px; position: absolute; top: 55%; width: 100%;"></div>
                                    <div class="chart-points">
                                        <div class="point" style="left: 10%; bottom: 30%;"></div>
                                        <div class="point" style="left: 25%; bottom: 60%;"></div>
                                        <div class="point" style="left: 40%; bottom: 45%;"></div>
                                        <div class="point" style="left: 55%; bottom: 55%;"></div>
                                        <div class="point" style="left: 70%; bottom: 65%;"></div>
                                        <div class="point" style="left: 85%; bottom: 50%;"></div>
                                    </div>
                                </div>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #4fc3f7"></span>
                                        <span>员工入职</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #ff9800"></span>
                                        <span>报销申请</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="color-dot" style="background-color: #4caf50"></span>
                                        <span>请假申请</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-tables">
                    <div class="table-container">
                        <div class="table-header">
                            <h3>流程效率排名</h3>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>流程名称</th>
                                    <th>平均完成时间</th>
                                    <th>完成率</th>
                                    <th>处理人数</th>
                                    <th>趋势</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>请假审批</td>
                                    <td>1.2天</td>
                                    <td>98%</td>
                                    <td>2人</td>
                                    <td><span class="trend up"><i class="fas fa-arrow-up"></i></span></td>
                                </tr>
                                <tr>
                                    <td>报销审批</td>
                                    <td>2.5天</td>
                                    <td>92%</td>
                                    <td>3人</td>
                                    <td><span class="trend down"><i class="fas fa-arrow-down"></i></span></td>
                                </tr>
                                <tr>
                                    <td>员工入职</td>
                                    <td>3.8天</td>
                                    <td>85%</td>
                                    <td>5人</td>
                                    <td><span class="trend up"><i class="fas fa-arrow-up"></i></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        
        // 添加数据分析交互功能
        const timeRangeSelect = dataAnalysis.querySelector('.time-range');
        const refreshButton = dataAnalysis.querySelector('.btn-secondary');
        const exportButton = dataAnalysis.querySelector('.btn-primary');
        
        timeRangeSelect.addEventListener('change', function() {
            // 这里可以添加切换时间范围的逻辑
            console.log('时间范围切换为:', this.value);
            alert('切换时间范围为: ' + this.options[this.selectedIndex].text);
        });
        
        refreshButton.addEventListener('click', function() {
            // 刷新数据逻辑
            console.log('刷新数据');
            alert('数据已刷新');
        });
        
        exportButton.addEventListener('click', function() {
            // 导出报表逻辑
            console.log('导出报表');
            alert('报表已导出');
        });
    }
}