# 支付宝小程序(Typescript版本)

利用 Typescipe 去构建支付宝小程序。

- .ts -> .js
- .html -> .axml
- .less -> .acss
- .json -> .json

## Descroption

- 可以使用Typescript 的特性去写支付宝小程序
- 完善的支付宝小程序api Typescript 声明
- 支持 Less
- 自动打包 node_modules 第三方库
- 提供图片压缩

## Structure

``` bash
- src // 源文件
  - app.json
  - app.less
  - app.ts
  - extra.ts // 导入需要用到的 npm 包, 并导出. webpack 自动打包，之后项目内所需用到的 npm 包均从此文件导入
  - images // 存放所有图片
  - pages
    - index
      - index.ts
      - index.json
      - index.html
      - index.less

```

## Usage

``` bash
yarn install
```

1. 开发模式

``` bash
yarn dev
```

2. 构建模式

``` bash
yarn build
```

## Attentions

- **先运行** `yarn build`, 然后在打开蚂蚁开发工具
- 蚂蚁开发工具中添加项目时, 路径需指向 `dist` 目录
- `src` 根目录中必须有 `.tea`(由蚂蚁开发工具新建项目时生成，或者直接复制) 目录, 否则无法预览