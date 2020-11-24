# 说明
目前<Badge text="Beta" type="warning" vertical="middle" />版本仅支持在 `mqr-plugin` 模块中使用Java语言开发插件，然后在 `mqr-framework` 中引用开发的插件模块即可生效。

::: tip 其它语言的插件开发
后续会支持远程Api插件，到时候不管是php、go、python等，只要向外提供API接口，都能接入 `MQR` 的插件系统。
:::

## 开发步骤
在 `mqr-plugin` 新增要开发的插件模块，然后在 `mqr-framework` 中引用新增的模块，例：
``` xml
<dependency>
    <groupId>com.molicloud.mqr</groupId>
    <artifactId>mqr-plugin-test</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```