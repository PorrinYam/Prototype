// 流程设计器功能实现

// 移除自动初始化，改为只在对应模块被激活时初始化
// document.addEventListener('DOMContentLoaded', function() {
//     // 当DOM加载完成后初始化流程设计器
//     initWorkflowDesignerInteractions();
// });

// 初始化流程设计器交互功能
function initWorkflowDesignerInteractions() {
    const workflowDesigner = document.getElementById('workflow-designer');
    if (!workflowDesigner) return;
    
    const canvas = workflowDesigner.querySelector('.workflow-canvas');
    if (!canvas) {
        // 如果没有找到画布，创建一个
        const canvasContent = workflowDesigner.querySelector('.canvas-content');
        if (canvasContent) {
            canvasContent.innerHTML = '';
            canvasContent.classList.add('workflow-canvas');
            canvas = canvasContent;
        } else {
            return;
        }
    }
    
    // 添加画布引导提示
    if (canvas.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'canvas-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-project-diagram"></i>
                <p>拖拽左侧节点到此处开始设计流程</p>
            </div>
        `;
        canvas.appendChild(placeholder);
    }
    
    // 获取所有可拖拽的流程节点组件
    const componentItems = workflowDesigner.querySelectorAll('.component-item');
    
    // 节点计数器，用于生成唯一ID
    let nodeCounter = 1;
    
    // 设置拖拽功能
    componentItems.forEach(item => {
        // 添加拖拽开始时的视觉反馈
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.querySelector('span').textContent);
            this.classList.add('dragging');
            
            // 创建拖拽预览图像
            const dragIcon = document.createElement('div');
            dragIcon.className = 'drag-preview';
            dragIcon.innerHTML = `<i class="${this.querySelector('i').className}"></i><span>${this.querySelector('span').textContent}</span>`;
            document.body.appendChild(dragIcon);
            dragIcon.style.display = 'none'; // 隐藏，但保留在DOM中以便设置拖拽图像
            e.dataTransfer.setDragImage(dragIcon, 20, 20);
            
            // 设置拖拽效果
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // 拖拽结束时移除视觉效果
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            // 移除预览元素
            const dragPreview = document.querySelector('.drag-preview');
            if (dragPreview) dragPreview.remove();
        });
    });
    
    // 设置画布的拖放功能
    canvas.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        // 添加拖拽悬停效果
        this.classList.add('dragover');
        
        // 移除画布占位符
        const placeholder = this.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0.3';
        }
    });
    
    canvas.addEventListener('dragleave', function() {
        // 移除拖拽悬停效果
        this.classList.remove('dragover');
        
        // 恢复画布占位符
        const placeholder = this.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '1';
        }
    });
    
    canvas.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        // 移除画布占位符
        const placeholder = this.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        const nodeType = e.dataTransfer.getData('text/plain');
        
        // 计算放置位置，相对于画布
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 创建新节点并添加动画效果
        const newNode = createWorkflowNode(nodeType, x, y, canvas);
        newNode.classList.add('node-appear');
        setTimeout(() => {
            newNode.classList.remove('node-appear');
        }, 500);
    });
    
    // 初始化已有节点的拖动功能
    initExistingNodes(canvas);
    
    // 添加连接线功能
    initConnectionLines(canvas);
    
    // 添加保存按钮功能
    const saveButton = workflowDesigner.querySelector('.btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveWorkflow();
        });
    }
    
    // 添加预览按钮功能
    const previewButton = workflowDesigner.querySelector('.btn-secondary');
    if (previewButton) {
        previewButton.addEventListener('click', function() {
            previewWorkflow();
        });
    }
    
    // 添加画布缩放功能
    initCanvasZoom(canvas);
}

// 创建工作流节点
function createWorkflowNode(type, x, y, container) {
    const nodeId = 'node-' + Date.now();
    const node = document.createElement('div');
    node.className = 'workflow-node';
    node.id = nodeId;
    node.setAttribute('data-type', type);
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    
    // 设置节点图标和样式
    let iconClass = '';
    let nodeClass = '';
    
    switch(type) {
        case '开始节点':
            iconClass = 'fas fa-play-circle';
            nodeClass = 'node-start';
            break;
        case '审批节点':
            iconClass = 'fas fa-user-check';
            nodeClass = 'node-approval';
            break;
        case '条件分支':
            iconClass = 'fas fa-code-branch';
            nodeClass = 'node-condition';
            break;
        case '并行节点':
            iconClass = 'fas fa-random';
            nodeClass = 'node-parallel';
            break;
        case '通知节点':
            iconClass = 'fas fa-envelope';
            nodeClass = 'node-notification';
            break;
        case '结束节点':
            iconClass = 'fas fa-stop-circle';
            nodeClass = 'node-end';
            break;
        default:
            iconClass = 'fas fa-circle';
            nodeClass = 'node-default';
    }
    
    node.classList.add(nodeClass);
    
    // 创建节点内容
    node.innerHTML = `
        <div class="node-header">
            <div class="node-icon"><i class="${iconClass}"></i></div>
            <div class="node-title">${type}</div>
            <div class="node-actions">
                <i class="fas fa-cog node-settings" title="节点设置"></i>
                <i class="fas fa-times node-delete" title="删除节点"></i>
            </div>
        </div>
        <div class="node-connectors">
            <div class="connector connector-top" data-position="top" title="从上方连接"></div>
            <div class="connector connector-right" data-position="right" title="从右侧连接"></div>
            <div class="connector connector-bottom" data-position="bottom" title="从下方连接"></div>
            <div class="connector connector-left" data-position="left" title="从左侧连接"></div>
        </div>
    `;
    
    container.appendChild(node);
    
    // 使节点可拖动
    makeNodeDraggable(node);
    
    // 添加节点事件监听
    addNodeEventListeners(node);
    
    return node;
}

// 使节点可拖动
function makeNodeDraggable(node) {
    let offsetX, offsetY, isDragging = false;
    
    // 鼠标按下时记录偏移量
    node.addEventListener('mousedown', function(e) {
        // 如果点击的是连接点或设置按钮，不启动拖动
        if (e.target.classList.contains('connector') || 
            e.target.classList.contains('node-settings') ||
            e.target.classList.contains('node-delete')) {
            return;
        }
        
        isDragging = true;
        offsetX = e.clientX - node.getBoundingClientRect().left;
        offsetY = e.clientY - node.getBoundingClientRect().top;
        
        // 添加活动状态样式
        node.classList.add('dragging');
        
        // 将当前节点置于顶层
        node.style.zIndex = '100';
        
        // 阻止默认行为和冒泡
        e.preventDefault();
        e.stopPropagation();
    });
    
    // 鼠标移动时更新位置
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const canvas = node.parentElement;
        const canvasRect = canvas.getBoundingClientRect();
        
        // 计算新位置，确保节点不超出画布边界
        let newX = e.clientX - canvasRect.left - offsetX;
        let newY = e.clientY - canvasRect.top - offsetY;
        
        // 边界检查
        newX = Math.max(0, Math.min(newX, canvasRect.width - node.offsetWidth));
        newY = Math.max(0, Math.min(newY, canvasRect.height - node.offsetHeight));
        
        // 添加平滑过渡
        node.style.transition = 'none';
        node.style.left = newX + 'px';
        node.style.top = newY + 'px';
        
        // 更新连接线
        updateConnections(node);
    });
    
    // 鼠标释放时结束拖动
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        node.classList.remove('dragging');
        
        // 恢复正常层级
        setTimeout(() => {
            node.style.zIndex = '';
            node.style.transition = '';
        }, 200);
    });
}

// 添加节点事件监听
function addNodeEventListeners(node) {
    // 删除节点
    const deleteBtn = node.querySelector('.node-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // 删除与该节点相关的所有连接线
            const connections = document.querySelectorAll(`.connection[data-source="${node.id}"], .connection[data-target="${node.id}"]`);
            connections.forEach(conn => conn.remove());
            
            // 删除节点
            node.remove();
        });
    }
    
    // 节点设置
    const settingsBtn = node.querySelector('.node-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openNodeSettings(node);
        });
    }
    
    // 连接点事件
    const connectors = node.querySelectorAll('.connector');
    connectors.forEach(connector => {
        connector.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            startConnection(node, connector);
        });
    });
}

// 初始化已有节点的拖动功能
function initExistingNodes(canvas) {
    const nodes = canvas.querySelectorAll('.workflow-node');
    nodes.forEach(node => {
        makeNodeDraggable(node);
        addNodeEventListeners(node);
    });
}

// 初始化连接线功能
function initConnectionLines(canvas) {
    // 创建一个SVG元素用于绘制连接线
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connections-container');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    canvas.appendChild(svg);
    
    // 存储当前正在创建的连接线
    let currentConnection = null;
    let sourceNode = null;
    let sourceConnector = null;
    
    // 开始创建连接线
    window.startConnection = function(node, connector) {
        sourceNode = node;
        sourceConnector = connector;
        
        // 创建临时连接线
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', '#4fc3f7');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        
        // 添加箭头标记
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#4fc3f7');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
        
        svg.appendChild(path);
        currentConnection = path;
        
        // 添加鼠标移动事件
        canvas.addEventListener('mousemove', moveConnection);
        canvas.addEventListener('mouseup', endConnection);
    };
    
    // 移动连接线
    function moveConnection(e) {
        if (!currentConnection || !sourceNode || !sourceConnector) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const sourceRect = sourceConnector.getBoundingClientRect();
        
        // 计算源点和目标点的坐标
        const sourceX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
        const sourceY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        const targetX = e.clientX - canvasRect.left;
        const targetY = e.clientY - canvasRect.top;
        
        // 绘制贝塞尔曲线
        const path = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`;
        currentConnection.setAttribute('d', path);
    }
    
    // 结束连接线创建
    function endConnection(e) {
        canvas.removeEventListener('mousemove', moveConnection);
        canvas.removeEventListener('mouseup', endConnection);
        
        if (!currentConnection || !sourceNode || !sourceConnector) return;
        
        // 检查是否连接到了另一个节点的连接点
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        
        if (targetElement && targetElement.classList.contains('connector')) {
            const targetNode = targetElement.closest('.workflow-node');
            
            // 不允许连接到自己
            if (targetNode && targetNode.id !== sourceNode.id) {
                // 创建永久连接
                const connection = currentConnection.cloneNode(true);
                connection.classList.add('connection');
                connection.setAttribute('data-source', sourceNode.id);
                connection.setAttribute('data-source-position', sourceConnector.getAttribute('data-position'));
                connection.setAttribute('data-target', targetNode.id);
                connection.setAttribute('data-target-position', targetElement.getAttribute('data-position'));
                
                // 添加连接线点击事件
                connection.style.pointerEvents = 'auto';
                connection.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm('是否删除此连接线？')) {
                        connection.remove();
                    }
                });
                
                svg.appendChild(connection);
            }
        }
        
        // 移除临时连接线
        currentConnection.remove();
        currentConnection = null;
        sourceNode = null;
        sourceConnector = null;
    }
}

