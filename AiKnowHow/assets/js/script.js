/**
 * 企业智能知识库应用脚本
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏切换
  initializeSidebar();
  
  // 初始化模态框
  initializeModals();
  
  // 初始化表单提交
  initializeFormSubmission();
  
  // 初始化搜索框
  initializeSearch();
  
  // 初始化选项卡切换
  initializeTabs();
  
  // 初始化下拉菜单
  initializeDropdowns();
  
  // 初始化时间戳转换
  convertTimestamps();
});

/**
 * 初始化侧边栏开关
 */
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
}

/**
 * 初始化模态框
 */
function initializeModals() {
  // 获取所有模态框触发按钮
  const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const modal = document.querySelector(targetId);
      
      if (modal) {
        openModal(modal);
      }
    });
  });
  
  // 获取所有关闭按钮
  const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  
  // 点击模态框背景关闭
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
}

/**
 * 打开模态框
 * @param {HTMLElement} modal - 模态框元素
 */
function openModal(modal) {
  document.body.style.overflow = 'hidden';
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

/**
 * 关闭模态框
 * @param {HTMLElement} modal - 模态框元素
 */
function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

/**
 * 初始化表单提交
 */
function initializeFormSubmission() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const formData = new FormData(this);
      const formObject = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      
      console.log('Form submitted:', formObject);
      // 这里可以添加AJAX提交逻辑
      
      // 显示提交成功消息
      showNotification('操作成功！', 'success');
      
      // 如果是模态框中的表单，关闭模态框
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });
}

/**
 * 显示通知消息
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型（success, error, warning, info）
 */
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // 添加到文档
  document.body.appendChild(notification);
  
  // 显示通知
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 自动消失
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * 初始化搜索框功能
 */
function initializeSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const searchContainer = this.getAttribute('data-search-container');
      const container = document.querySelector(searchContainer);
      
      if (container) {
        const items = container.querySelectorAll('[data-search-item]');
        
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });
}

/**
 * 初始化选项卡切换
 */
function initializeTabs() {
  const tabLinks = document.querySelectorAll('[data-toggle="tab"]');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 获取目标选项卡
      const targetId = this.getAttribute('data-target');
      const tabContent = document.querySelector(targetId);
      
      if (tabContent) {
        // 找到当前活动的选项卡和内容，并移除活动状态
        const tabContainer = this.closest('.tabs');
        if (tabContainer) {
          const activeLink = tabContainer.querySelector('.tab-link.active');
          if (activeLink) {
            activeLink.classList.remove('active');
          }
          
          const activeContent = document.querySelector('.tab-content.active');
          if (activeContent) {
            activeContent.classList.remove('active');
          }
          
          // 激活新选项卡
          this.classList.add('active');
          tabContent.classList.add('active');
        }
      }
    });
  });
}

/**
 * 初始化下拉菜单
 */
function initializeDropdowns() {
  const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.nextElementSibling;
      if (dropdown && dropdown.classList.contains('dropdown-menu')) {
        dropdown.classList.toggle('show');
      }
    });
  });
  
  // 点击外部关闭下拉菜单
  document.addEventListener('click', function() {
    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  });
}

/**
 * 转换时间戳为可读时间
 */
function convertTimestamps() {
  const timeElements = document.querySelectorAll('[data-timestamp]');
  
  timeElements.forEach(element => {
    const timestamp = parseInt(element.getAttribute('data-timestamp'));
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      element.textContent = date.toLocaleString();
    }
  });
}

/**
 * 初始化知识库管理页面功能
 */
function initializeDatasetManagement() {
  // 获取当前页面URL，以确定是否在知识库管理页面
  const currentPath = window.location.pathname;
  if (!currentPath.includes('datasets.html')) return;
  
  // 初始化标签输入功能
  initializeTagInput();
  
  // 初始化图标选择器
  initializeIconSelector();
  
  // 初始化颜色选择器
  initializeColorSelector();
  
  // 初始化数据来源切换
  initializeSourceTypeToggle();
  
  // 初始化文件上传功能
  initializeFileUpload();
  
  // 初始化知识库卡片交互
  initializeDatasetCards();
  
  // 初始化知识库创建表单提交
  initializeDatasetForm();
}

/**
 * 初始化标签输入功能
 */
