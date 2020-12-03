# 打包程序
直接使用`maven`的`package`命令打包，然后找到`mqr-rest-xxx.jar`的jar包，一般在`mqr-rest`模块的`target`目录。

::: tip
默认的打包方式，jar包里面只包含主程序代码，是不能直接运行的
:::

想全量打包（打包出可以直接运行的jar），得在`mqr-rest`的`pom.xml`文件中找到如下代码块并删除它，然后使用`maven`的`package`打包：
``` xml
<configuration>
    <mainClass>com.molicloud.mqr.RobotApplication</mainClass>
    <layout>ZIP</layout>
    <includes>
        <include>
            <groupId>nothing</groupId>
            <artifactId>nothing</artifactId>
        </include>
    </includes>
</configuration>
```

## 运行程序
1、把打包好的主程序`mqr-rest-xxx.jar`放入一个文件夹

2、把项目的db目录也复制到主程序同级目录

3、使用java命令启动主程序示例：

``` bash
java -jar mqr-rest-xxx.jar
```

如果想Linux后台静默运行，并输出日志，示例：
``` bash
nohup java -jar mqr-rest-xxx.jar > mqr.log 2>&1 &
```

## 控制页面
::: tip
运行成功之后，打开浏览器，访问http://127.0.0.1:8181进入控制台

默认登录账号和密码：`admin` / `123456`
:::