// 更新节点的所有连接线
function updateConnections(node) {
    const svg = node.closest('.workflow-canvas').querySelector('.connections-container');
    if (!svg) return;
    
    // 更新以该节点为源或目标的所有连接线
    const connections = svg.querySelectorAll(`.connection[data-source="${node.id}"], .connection[data-target="${node.id}"]`);
    
    connections.forEach(connection => {
        const sourceId = connection.getAttribute('data-source');
        const targetId = connection.getAttribute('data-target');
        const sourcePosition = connection.getAttribute('data-source-position');
        const targetPosition = connection.getAttribute('data-target-position');
        
        const sourceNode = document.getElementById(sourceId);
        const targetNode = document.getElementById(targetId);
        
        if (!sourceNode || !targetNode) return;
        
        const sourceConnector = sourceNode.querySelector(`.connector-${sourcePosition}`);
        const targetConnector = targetNode.querySelector(`.connector-${targetPosition}`);
        
        if (!sourceConnector || !targetConnector) return;
        
        const canvasRect = svg.getBoundingClientRect();
        const sourceRect = sourceConnector.getBoundingClientRect();
        const targetRect = targetConnector.getBoundingClientRect();
        
        // 计算连接点的坐标
        const sourceX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
        const sourceY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        const targetX = targetRect.left + targetRect.width / 2 - canvasRect.left;
        const targetY = targetRect.top + targetRect.height / 2 - canvasRect.top;
        
        // 更新连接线路径
        const path = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`;
        connection.setAttribute('d', path);
    });
}

// 保存工作流
function saveWorkflow() {
    // 获取流程设计器画布
    const canvas = document.querySelector('.workflow-canvas');
    if (!canvas) return;
    
    // 获取流程名称
    const flowName = document.querySelector('.form-title').value || '新建流程';
    
    // 获取所有节点
    const nodes = canvas.querySelectorAll('.workflow-node');
    
    // 获取所有连接线
    const connections = canvas.querySelectorAll('.connection');
    
    // 构建流程数据
    const workflowData = {
        name: flowName,
        nodes: [],
        connections: []
    };
    
    // 收集节点数据
    nodes.forEach(node => {
        workflowData.nodes.push({
            id: node.id,
            type: node.getAttribute('data-type'),
            position: {
                x: parseInt(node.style.left),
                y: parseInt(node.style.top)
            }
        });
    });
    
    // 收集连接线数据
    connections.forEach(connection => {
        workflowData.connections.push({
            source: connection.getAttribute('data-source'),
            sourcePosition: connection.getAttribute('data-source-position'),
            target: connection.getAttribute('data-target'),
            targetPosition: connection.getAttribute('data-target-position')
        });
    });
    
    // 在实际应用中，这里应该将数据发送到服务器保存
    // 这里仅做模拟
    console.log('保存流程数据:', workflowData);
    
    // 显示保存成功提示
    showSaveNotification();
}

// 预览工作流 - 已移除重复实现，使用下方的previewWorkflow函数
// 这部分代码已被移除，完整实现请参考下方的previewWorkflow函数

// 显示保存成功提示
function showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>流程已保存</span>
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

// 打开节点设置面板
function openNodeSettings(node) {
    const nodeType = node.getAttribute('data-type');
    const nodeTitle = node.querySelector('.node-title').textContent;
    
    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'node-settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-header">
            <h3>${nodeTitle}设置</h3>
            <i class="fas fa-times close-settings"></i>
        </div>
        <div class="settings-content">
            ${getNodeSettingsContent(nodeType)}
        </div>
        <div class="settings-footer">
            <button class="btn-secondary cancel-settings">取消</button>
            <button class="btn-primary save-settings">保存</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(settingsPanel);
    
    // 定位设置面板
    const nodeRect = node.getBoundingClientRect();
    settingsPanel.style.top = `${nodeRect.top}px`;
    settingsPanel.style.left = `${nodeRect.right + 10}px`;
    
    // 添加事件监听
    const closeBtn = settingsPanel.querySelector('.close-settings');
    const cancelBtn = settingsPanel.querySelector('.cancel-settings');
    const saveBtn = settingsPanel.querySelector('.save-settings');
    
    closeBtn.addEventListener('click', () => settingsPanel.remove());
    cancelBtn.addEventListener('click', () => settingsPanel.remove());
    
    saveBtn.addEventListener('click', () => {
        // 保存设置逻辑
        saveNodeSettings(node, settingsPanel);
        settingsPanel.remove();
    });
}

// 获取节点设置内容
function getNodeSettingsContent(nodeType) {
    switch(nodeType) {
        case '审批节点':
            return `
                <div class="settings-field">
                    <label>审批人</label>
                    <select>
                        <option value="manager">直接主管</option>
                        <option value="department">部门经理</option>
                        <option value="hr">人力资源</option>
                        <option value="finance">财务</option>
                        <option value="custom">自定义</option>
                    </select>
                </div>
                <div class="settings-field">
                    <label>审批类型</label>
                    <div class="radio-group">
                        <label><input type="radio" name="approval-type" value="or" checked> 或签（一人通过即可）</label>
                        <label><input type="radio" name="approval-type" value="and"> 会签（所有人通过）</label>
                    </div>
                </div>
                <div class="settings-field">
                    <label>超时设置</label>
                    <div class="timeout-setting">
                        <input type="number" min="1" value="24">
                        <span>小时后</span>
                        <select>
                            <option value="remind">提醒</option>
                            <option value="auto-pass">自动通过</option>
                            <option value="auto-reject">自动拒绝</option>
                        </select>
                    </div>
                </div>
            `;
        case '条件分支':
            return `
                <div class="settings-field">
                    <label>条件设置</label>
                    <div class="condition-list">
                        <div class="condition-item">
                            <input type="text" placeholder="条件名称" value="条件1">
                            <textarea placeholder="条件表达式">{表单.金额} > 1000</textarea>
                            <button class="btn-icon"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        <div class="condition-item">
                            <input type="text" placeholder="条件名称" value="条件2">
                            <textarea placeholder="条件表达式">{表单.金额} <= 1000</textarea>
                            <button class="btn-icon"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <button class="btn-secondary add-condition"><i class="fas fa-plus"></i> 添加条件</button>
                </div>
            `;
        case '通知节点':
            return `
                <div class="settings-field">
                    <label>通知人</label>
                    <select multiple>
                        <option value="starter">发起人</option>
                        <option value="manager">直接主管</option>
                        <option value="department">部门经理</option>
                        <option value="custom">自定义</option>
                    </select>
                </div>
                <div class="settings-field">
                    <label>通知方式</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" checked> 站内消息</label>
                        <label><input type="checkbox" checked> 邮件</label>
                        <label><input type="checkbox"> 短信</label>
                        <label><input type="checkbox"> 微信</label>
                    </div>
                </div>
                <div class="settings-field">
                    <label>通知内容</label>
                    <textarea placeholder="请输入通知内容">您有一个新的审批任务需要处理</textarea>
                </div>
            `;
        default:
            return `
                <div class="settings-field">
                    <label>节点名称</label>
                    <input type="text" value="${nodeType}">
                </div>
                <div class="settings-field">
                    <label>节点描述</label>
                    <textarea placeholder="请输入节点描述"></textarea>
                </div>
            `;
    }
}

// 保存节点设置
function saveNodeSettings(node, settingsPanel) {
    // 根据节点类型保存不同的设置
    const nodeType = node.getAttribute('data-type');
    
    // 更新节点标题（如果有修改）
    const nameInput = settingsPanel.querySelector('input[type="text"]');
    if (nameInput) {
        const nodeTitle = node.querySelector('.node-title');
        if (nodeTitle && nameInput.value.trim() !== '') {
            nodeTitle.textContent = nameInput.value.trim();
        }
    }
    
    // 这里可以添加更多特定节点类型的设置保存逻辑
    console.log(`保存${nodeType}节点设置`);
}

// 保存工作流
function saveWorkflow() {
    const workflowDesigner = document.getElementById('workflow-designer');
    if (!workflowDesigner) return;
    
    const canvas = workflowDesigner.querySelector('.workflow-canvas');
    const formTitle = workflowDesigner.querySelector('.form-title').value || '新建流程';
    
    // 收集所有节点信息
    const nodes = [];
    canvas.querySelectorAll('.workflow-node').forEach(node => {
        nodes.push({
            id: node.id,
            type: node.getAttribute('data-type'),
            title: node.querySelector('.node-title').textContent,
            position: {
                x: parseInt(node.style.left),
                y: parseInt(node.style.top)
            }
        });
    });
    
    // 收集所有连接线信息
    const connections = [];
    canvas.querySelectorAll('.connection').forEach(conn => {
        connections.push({
            source: conn.getAttribute('data-source'),
            sourcePosition: conn.getAttribute('data-source-position'),
            target: conn.getAttribute('data-target'),
            targetPosition: conn.getAttribute('data-target-position')
        });
    });
    
    // 构建工作流数据
    const workflowData = {
        title: formTitle,
        nodes: nodes,
        connections: connections,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
    };
    
    // 保存到本地存储（实际应用中应该保存到服务器）
    localStorage.setItem('workflow_' + Date.now(), JSON.stringify(workflowData));
    
    alert('流程保存成功！');
    console.log('保存的工作流数据:', workflowData);
}

// 预览工作流
function previewWorkflow() {
    const workflowDesigner = document.getElementById('workflow-designer');
    if (!workflowDesigner) return;
    
    // 创建预览模态框
    const previewModal = document.createElement('div');
    previewModal.className = 'preview-modal';
    previewModal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3>流程预览</h3>
                <i class="fas fa-times close-preview"></i>
            </div>
            <div class="preview-body">
                <div class="workflow-preview">
                    <!-- 这里将显示流程预览 -->
                </div>
            </div>
            <div class="preview-footer">
                <button class="btn-primary close-preview">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(previewModal);
    
    // 复制当前流程图到预览区域
    const canvas = workflowDesigner.querySelector('.workflow-canvas');
    const previewArea = previewModal.querySelector('.workflow-preview');
    
    // 创建流程图的只读副本
    const canvasClone = canvas.cloneNode(true);
    
    // 移除所有交互元素和事件
    canvasClone.querySelectorAll('.connector, .node-actions').forEach(el => el.remove());
    
    previewArea.appendChild(canvasClone);
    
    // 添加关闭事件
    const closeButtons = previewModal.querySelectorAll('.close-preview');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => previewModal.remove());
    });
}