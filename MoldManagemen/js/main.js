// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有组件
    initializeComponents();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化页面状态
    initializePageState();
});

// 初始化组件
function initializeComponents() {
    // 初始化导航菜单
    initializeNavigation();
    
    // 初始化其他组件
    initializeSearch();
    initializeNotifications();
    initializeUserActions();
}

// 初始化导航菜单
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu ul li');
    const views = document.querySelectorAll('.view');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有菜单项的active类
            menuItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的菜单项添加active类
            this.classList.add('active');

            // 隐藏所有视图
            views.forEach(view => view.classList.remove('active'));
            // 显示对应的视图
            const targetView = document.getElementById(this.dataset.target);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
}

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('搜索:', this.value);
        });
    }
}

// 初始化通知功能
function initializeNotifications() {
    const notification = document.querySelector('.notification');
    const message = document.querySelector('.message');
    const settings = document.querySelector('.settings');

    if (notification) {
        notification.addEventListener('click', function() {
            console.log('打开通知面板');
        });
    }

    if (message) {
        message.addEventListener('click', function() {
            console.log('打开消息面板');
        });
    }

    if (settings) {
        settings.addEventListener('click', function() {
            console.log('打开设置面板');
        });
    }
}

// 初始化用户相关操作
function initializeUserActions() {
    const logout = document.querySelector('.logout');
    if (logout) {
        logout.addEventListener('click', function() {
            console.log('执行登出操作');
        });
    }
}

// 初始化页面状态
function initializePageState() {
    // 激活默认视图（仪表盘）
    const defaultView = document.getElementById('dashboard');
    if (defaultView) {
        defaultView.classList.add('active');
    }
    
    const defaultMenuItem = document.querySelector('.menu ul li[data-target="dashboard"]');
    if (defaultMenuItem) {
        defaultMenuItem.classList.add('active');
    }
}

// 初始化页面状态
function initializePageState() {
    // 激活默认标签页
    const defaultTab = document.querySelector('.usage-tab');
    if (defaultTab) {
        switchTab(defaultTab);
    }
    
    // 初始化表格选择
    initializeTableSelection();
    
    // 设置默认筛选器状态
    initializeFilters();
}

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有菜单项的active类
            menuItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的菜单项添加active类
            this.classList.add('active');

            // 隐藏所有视图
            views.forEach(view => view.classList.remove('active'));
            // 显示对应的视图
            const targetView = document.getElementById(this.dataset.target);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function() {
        // 实现搜索逻辑
        console.log('搜索:', this.value);
    });

    // 通知和消息点击事件
    const notification = document.querySelector('.notification');
    const message = document.querySelector('.message');
    const settings = document.querySelector('.settings');

    notification.addEventListener('click', function() {
        console.log('打开通知面板');
    });

    message.addEventListener('click', function() {
        console.log('打开消息面板');
    });

    settings.addEventListener('click', function() {
        console.log('打开设置面板');
    });

    // 登出功能
    const logout = document.querySelector('.logout');
    logout.addEventListener('click', function() {
        console.log('执行登出操作');
    });

    // 模具信息管理相关功能
    const addMoldBtn = document.getElementById('add-mold-btn');
    if (addMoldBtn) {
        addMoldBtn.addEventListener('click', function() {
            console.log('打开新增模具表单');
        });
    }

    // 表格操作按钮事件
    const actionButtons = document.querySelectorAll('.action-buttons button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.classList.contains('view-btn') ? '查看' :
                          this.classList.contains('edit-btn') ? '编辑' :
                          this.classList.contains('delete-btn') ? '删除' : '';
            const row = this.closest('tr');
            const moldId = row.querySelector('td:nth-child(2)').textContent;
            console.log(`${action}模具:`, moldId);
        });
    });

    // 表格全选功能
    const selectAll = document.querySelector('.select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.select-item');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 筛选功能
    const filterInputs = document.querySelectorAll('.filter-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchBtn = document.querySelector('.btn-search');
    const resetBtn = document.querySelector('.btn-reset');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const filters = {};
            filterInputs.forEach(input => {
                filters[input.placeholder] = input.value;
            });
            filterSelects.forEach(select => {
                filters[select.options[0].text] = select.value;
            });
            console.log('应用筛选:', filters);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            filterInputs.forEach(input => input.value = '');
            filterSelects.forEach(select => select.value = '');
            console.log('重置筛选');
        });
    }
});