function initializeTagInput() {
  const tagInput = document.getElementById('dataset-tags-input');
  const tagContainer = document.querySelector('.tag-input-tags');
  const hiddenInput = document.getElementById('dataset-tags');
  
  if (!tagInput || !tagContainer || !hiddenInput) return;
  
  const tags = [];
  
  tagInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const tag = this.value.trim();
      if (tag && !tags.includes(tag)) {
        // 添加标签
        tags.push(tag);
        updateTags();
      }
      
      // 清空输入
      this.value = '';
    }
  });
  
  function updateTags() {
    // 清空容器
    tagContainer.innerHTML = '';
    
    // 添加标签
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.innerHTML = `
        ${tag}
        <i class="fa-solid fa-times" data-tag="${tag}"></i>
      `;
      tagContainer.appendChild(tagElement);
    });
    
    // 更新隐藏输入的值
    hiddenInput.value = tags.join(',');
    
    // 添加删除事件监听
    document.querySelectorAll('.tag i').forEach(icon => {
      icon.addEventListener('click', function() {
        const tagToRemove = this.getAttribute('data-tag');
        const index = tags.indexOf(tagToRemove);
        if (index !== -1) {
          tags.splice(index, 1);
          updateTags();
        }
      });
    });
  }
}

/**
 * 初始化图标选择器
 */
function initializeIconSelector() {
  const selectedIcon = document.querySelector('.selected-icon');
  const iconOptions = document.querySelector('.icon-options');
  const iconOptionElements = document.querySelectorAll('.icon-option');
  const hiddenInput = document.getElementById('dataset-icon');
  
  if (!selectedIcon || !iconOptions || !iconOptionElements.length || !hiddenInput) return;
  
  // 显示/隐藏图标选项
  selectedIcon.addEventListener('click', function() {
    const isVisible = iconOptions.style.display === 'grid';
    iconOptions.style.display = isVisible ? 'none' : 'grid';
  });
  
  // 点击外部关闭图标选项
  document.addEventListener('click', function(e) {
    if (!selectedIcon.contains(e.target) && !iconOptions.contains(e.target)) {
      iconOptions.style.display = 'none';
    }
  });
  
  // 选择图标
  iconOptionElements.forEach(option => {
    option.addEventListener('click', function() {
      const icon = this.getAttribute('data-icon');
      const iconHTML = this.innerHTML;
      
      selectedIcon.innerHTML = iconHTML;
      hiddenInput.value = icon;
      
      iconOptions.style.display = 'none';
    });
  });
}

/**
 * 初始化颜色选择器
 */
function initializeColorSelector() {
  const colorOptions = document.querySelectorAll('.color-option');
  const hiddenInput = document.getElementById('dataset-color');
  
  if (!colorOptions.length || !hiddenInput) return;
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除所有选中状态
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      
      // 添加选中状态
      this.classList.add('selected');
      
      // 更新隐藏输入的值
      const color = this.getAttribute('data-color');
      hiddenInput.value = color;
    });
  });
}

/**
 * 初始化数据来源切换
 */
function initializeSourceTypeToggle() {
  const sourceButtons = document.querySelectorAll('.source-type-btn');
  const sourceOptions = document.querySelectorAll('.source-option');
  
  if (!sourceButtons.length || !sourceOptions.length) return;
  
  sourceButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按钮的活动状态
      sourceButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加当前按钮的活动状态
      this.classList.add('active');
      
      // 隐藏所有源选项
      sourceOptions.forEach(option => option.classList.add('hidden'));
      
      // 显示对应的源选项
      const sourceType = this.getAttribute('data-source');
      const targetOption = document.getElementById(`source-${sourceType}`);
      if (targetOption) {
        targetOption.classList.remove('hidden');
      }
    });
  });
}

/**
 * 初始化文件上传功能
 */
