# 插件任务调度（`@PJob`）
在插件执行器中，注解了 `@PJob` 的方法会加入到任务处理队列，
类似于`Springboot`的`@Scheduled`注解，只不过`@PJob`注解的任务只会在机器人启动后才会生效，
并且在机器人停止运行时取消。

这个注解只有一个属性`cron`，表示执行计划，[cron表达式详解](https://www.cnblogs.com/daxiangfei/p/10219706.html)