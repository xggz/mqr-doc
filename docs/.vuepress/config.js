module.exports = {
    title: '茉莉QQ机器人（MQR）',
    description: '茉莉QQ机器人，功能强大，插件灵活/丰富。',
    themeConfig: {
        nav: [
            { text: '主程序', link: '/guide/' },
            { text: '插件开发', link: '/plugin/' },
            { text: '源代码', link: 'https://gitee.com/molicloud/mqr', target:'_blank' }
        ],
        sidebar: [
            {
                title: '主程序',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    {
                        title: '介绍',
                        path: '/guide/'
                    },
                    {
                        title: '目录结构',
                        path: '/guide/directory-structure'
                    },
                    {
                        title: '快速上手',
                        path: '/guide/get-started'
                    }
                ]
            },
            {
                title: '插件开发',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    {
                        title: '说明',
                        path: '/plugin/'
                    },
                    {
                        title: '插件系统',
                        path: '/plugin/system'
                    },
                    {
                        title: '插件示例',
                        path: '/plugin/examples'
                    }
                ]
            }
        ]
    }
}
