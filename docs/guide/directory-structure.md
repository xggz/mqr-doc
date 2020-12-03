# 目录结构

MQR根节点总共有1个目录和4个模块：

``` 
.
├── db
│   └── mqr.db `sqlite数据库`
├── mqr-common `公共依赖包，插件只需引入此模块即可`
├── mqr-plugin `插件模块`
|   ├── mqr-plugin-core 插件核心依赖包
|   ├── mqr-plugin-framework 插件框架
|   └── mqr-plugin-inner 内部默认插件
├── mqr-rest `Api接口模块`
|   ├── src/main/java/com.molicloud.mqr/RobotApplication.java 程序入口
|   └── src/main/resource/application.yml 配置文件
└── mqr-service `数据库服务模块`
```