function initializeFileUpload() {
  const fileUploadArea = document.querySelector('.file-upload-area');
  const fileInput = document.getElementById('file-upload');
  const uploadBtn = document.querySelector('.upload-btn');
  const uploadedFiles = document.querySelector('.uploaded-files');
  
  if (!fileUploadArea || !fileInput || !uploadBtn || !uploadedFiles) return;
  
  // 点击上传按钮触发文件选择
  uploadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    fileInput.click();
  });
  
  // 拖放文件到上传区域
  fileUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  });
  
  fileUploadArea.addEventListener('dragleave', function() {
    fileUploadArea.classList.remove('dragover');
  });
  
  fileUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });
  
  // 文件选择变化
  fileInput.addEventListener('change', function() {
    if (this.files.length) {
      handleFiles(this.files);
    }
  });
  
  // 处理文件
  function handleFiles(files) {
    Array.from(files).forEach(file => {
      // 创建文件项
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      // 获取文件扩展名
      const extension = file.name.split('.').pop().toLowerCase();
      
      // 根据扩展名选择图标
      let iconClass = 'fa-file';
      if (['pdf'].includes(extension)) {
        iconClass = 'fa-file-pdf';
      } else if (['doc', 'docx'].includes(extension)) {
        iconClass = 'fa-file-word';
      } else if (['xls', 'xlsx'].includes(extension)) {
        iconClass = 'fa-file-excel';
      } else if (['ppt', 'pptx'].includes(extension)) {
        iconClass = 'fa-file-powerpoint';
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        iconClass = 'fa-file-image';
      } else if (['txt', 'md'].includes(extension)) {
        iconClass = 'fa-file-lines';
      } else if (['zip', 'rar', '7z'].includes(extension)) {
        iconClass = 'fa-file-archive';
      }
      
      // 格式化文件大小
      const fileSizeDisplay = formatFileSize(file.size);
      
      fileItem.innerHTML = `
        <div class="file-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-meta">${extension.toUpperCase()} | ${fileSizeDisplay}</div>
        </div>
        <div class="file-actions">
          <button class="btn-text file-remove" title="移除"><i class="fa-solid fa-times"></i></button>
        </div>
      `;
      
      uploadedFiles.appendChild(fileItem);
      
      // 添加移除按钮事件
      const removeBtn = fileItem.querySelector('.file-remove');
      removeBtn.addEventListener('click', function() {
        fileItem.remove();
      });
    });
  }
  
  // 格式化文件大小
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * 初始化知识库卡片交互
 */
function initializeDatasetCards() {
  const datasetCards = document.querySelectorAll('.dataset-card');
  
  datasetCards.forEach(card => {
    // 添加点击事件，进入详情页面
    card.addEventListener('click', function(e) {
      // 如果点击的是操作按钮，不进行跳转
      if (e.target.closest('.dataset-actions')) {
        return;
      }
      
      // 这里可以添加跳转到详情页面的逻辑
      console.log('查看知识库详情:', this.querySelector('h4').textContent);
    });
  });
}

/**
 * 初始化知识库创建表单提交
 */
function initializeDatasetForm() {
  const form = document.getElementById('create-dataset-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(this);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    console.log('创建知识库:', formObject);
    
    // 显示提交成功消息
    showNotification('知识库创建成功！', 'success');
    
    // 关闭模态框
    const modal = document.getElementById('create-dataset-modal');
    if (modal) {
      closeModal(modal);
    }
    
    // 重置表单
    this.reset();
  });
}

/**
 * 创建新的聊天会话
 */
function createNewChat() {
  console.log('Creating new chat');
  // 可以添加更新UI或发送请求的逻辑
  showNotification('已创建新的聊天', 'success');
}

/**
 * 发送聊天消息
 * @param {Event} event - 表单提交事件
 */
function sendMessage(event) {
  event.preventDefault();
  
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  
  if (message) {
    // 添加用户消息到UI
    appendMessage(message, 'user');
    
    // 清空输入框
    messageInput.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
      const response = "这是一个模拟的AI回复，实际应用中应该从后端API获取响应。";
      appendMessage(response, 'ai');
    }, 1000);
  }
}

/**
 * 添加消息到聊天区域
 * @param {string} text - 消息文本
 * @param {string} sender - 发送者类型 ('user' 或 'ai')
 */
function appendMessage(text, sender) {
  const messagesContainer = document.querySelector('.chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${sender}`;
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.textContent = text;
  
  messageDiv.appendChild(messageContent);
  messagesContainer.appendChild(messageDiv);
  
  // 滚动到底部
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * 切换展示模式（列表/网格）
 * @param {string} mode - 展示模式 ('list' 或 'grid')
 */
function switchDisplayMode(mode) {
  const container = document.querySelector('.display-container');
  if (container) {
    container.className = `display-container mode-${mode}`;
    
    // 更新切换按钮状态
    const buttons = document.querySelectorAll('.view-mode-btn');
    buttons.forEach(button => {
      if (button.getAttribute('data-mode') === mode) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
/**
 * 初始化系统设置页面
 */
function initializeSettings() {
  // 只在设置页面执行
  if (!document.querySelector('.settings-layout')) {
    return;
  }
  
  // 设置导航项点击事件
  const navItems = document.querySelectorAll('.settings-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 获取目标部分的ID
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // 移除所有导航项和内容区域的活动状态
        document.querySelectorAll('.settings-nav-item').forEach(navItem => {
          navItem.classList.remove('active');
        });
        
        document.querySelectorAll('.settings-section').forEach(section => {
          section.classList.remove('active');
        });
        
        // 激活当前导航项和内容区域
        this.classList.add('active');
        targetSection.classList.add('active');
      }
    });
  });
  
  // 主题选择器
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除其他选项的选中状态
      themeOptions.forEach(opt => opt.classList.remove('selected'));
      // 添加当前选项的选中状态
      this.classList.add('selected');
      // 选中单选按钮
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });
  
  // 颜色选择器
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除其他选项的选中状态
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      // 添加当前选项的选中状态
      this.classList.add('selected');
      // 选中单选按钮
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });
}

