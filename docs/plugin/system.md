# 插件系统
插件系统负责QQ机器人的各种事件处理，目前`Alpha`版本仅支持对好友消息和群消息的处理。

## 插件执行器
在插件中，实现 `PluginExecutor` 接口的类被称为插件执行器，如下示例：

``` java
@Component
public class TestPluginExecutor implements PluginExecutor {

}
```

或则继承`AbstractPluginExecutor`抽象类（此类也是实现的`PluginExecutor`接口，一般推荐使用这种方式），如下示例：

``` java
@Component
public class TestPluginExecutor extends AbstractPluginExecutor {

}
```

::: warning 注意
需在插件执行器的类上加 `@Component` 注解，以能被系统扫描到；

插件系统会扫描所有引用的插件执行器，然后获取执行器中的所有插件钩子（`@PHook`）和插件任务调度（`@PJob`）。
:::

## 定义插件信息
插件执行器可以重写getPluginInfo方法，用来告诉插件系统插件信息，以及用来执行安装脚本和升级更新脚本。

#### 插件信息用`PluginInfo`类来表示，字段列表如下：

| 字段名         | 字段类型       | 描述  |
| ------------- |:-------------:| ----- | 
| name      | String | 插件名字 |
| author      | String | 插件作者 |
| homeUrl | String | 插件或作者的主页地址 |
| explain | String | 插件的描述 |
| version | Integer | 插件版本 |
| initScript | String | 插件初始化时的执行sql脚本，也就是第一次安装时的sql脚本，多条sql语句用`;`隔开 |
| updateScriptList | Map\<Integer, String\> | 插件升级的版本更新sql脚本，此`Map`的`key`为此版本代号，`value`为升级的sql，多条sql语句用`;`隔开 |

#### 使用示例：
``` java
@Override
public PluginInfo getPluginInfo() {
    PluginInfo pluginInfo = new PluginInfo();
    pluginInfo.setName("签到插件");
    pluginInfo.setAuthor("WispX");
    pluginInfo.setHomeUrl("https://github.com/wisp-x");
    pluginInfo.setExplain("群签到插件，支持连续签到、签到后发送一言");
    pluginInfo.setVersion(10001);
    pluginInfo.setInitScript(
            "CREATE TABLE \"robot_plugin_signin\" (" +
                    "  \"id\" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                    "  \"group_id\" VARCHAR(50) NOT NULL," +
                    "  \"qq\" VARCHAR(50) NOT NULL," +
                    "  \"is_continuity\" BIT(1) NOT NULL DEFAULT 0," +
                    "  \"num\" INTEGER NOT NULL DEFAULT 0," +
                    "  \"motto\" TEXT NOT NULL," +
                    "  \"update_time\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                    "  \"create_time\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP" +
                    ");");
    return pluginInfo;
}
```