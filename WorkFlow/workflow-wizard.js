// 流程设计向导功能实现

// 初始化流程设计向导
function initWorkflowWizard() {
    const workflowDesigner = document.getElementById('workflow-designer');
    if (!workflowDesigner) return;
    
    // 创建向导界面
    workflowDesigner.innerHTML = `
        <div class="wizard-container">
            <div class="wizard-header">
                <h2>创建新流程</h2>
                <div class="wizard-steps">
                    <div class="wizard-step active" data-step="1">
                        <span class="step-number">1</span>
                        <span class="step-title">选择模板</span>
                    </div>
                    <div class="wizard-step" data-step="2">
                        <span class="step-number">2</span>
                        <span class="step-title">配置表单</span>
                    </div>
                    <div class="wizard-step" data-step="3">
                        <span class="step-number">3</span>
                        <span class="step-title">设计流程</span>
                    </div>
                    <div class="wizard-step" data-step="4">
                        <span class="step-number">4</span>
                        <span class="step-title">确认发布</span>
                    </div>
                </div>
            </div>
            <div class="wizard-content">
                <!-- 步骤1：选择模板 -->
                <div class="wizard-step-content active" data-step="1">
                    <div class="template-list">
                        <div class="template-item" data-template="blank">
                            <div class="template-icon"><i class="fas fa-file"></i></div>
                            <div class="template-info">
                                <h3>空白模板</h3>
                                <p>从零开始创建自定义流程</p>
                            </div>
                        </div>
                        <div class="template-item" data-template="approval">
                            <div class="template-icon"><i class="fas fa-clipboard-check"></i></div>
                            <div class="template-info">
                                <h3>审批流程</h3>
                                <p>标准的分级审批流程模板</p>
                            </div>
                        </div>
                        <div class="template-item" data-template="leave">
                            <div class="template-icon"><i class="fas fa-calendar-minus"></i></div>
                            <div class="template-info">
                                <h3>请假申请</h3>
                                <p>员工请假申请及审批流程</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 步骤2：配置表单 -->
                <div class="wizard-step-content" data-step="2">
                    <div class="form-designer-container">
                        <!-- 表单设计器将在这里初始化 -->
                    </div>
                </div>
                
                <!-- 步骤3：设计流程 -->
                <div class="wizard-step-content" data-step="3">
                    <div class="workflow-designer-container">
                        <!-- 流程设计器将在这里初始化 -->
                    </div>
                </div>
                
                <!-- 步骤4：确认发布 -->
                <div class="wizard-step-content" data-step="4">
                    <div class="publish-preview">
                        <div class="preview-section">
                            <h3>流程信息</h3>
                            <div class="preview-form">
                                <div class="form-group">
                                    <label>流程名称</label>
                                    <input type="text" class="workflow-name" placeholder="请输入流程名称">
                                </div>
                                <div class="form-group">
                                    <label>流程描述</label>
                                    <textarea class="workflow-description" placeholder="请输入流程描述"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>生效时间</label>
                                    <input type="datetime-local" class="workflow-effective-time">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wizard-footer">
                <button class="btn-secondary wizard-prev" disabled>上一步</button>
                <button class="btn-primary wizard-next">下一步</button>
            </div>
        </div>
    `;
    
    // 初始化向导交互
    initWizardInteractions();
}

// 初始化向导交互功能
function initWizardInteractions() {
    const wizardContainer = document.querySelector('.wizard-container');
    if (!wizardContainer) return;
    
    const steps = wizardContainer.querySelectorAll('.wizard-step');
    const contents = wizardContainer.querySelectorAll('.wizard-step-content');
    const prevButton = wizardContainer.querySelector('.wizard-prev');
    const nextButton = wizardContainer.querySelector('.wizard-next');
    
    let currentStep = 1;
    
    // 更新步骤显示
    function updateSteps() {
        steps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        contents.forEach(content => {
            const contentStep = parseInt(content.getAttribute('data-step'));
            if (contentStep === currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevButton.disabled = currentStep === 1;
        if (currentStep === 4) {
            nextButton.textContent = '发布';
        } else {
            nextButton.textContent = '下一步';
        }
    }
    
    // 下一步按钮点击事件
    nextButton.addEventListener('click', function() {
        if (currentStep < 4) {
            currentStep++;
            updateSteps();
            
            // 根据当前步骤初始化相应的设计器
            if (currentStep === 2) {
                initFormDesigner();
            } else if (currentStep === 3) {
                initWorkflowDesigner();
            }
        } else {
            // 发布流程
            publishWorkflow();
        }
    });
    
    // 上一步按钮点击事件
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });
    
    // 模板选择事件
    const templateItems = wizardContainer.querySelectorAll('.template-item');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            templateItems.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            
            // 存储选中的模板类型
            const templateType = this.getAttribute('data-template');
            wizardContainer.setAttribute('data-selected-template', templateType);
        });
    });
}

// 页面加载完成后初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 发布按钮点击事件
    const publishBtn = document.querySelector('.btn-publish');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            publishWorkflow();
        });
    }
    
    // 添加返回按钮事件
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-secondary back-btn';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 返回';
    backBtn.style.position = 'absolute';
    backBtn.style.top = '24px';
    backBtn.style.left = '24px';
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    document.body.appendChild(backBtn);
});

// 发布流程
function publishWorkflow() {
    const wizardContainer = document.querySelector('.wizard-container');
    const workflowName = wizardContainer.querySelector('.workflow-name').value || document.querySelector('input[placeholder="请输入"]').value;
    const workflowDescription = wizardContainer.querySelector('.workflow-description').value || document.querySelector('textarea[placeholder="适用于请假申请"]').value;
    const effectiveTime = wizardContainer.querySelector('.workflow-effective-time').value;
    
    // 验证必填信息
    if (!workflowName) {
        alert('请输入流程名称');
        return;
    }
    
    // 收集流程数据
    const workflowData = {
        name: workflowName,
        description: workflowDescription,
        effectiveTime: effectiveTime,
        template: wizardContainer.getAttribute('data-selected-template'),
        // 这里需要添加表单和流程节点的数据
    };
    
    // 在实际应用中，这里应该将数据发送到服务器
    console.log('发布流程:', workflowData);
    
    // 显示发布成功提示
    alert('流程发布成功！');
    
    // 返回列表页面
    document.querySelector('[data-target="publish-management"]').click();
}