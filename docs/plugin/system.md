# 插件系统
插件系统负责QQ机器人的各种事件处理，目前Beta版本仅支持对好友消息和群消息的处理，群管功能后续会马上跟进。

## 插件执行器
在插件中，实现 `com.molicloud.mqr.common.plugin.PluginExecutor` 接口的类被称为插件执行器，如下示例：

``` java
@Component
public class TestPluginExecutor implements PluginExecutor {

}
```

::: warning 注意
需在执行器的类上加 `@Component` 注解

插件系统会扫描所有引用的插件执行器，然后获取执行器中的所有插件钩子，所以每个插件最少得有一个插件执行器和一个插件钩子。
:::

## 插件钩子
在插件执行器中，注解了 `@PHook` 的方法被称为插件钩子，插件钩子可以自定义一下属性：

| 字段名         | 字段类型       | 默认值  | 描述  |
| ------------- |:-------------:|:------:| ----- | 
| name      | String | 无默认值，必填 | 钩子名，全局唯一     |
| listeningAllMessage      | boolean      | false   | 是否监听所有消息，监听所有消息的插件不需要匹配关键字即可优先触发   |
| keywords | String[]      | 默认值为空数组 | 消息中的触发关键字列表，当消息中包含某个关键字时，插件钩子就会被触发执行 |
| robotEvents | RobotEventEnum[] | 无默认值，必填 | 触发事件列表，只有定义了相应的事件，机器人的相应事件才会触发此插件钩子，详见 `RobotEventEnum` 类 |
| order | int      | 0 | 执行优先级，值越小执行优先级越高 |
| defaulted | boolean      | false | 是否为默认的插件，如果持有的插件钩子、监听所有消息插件钩子、常规插件钩子都没有返回结果，则默认的插件不需要触发关键字，并在最后执行 |

插件钩子方法只能且只需要接收一个参数 `PluginParam`，并且返回值必须是 `PluginResult` ，插件钩子定义示例：

``` java
@Component
public class TestPluginExecutor implements PluginExecutor {

    @PHook(name = "Test", 
        keywords = { "测试", "嗨" }, 
        robotEvents = { RobotEventEnum.FRIEND_MSG, RobotEventEnum.GROUP_MSG })
    public PluginResult messageHandler(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        // ...
        return pluginResult;
    }
}
```

以上插件钩子的定义表示：当好友消息或群消息中包含 `测试` 或 `嗨` 关键字时，就会触发此插件钩子的执行。

## 插件入参
插件入参统一是 `com.molicloud.mqr.common.plugin.PluginParam`，参数字段如下：

| 字段名         | 字段类型       | 描述  |
| ------------- |:-------------:| ----- | 
| from      | String | 消息发送者QQ号码，如果是群消息，则为群成员的消息发送者QQ号，如果是好友消息，则为好友QQ号     |
| to      | String | 消息接收者QQ号码，如果是群消息，则为群号，如果是好友消息，则为机器人QQ号 |
| data | 泛型 | 机器人接收的消息体，可以是字符串，也可以是 `mqr-common` 模块 `com.molicloud.mqr.common.plugin.message` 包下的类 |
| executeTriggerEnum | ExecuteTriggerEnum | 插件钩子的触发类型枚举，记录插件钩子是怎么被触发的：KEYWORD（关键字），HOLD（主动持有），DEFAULTED（默认的），LISTENING_ALL_MESSAGE（监听所有消息）。 |
| robotEventEnum | RobotEventEnum | 机器人事件枚举，记录插件钩子是被什么事件触发的 |

## 插件返回结果
插件返回结果统一是 `com.molicloud.mqr.common.plugin.PluginResult`，字段定义如下：

| 字段名         | 字段类型       | 描述  |
| ------------- |:-------------:| ----- | 
| processed      | boolean | 事件是否已处理，设置为true，插件的结果才会被执行，否则表示此插件不作任何处理，并且此事件接着会被其它插件处理 |
| hold      | boolean | 是否持有事件消息，设置为 true，那么这个发消息的人，下次不管发的什么消息，都会优先被当前插件处理（除了监听所有消息的插件） |
| data | 泛型 | 返回的消息体，此数据会直接被机器人当作消息发送出去，可以是字符串，也可以是 `mqr-common` 模块 `com.molicloud.mqr.common.plugin.message` 包下的类 |

::: warning 注意
字段 `processed` 默认值为false，当没有设置此字段的值，或者手动设置此字段的值为false时，那么表示此插件钩子不想处理这个事件消息，那么插件系统会接着把此事件消息交给下一个符合条件的插件钩子处理。 
:::