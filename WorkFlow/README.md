# AIReach工作流程配置系统

## 项目结构

```
/WorkFlow/
├── css/                  # 样式文件
│   ├── avatar-styles.css    # 用户头像样式
│   ├── data-analysis.css    # 数据分析页面样式
│   ├── styles.css           # 主样式文件
│   ├── task-tracking.css    # 任务跟踪样式
│   └── workflow-wizard-new.css  # 新版流程向导样式
│
├── images/               # 图像资源
│   ├── user-avatar.svg         # 基础用户头像
│   ├── user-avatar-enhanced.svg # 增强版用户头像
│   └── user-avatar-pro.svg      # 专业版用户头像
│
├── js/                   # JavaScript文件
│   ├── analysis.js          # 数据分析功能
│   ├── avatar.js            # 用户头像处理
│   ├── script.js            # 主脚本文件
│   └── workflow.js          # 工作流功能
│
├── pages/                # 页面文件
│   ├── login.html           # 登录页面
│   └── workflow-wizard-new.html # 新版流程向导
│
└── index.html            # 主页面
```

## 功能模块

1. **工作台** - 显示工作流概览和统计信息
2. **表单设计** - 用于设计自定义表单
3. **流程设计** - 用于设计审批流程
4. **发布管理** - 管理已发布的工作流
5. **数据分析** - 分析工作流使用情况
6. **任务跟踪** - 跟踪待办任务

## 使用说明

1. 启动本地服务器：`python -m http.server 8000`
2. 访问 http://localhost:8000/ 打开主页面
3. 点击"新建流程"按钮进入流程向导
