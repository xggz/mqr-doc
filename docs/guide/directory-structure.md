# 目录结构

MQR总共有1个目录和5个模块：

``` 
.
├── databases
|   ├── mqr.mwb `数据库设计原文件`
│   └── mqr.sql `sql语句`
├── mqr-common `公共依赖包，插件只需引入此模块即可`
├── mqr-framework `机器人框架代码的实现`
├── mqr-plugin `插件模块`
├── mqr-rest `Api接口模块`
|   ├── src/main/java/com.molicloud.mqr/RobotApplication.java 程序入口
|   └── src/main/resource/application.yml 配置文件
└── mqr-service `数据库服务模块`
```