# i18nation

```mermaid
graph LR
    配置文件 --> glob文件收集
    glob文件收集 --> 文件分类器{文件分类器} --> Vue
    文件分类器 --> JSX
    文件分类器 --> JS
    文件分类器 ----> 普通字符串匹配
    普通字符串匹配 ---> 模板字符串匹配

    普通字符串匹配 ---> 字符串适配器
    模板字符串匹配 ---> 模板字符串解析器

    subgraph i18n 适配
    字符串适配器
    模板字符串解析器
    end

    模板字符串匹配 ---> 文件覆盖 ---> Git[Git diff 审核]
```

-   [x] style、class、href 不需要进行抽取
-   [x] script、style、code 标签不需要进行抽取
-   [x] url 不进行抽取
-   [x] #000000 色彩不进行提取
-   [x] .woff2 不进行抽取
-   [x] 数字% 不进行抽取
-   [x] 空字符串、标点符号不抽取
-   [x] html 注释避让
-   [x] 尽量维持原始引号
-   astro
    -   [x] 不解析 inline style
    -   [x] 解析 inline script
    -   [x] 控制 `<!DOCTYPE html>` 的解析