// 在DOM加载完成后调用函数
document.addEventListener('DOMContentLoaded', function() {
  initializeSettings();
  initializeDashboard();
  initializeDatasetManagement();
  convertTimestamps();
});

/**
 * 初始化数据仪表盘页面
 */
function initializeDashboard() {
  // 获取当前页面URL以确定是否在仪表盘页面
  const currentPath = window.location.pathname;
  if (!currentPath.includes('dashboard.html')) return;
  
  // 模拟数据加载
  simulateDashboardData();
  
  // 初始化时间线切换功能
  initializeTimelineControls();
  
  // 为仪表盘卡片添加交互性
  initializeDashboardCards();
}

/**
 * 模拟仪表盘数据
 */
function simulateDashboardData() {
  // 模拟数据统计
  updateStatisticsCard('total-kb', getRandomNumber(10, 50));
  updateStatisticsCard('total-docs', getRandomNumber(500, 5000));
  updateStatisticsCard('total-queries', getRandomNumber(1000, 10000));
  updateStatisticsCard('active-users', getRandomNumber(20, 200));
  
  // 模拟资源使用情况
  updateResourceUsage('cpu-usage', getRandomNumber(10, 90));
  updateResourceUsage('memory-usage', getRandomNumber(20, 85));
  updateResourceUsage('storage-usage', getRandomNumber(30, 75));
  updateResourceUsage('api-usage', getRandomNumber(5, 60));
  
  // 模拟知识库使用情况
  simulateKnowledgeBaseUsage();
  
  // 模拟最近活动
  simulateRecentActivities();
}

/**
 * 更新统计卡片数据
 * @param {string} id - 元素ID
 * @param {number} value - 统计值
 */
function updateStatisticsCard(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value.toLocaleString();
  }
}

/**
 * 更新资源使用情况
 * @param {string} id - 元素ID
 * @param {number} percentage - 百分比值
 */
function updateResourceUsage(id, percentage) {
  const progressBar = document.querySelector(`#${id} .progress-bar`);
  const percentageDisplay = document.querySelector(`#${id} .percentage`);
  
  if (progressBar && percentageDisplay) {
    progressBar.style.width = `${percentage}%`;
    percentageDisplay.textContent = `${percentage}%`;
    
    // 根据使用率设置颜色
    if (percentage > 80) {
      progressBar.classList.add('high');
    } else if (percentage > 50) {
      progressBar.classList.add('medium');
    } else {
      progressBar.classList.add('low');
    }
  }
}

/**
 * 模拟知识库使用情况
 */
function simulateKnowledgeBaseUsage() {
  const kbUsageData = [
    { name: '企业文档', percentage: getRandomNumber(25, 40) },
    { name: '产品知识', percentage: getRandomNumber(15, 30) },
    { name: '客户支持', percentage: getRandomNumber(10, 25) },
    { name: '研发资料', percentage: getRandomNumber(5, 20) },
    { name: '其他', percentage: getRandomNumber(5, 15) }
  ];
  
  // 确保百分比总和为100
  const sum = kbUsageData.reduce((acc, item) => acc + item.percentage, 0);
  kbUsageData.forEach(item => item.percentage = Math.round(item.percentage / sum * 100));
  
  // 更新知识库使用比例图表
  const kbUsageElement = document.querySelector('.kb-usage-chart');
  if (kbUsageElement) {
    // 清空现有内容
    kbUsageElement.innerHTML = '';
    
    // 创建比例图表
    let startPercentage = 0;
    kbUsageData.forEach((item, index) => {
      const segment = document.createElement('div');
      segment.classList.add('chart-segment');
      segment.style.width = `${item.percentage}%`;
      segment.style.backgroundColor = getChartColor(index);
      segment.title = `${item.name}: ${item.percentage}%`;
      kbUsageElement.appendChild(segment);
      
      // 创建图例项
      const legendItem = document.createElement('div');
      legendItem.classList.add('chart-legend-item');
      legendItem.innerHTML = `
          <span class="legend-color" style="background-color: ${getChartColor(index)}"></span>
          <span class="legend-label">${item.name}</span>
          <span class="legend-value">${item.percentage}%</span>
      `;
      document.querySelector('.chart-legend').appendChild(legendItem);
    });
  }
}

