# 插件钩子（`@PHook`）
在插件执行器中，注解了 `@PHook` 的方法被称为插件钩子，插件钩子是机器人对应事件触发的入口执行方法，插件钩子可以自定义以下属性：

| 字段名         | 字段类型       | 默认值  | 描述  |
| ------------- |:-------------:|:------:| ----- | 
| name      | String | 无默认值，必填 | 钩子名，全局唯一     |
| listeningAllMessage      | boolean      | false   | 是否监听所有消息，监听所有消息的插件不需要匹配关键字即可最优先被触发   |
| equalsKeywords | String[]      | 默认值为空数组 | 消息中的触发关键词列表，当此列表的某个关键词与消息内容完全相同时，插件钩子就会被触发执行 |
| startsKeywords | String[]      | 默认值为空数组 | 消息中的触发关键字列表，当此列表的某个关键词是消息内容的前缀时，插件钩子就会被触发执行 |
| endsKeywords | String[]      | 默认值为空数组 | 消息中的触发关键字列表，当此列表的某个关键词是消息内容的后缀时，插件钩子就会被触发执行 |
| containsKeywords | String[]      | 默认值为空数组 | 消息中的触发关键字列表，当此列表的某个关键词在消息内容任意地方存在时，插件钩子就会被触发执行 |
| robotEvents | RobotEventEnum[] | 无默认值，必填 | 触发事件列表，只有定义了相应的事件，机器人的相应事件才会触发此插件钩子，详见 `RobotEventEnum` 枚举 |
| order | int      | 0 | 执行优先级，值越小执行优先级越高 |
| defaulted | boolean      | false | 是否为默认的插件，如果持有的插件钩子、监听所有消息插件钩子、常规插件钩子都没有返回结果，则默认的插件不需要触发关键字，并在最后执行 |

插件钩子方法只能且只需要接收一个参数 `PluginParam`，并且返回值必须是 `PluginResult` 。

#### 插件钩子定义示例一

``` java
@Component
public class TestPluginExecutor implements PluginExecutor {

    @PHook(name = "Test", 
        equalsKeywords = { "测试", "嗨" }, 
        robotEvents = { RobotEventEnum.FRIEND_MSG, RobotEventEnum.GROUP_MSG })
    public PluginResult messageHandler(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        // ...
        return pluginResult;
    }
}
```

以上插件钩子的定义表示：当好友消息或群消息是 `测试` 或 `嗨` 时，就会触发此插件钩子的执行；

#### 插件钩子定义示例二

``` java
@Component
public class TestPluginExecutor implements PluginExecutor {

    @PHook(name = "Test", 
        startsKeywords = { "禁言" }, 
        robotEvents = { RobotEventEnum.GROUP_MSG })
    public PluginResult messageHandler(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        // ...
        return pluginResult;
    }
}
```

以上插件钩子的定义表示：当群消息的前缀是 `禁言` 时，比如消息是`禁言我`，就会触发此插件钩子的执行。

## 插件钩子入参
插件钩子入参统一是 `PluginParam`，这个参数是插件系统告诉插件钩子的触发信息，参数字段如下：

| 字段名         | 字段类型       | 描述  |
| ------------- |:-------------:| ----- | 
| from      | String | 消息发送者QQ号码，如果是群消息，则为群成员的消息发送者QQ号，如果是好友消息，则为好友QQ号     |
| to      | String | 消息接收者QQ号码，如果是群消息，则为群号，如果是好友消息，则为机器人QQ号 |
| at      | boolean | 消息是否At了机器人 |
| ats      | List\<AtDef\> | 消息中的所有At信息（AtDef有被At人的qq和昵称） |
| data | 泛型 | 机器人接收的消息数据，一般是字符串 |
| executeTriggerEnum | ExecuteTriggerEnum | 插件钩子被触发的枚举类型，表示插件钩子是怎么被触发的：KEYWORD（关键字），HOLD（主动持有），DEFAULTED（默认的），LISTENING_ALL_MESSAGE（监听所有消息）。 |
| robotEventEnum | RobotEventEnum | 机器人事件枚举，表示插件钩子是被什么事件触发的 |

## 插件钩子返回结果
插件钩子返回结果统一是 `PluginResult`，用来告诉插件系统你的处理结果，字段定义如下：

| 字段名         | 字段类型       | 描述  |
| ------------- |:-------------:| ----- | 
| processed      | boolean | 事件是否已处理，设置为true，插件钩子的结果才会被执行，否则表示此插件钩子不作任何处理，并且此事件接着会被其它插件钩子处理 |
| hold      | boolean | 是否持有事件消息，设置为 true，那么这个发消息的人，下次不管发的什么消息，都会优先被当前插件钩子处理（除了监听所有消息的插件钩子） |
| action | Action | 插件动作（禁言/解除禁言/踢人等等），具体的各种动作可以参考 `mqr-plugin-core` 模块 `com.molicloud.mqr.plugin.core.action` 包下的类 |
| message | 泛型 | 返回的消息体，此数据会直接被机器人当作消息发送出去，可以是字符串，也可以是 `mqr-plugin-core` 模块 `com.molicloud.mqr.plugin.core.message` 包下的类 |

::: warning 注意
字段 `processed` 默认值为false，当没有设置此字段的值，或者手动设置此字段的值为false时，那么表示此插件钩子不想处理这个事件消息，那么插件系统会接着把此事件消息交给下一个符合条件的插件钩子处理。
:::

::: tip
字段 `hold` 默认值为false，当没有设置此字段的值，或者手动设置此字段的值为false时，那么表示此插件钩子结束了本轮对话；

如果设置此字段为true，则表示插件钩子对本轮对话感兴趣，相比其它常规插件，这个消息发送者的下条消息会优先被当前插件钩子处理（除了监听所有消息的插件，监听所有消息的插件总是最先被执行）
:::