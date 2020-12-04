# 插件执行器抽象类
当插件执行器继承`AbstractPluginExecutor`这个抽象类后，就可以在插件执行器中直接使用这个类集成的方法。

::: tip
实现`PluginExecutor`接口和继承`AbstractPluginExecutor`抽象类，都被叫做插件执行器，
但是实现`PluginExecutor`接口没有以下集成方法，没有特殊需求，推荐使用`AbstractPluginExecutor`抽象类。
:::

## pushMessage
异步推送消息，可以在插件内任意多次调用，推送的对象请参考`PluginResult`

## getHookSetting
获取插件钩子的自定义配置，这个方法接收一个Class参数，用来指定获取的配置类型。

::: tip
为了方便插件能够自定义一些小型配置，特意增强的一个方法，
该方法配合`saveHookSetting`这个方法一起使用，
通过`saveHookSetting`方法保存的对象可以直接通过`getHookSetting`获取， 
获取的时候只需要传入数据类型即可。
:::

## saveHookSetting
保存和修改配置，直接传入要保存的对象即可，保存后可以通过`getHookSetting`来获取。

::: tip
每个插件钩子只能保存一个配置数据，多次调用会覆盖之前的配置。

机器人或服务重启后该配置不会丢失，一直生效。
:::

## getAdmins
获取机器人的管理员列表（这里指的是在web页面配置的管理员列表，不是群管理员）

## getGroupList
获取机器人所在的所有群列表

## getFriendList
获取机器人的所有好友列表