#!/bin/bash

# 创建flowseditor文件夹
mkdir -p flowseditor

# 复制工作流向导相关文件
cp pages/workflow-wizard-new.html flowseditor/
cp -r js/workflow-wizard flowseditor/
cp -r css/workflow-wizard flowseditor/
cp -r images/workflow-wizard flowseditor/

# 复制可能需要的依赖文件
cp -r js/lib flowseditor/js/
cp -r css/lib flowseditor/css/

# 确保目标目录结构正确
mkdir -p flowseditor/js
mkdir -p flowseditor/css
mkdir -p flowseditor/images

echo "工作流向导相关文件已成功复制到flowseditor文件夹" 