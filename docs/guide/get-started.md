# 快速上手

::: warning 前提条件（暂时的）
MQR 需要 JDK = 1.8、Mysql >= 5.7、Lombok
:::

1. 下载或clone源代码到本地

   推荐使用git clone的方式获取源码，可持续更新最新代码：

   ``` bash
   git clone https://gitee.com/molicloud/mqr.git
   ```

2. 更改配置文件

   找到 `mqr-rest` 模块的配置文件 `application.yml`，修改数据库连接配置（或使用默认的配置也可）。

3. 初始化数据库

   在数据中执行 `databases` 文件夹下的 `mqr.sql` 文件（创建数据库、相关数据表和管理账号），然后创建第2步配置的数据库用户并授权。

   Mysql5.7版本创建用户并授权语句：
   ``` sql
   grant all on `mqr`.* to 'mqr'@'%' identified by 'mqr#Xxx001' with grant option;
   ```

   Mysql8版本创建用户并授权语句：
   ``` sql
   create user 'mqr'@'%' identified by 'mqr#Xxx001';
   grant all privileges on `mqr`.* to 'mqr'@'%' with grant option;
   ```

4. 运行主程序并使机器人上线

   运行 `mqr-rest` 模块的 `RobotApplication`
   
   运行成功后访问后台设置界面：http://127.0.0.1:8181
   
   默认账号/密码：admin/123456
   
   登录成功之后，设置好机器人账号和密码，然后点击运行，如需登录验证则手动操作一下，之后机器人上线成功。