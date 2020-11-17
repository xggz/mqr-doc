# 插件示例
本文将列举几种通用的插件实现类，基本可实现大部分需求。

## 监听所有消息的插件钩子
``` java
package com.molicloud.mqr.plugin.adblock;

import com.molicloud.mqr.common.plugin.PluginExecutor;
import com.molicloud.mqr.common.plugin.PluginParam;
import com.molicloud.mqr.common.plugin.PluginResult;
import com.molicloud.mqr.common.plugin.annotation.PHook;
import com.molicloud.mqr.common.plugin.enums.RobotEventEnum;
import com.molicloud.mqr.common.plugin.message.Ats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 广告/违法信息检测插件
 *
 * 监听所有消息的插件示例
 *
 * @author feitao yyimba@qq.com
 * @since 2020/11/9 5:38 下午
 */
@Slf4j
@Component
public class AdblockPluginExecutor implements PluginExecutor {

    public static final String[] adKeywords = new String[]{ "日赚", "月赚", "招收", "招商" };

    private static final String warnContent = "请勿发送广告或违法信息";

    @PHook(name = "Adblock",
            listeningAllMessage = true,
            robotEvents = { RobotEventEnum.FRIEND_MSG, RobotEventEnum.GROUP_MSG })
    public PluginResult messageHandler(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        Object message = pluginParam.getData();
        if (message instanceof String) {
            if (Arrays.stream(adKeywords).anyMatch(keyword -> String.valueOf(message).contains(keyword))) {
                pluginResult.setProcessed(true);
                if (RobotEventEnum.GROUP_MSG.equals(pluginParam.getRobotEventEnum())) {
                    Ats ats = new Ats();
                    ats.setMids(Arrays.asList(pluginParam.getFrom()));
                    ats.setContent(warnContent);
                    pluginResult.setData(ats);
                } else {
                    pluginResult.setData(warnContent);
                }
            }
        }

        return pluginResult;
    }
}
```

::: tip
监听所有消息的插件钩子，只要 `listeningAllMessage` 字段设置为true就可以。

此类型插件钩子，不需要事件消息中触发关键字，即可捕获所有自定义的 `robotEvents` 事件；

例如本插件的钩子捕获所有群消息和好友消息，然后判断消息中是否包含 "日赚", "月赚", "招收", "招商" 这些关键字，如果包含这些关键字，则返回处理结果，否则不处理，交给下一个插件钩子处理。

注意，消息中不包含"日赚", "月赚", "招收", "招商" 这些关键字，也会触发插件钩子，进入插件处理，只不过是当消息包含这些关键字时返回处理警告，不包含则交给下一个插件钩子处理。
:::

## 关键字触发的常规插件钩子
``` java
package com.molicloud.mqr.plugin.joke;

import cn.hutool.json.JSONObject;
import com.molicloud.mqr.common.plugin.PluginExecutor;
import com.molicloud.mqr.common.plugin.PluginParam;
import com.molicloud.mqr.common.plugin.PluginResult;
import com.molicloud.mqr.common.plugin.annotation.PHook;
import com.molicloud.mqr.common.plugin.enums.RobotEventEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * 笑话插件
 *
 * @author wispx wisp-x@qq.com
 * @since 2020/11/12 1:30 下午
 */
@Slf4j
@Component
public class JokePluginExecutor implements PluginExecutor {

    @Autowired
    private RestTemplate restTemplate;

    @PHook(name = "Joke", keywords = {
            "笑话", "讲个笑话", "说个笑话"
    }, robotEvents = {
            RobotEventEnum.FRIEND_MSG,
            RobotEventEnum.GROUP_MSG,
    })
    public PluginResult messageHandler(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        pluginResult.setProcessed(true);
        pluginResult.setData(getJoke());
        return pluginResult;
    }

    public String getJoke() {
        String url = "http://i.itpk.cn/api.php?question=笑话";
        String response = restTemplate.getForObject(url, String.class);
        JSONObject jsonObject = new JSONObject(response);
        return String.format("《%s》\r\n\r\n%s", jsonObject.getStr("title"), jsonObject.getStr("content"));
    }
}
```

::: tip
此类插件钩子，只要事件消息是自定义的 `keywords` 字段的某一个，并且 `robotEvents` 事件类型也符合，那么就会触发插件钩子。
:::

