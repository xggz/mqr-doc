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

   找到 `mqr-rest` 模块的配置文件 `application.yml`，填上QQ机器人的账号信息，并修改数据库连接配置。

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

   运行 `mqr-rest` 模块的 `RobotApplication`，观察输出日志，如果机器人QQ使用了设备锁或者异地登录等，会有一个验证，请按照提示完成验证。
   
   假如有验证码图片，图片文件会输出到程序根目录，如果是设备锁或滑动解锁，在日志里面会输出一个url地址，复制下来用浏览器打开，然后手动操作。

::: tip
因为暂时还未开发web页面，web页面和配套的后台程序出来后，可以直接在远程服务器运行主程序，然后在web页面上完成QQ机器人的上线流程。
:::