/**
 * 获取图表颜色
 * @param {number} index - 索引值
 * @returns {string} - 颜色代码
 */
function getChartColor(index) {
  const colors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8430CE',
    '#3B7EAA', '#B23683', '#F07C41', '#5E9A7A', '#53A0D4'
  ];
  return colors[index % colors.length];
}

/**
 * 模拟最近活动
 */
function simulateRecentActivities() {
  const activities = [
    { type: 'upload', user: '张经理', target: '企业战略文档', time: '5分钟前' },
    { type: 'query', user: '李工程师', target: '技术架构规范', time: '15分钟前' },
    { type: 'create', user: '王产品', target: '新产品知识库', time: '32分钟前' },
    { type: 'update', user: '赵研发', target: '开发文档', time: '1小时前' },
    { type: 'delete', user: '系统管理员', target: '过期客户资料', time: '2小时前' },
    { type: 'query', user: '客服团队', target: '产品问答库', time: '3小时前' },
    { type: 'upload', user: '市场部', target: '市场分析报告', time: '4小时前' },
    { type: 'update', user: '人力资源', target: '员工手册', time: '5小时前' }
  ];
  
  const timelineElement = document.querySelector('.timeline-content');
  if (timelineElement) {
    // 清空现有内容
    timelineElement.innerHTML = '';
    
    // 添加活动项
    activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.classList.add('timeline-item');
      
      let iconClass = '';
      switch (activity.type) {
        case 'upload': iconClass = 'fa-solid fa-upload'; break;
        case 'query': iconClass = 'fa-solid fa-search'; break;
        case 'create': iconClass = 'fa-solid fa-plus'; break;
        case 'update': iconClass = 'fa-solid fa-pen'; break;
        case 'delete': iconClass = 'fa-solid fa-trash'; break;
        default: iconClass = 'fa-solid fa-circle-info';
      }
      
      activityItem.innerHTML = `
          <div class="timeline-icon">
              <i class="${iconClass}"></i>
          </div>
          <div class="timeline-content">
              <div class="activity-header">
                  <span class="activity-user">${activity.user}</span>
                  <span class="activity-time">${activity.time}</span>
              </div>
              <p class="activity-desc">
                  ${getActivityDescription(activity.type, activity.target)}
              </p>
          </div>
      `;
      timelineElement.appendChild(activityItem);
    });
  }
}

/**
 * 获取活动描述
 * @param {string} type - 活动类型
 * @param {string} target - 活动目标
 * @returns {string} - 活动描述
 */
function getActivityDescription(type, target) {
  switch (type) {
    case 'upload': return `上传了新文档到 <strong>${target}</strong>`;
    case 'query': return `查询了 <strong>${target}</strong> 相关信息`;
    case 'create': return `创建了新的知识库 <strong>${target}</strong>`;
    case 'update': return `更新了 <strong>${target}</strong> 的内容`;
    case 'delete': return `删除了 <strong>${target}</strong>`;
    default: return `与 <strong>${target}</strong> 进行了交互`;
  }
}

/**
 * 初始化时间线控制
 */
function initializeTimelineControls() {
  const timelineFilters = document.querySelectorAll('.timeline-filter');
  if (timelineFilters.length > 0) {
    timelineFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // 移除所有激活状态
        timelineFilters.forEach(f => f.classList.remove('active'));
        
        // 添加当前项的激活状态
        this.classList.add('active');
        
        // 获取过滤类型
        const filterType = this.getAttribute('data-filter');
        console.log('Filter timeline by:', filterType);
        // 这里可以实现时间线过滤逻辑
      });
    });
  }
}

/**
 * 初始化仪表盘卡片
 */
function initializeDashboardCards() {
  // 为卡片添加点击事件 (可以用于显示详细信息)
  const dashboardCards = document.querySelectorAll('.dashboard-card');
  dashboardCards.forEach(card => {
    card.addEventListener('click', function() {
      console.log('Card clicked:', this.querySelector('h3').textContent);
      // 这里可以实现卡片点击展示详情的逻辑
    });
  });
}

/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 随机数
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