## 默认插件钩子
``` java
package com.molicloud.mqr.plugin.aireply;

import com.molicloud.mqr.common.plugin.PluginExecutor;
import com.molicloud.mqr.common.plugin.PluginParam;
import com.molicloud.mqr.common.plugin.PluginResult;
import com.molicloud.mqr.common.plugin.annotation.PHook;
import com.molicloud.mqr.common.plugin.enums.RobotEventEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * 智能回复插件
 *
 * @author feitao yyimba@qq.com
 * @since 2020/11/6 3:45 下午
 */
@Slf4j
@Component
public class AiReplyPluginExecutor implements PluginExecutor {

    @Autowired
    private RestTemplate restTemplate;

    // 茉莉机器人API，以下api仅供测试，如需自定义词库和机器人名字等，请前往官网获取，获取地址 http://www.itpk.cn
    private static final String apiKey = "2efdd0243d746921c565225ca4fdf07b";
    private static final String apiSecret = "itpk123456";

    @PHook(name = "AiReply", defaulted = true, robotEvents = { RobotEventEnum.FRIEND_MSG, RobotEventEnum.GROUP_MSG })
    public PluginResult messageHandler(PluginParam pluginParam) {
        String reply = aiReply(String.valueOf(pluginParam.getData()));
        PluginResult pluginResult = new PluginResult();
        pluginResult.setProcessed(true);
        pluginResult.setData(reply);
        return pluginResult;
    }

    private String aiReply(String message) {
        String aiUrl = String.format("http://i.itpk.cn/api.php?question=%s&api_key=%s&api_secret=%s", message, apiKey, apiSecret);
        return restTemplate.getForObject(aiUrl, String.class);
    }
}
```

::: tip
默认插件钩子，需要设置属性 `defaulted` 为true，默认插件钩子既不会全局捕获消息，也不会通过关键字触发，只有当前两者都没有处理消息时，然后插件系统就会根据 `robotEvents` 事件和排序字段 `order`来处理所有的默认插件钩子。
:::

## 插件钩子持有事件消息
``` java
package com.molicloud.mqr.plugin.test;

import com.molicloud.mqr.common.plugin.PluginExecutor;
import com.molicloud.mqr.common.plugin.PluginParam;
import com.molicloud.mqr.common.plugin.PluginResult;
import com.molicloud.mqr.common.plugin.annotation.PHook;
import com.molicloud.mqr.common.plugin.enums.ExecuteTriggerEnum;
import com.molicloud.mqr.common.plugin.enums.RobotEventEnum;

/**
 * 插件持有事件消息 示例
 *
 * @author feitao yyimba@qq.com
 * @since 2020/11/16 8:34 下午
 */
public class TestPluginExecutor implements PluginExecutor {

    @PHook(name = "TestReply",
            keywords = { "点歌", "听歌" },
            robotEvents = { RobotEventEnum.FRIEND_MSG, RobotEventEnum.GROUP_MSG })
    public PluginResult handlerMessage(PluginParam pluginParam) {
        PluginResult pluginResult = new PluginResult();
        // 判断消息是否通过触发关键字进入
        if (ExecuteTriggerEnum.KEYWORD.equals(pluginParam.getExecuteTriggerEnum())) {
            // hold设置为true，持有此消息发送者的消息
            pluginResult.setHold(true);
            pluginParam.setData("请告诉我歌名");
        } else if (ExecuteTriggerEnum.HOLD.equals(pluginParam.getExecuteTriggerEnum())) {
            // 主动持有事件消息进入的插件钩子
            // 在这个插件逻辑中，只有先触发了关键字，才会主动持有，所以消息发送者之前是发送了一个点歌或听歌的关键字

            // 返回歌曲信息给消息发送者之后，设置hold为false，释放事件消息，如果这里还继续设置为true，那么这个消息发送者的下一个事件消息还是会优先被此插件钩子捕获
            pluginResult.setHold(false);
            pluginResult.setData("已为您找到如下歌曲：........");
        }
        return pluginResult;
    }
}
```

::: tip
主动持有事件消息，只要消息发送者第一次发送消息被捕获之后，在返回的 `PluginResult` 中把 `hold` 设置为true就可以了，然后这个消息发送者的下一条消息无论发送的是什么，都会优先被此插件钩子触发，享有最先处理的权利（除了监听所有消息的插件钩子）。
:::