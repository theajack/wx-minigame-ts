## webpack + typescript 开发微信小游戏

[源码地址](https://github.com/theajack/wx-minigame-ts)

微信小游戏版本技术选型使用typescript开发

但是微信小游戏原生不支持 typescript 开发，于是探索一下使用ts开发微信小游戏

## 1. 创建小游戏

使用测试号，创建一个使用官方示例的小游戏
![](https://img-blog.csdnimg.cn/ef398ded317f4bb09e1a4f626aabd5de.png)

会生成一个可以直接运行的打飞机小游戏

![](https://img-blog.csdnimg.cn/9e406186b6c24dd5a521148baaba41ed.png)


## 2. 准备工作

### 2.1 安装依赖
 
首先 npm init一下，生成package.json

在 package.json 写入如下 devDeoendencies, npm install一下

```js
"devDependencies": {
        "@babel/core": "^7.6.4",
        "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
        "@babel/plugin-syntax-dynamic-import": "^7.2.0",
        "@babel/preset-env": "^7.6.3",
        "@commitlint/cli": "^8.2.0",
        "@commitlint/config-conventional": "^8.2.0",
        "@typescript-eslint/eslint-plugin": "^4.26.1",
        "@typescript-eslint/parser": "^4.26.1",
        "babel-eslint": "^10.0.3",
        "babel-loader": "^8.0.6",
        "babel-plugin-transform-object-rest-spread": "^6.26.0",
        "eslint": "^7.28.0",
        "eslint-config-standard": "^14.1.0",
        "eslint-loader": "^3.0.2",
        "eslint-plugin-import": "^2.18.2",
        "eslint-plugin-node": "^10.0.0",
        "eslint-plugin-promise": "^4.2.1",
        "husky": "^3.0.9",
        "lint-staged": "^9.4.2",
        "progress-bar-webpack-plugin": "^2.1.0",
        "ts-loader": "^6.2.1",
        "typescript": "^3.7.4",
        "webpack": "^4.41.2",
        "webpack-cli": "^3.3.9",
        "webpack-dev-server": "^3.8.2"
},
```

### 2.2 增加webpack配置

新建 webpack-config 目录，新建dev和prod配置文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/97e9351475634ad7b92c78d57516f409.png)


内容分别如下：

dev.js: dev 环境devtool使用 cheap-source-map ，因为微信小游戏环境支持eval

```js
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    watch: true,
    devtool: 'cheap-source-map',
    mode: 'development',
    entry: path.resolve('./', 'src/index.ts'),
    output: {
        path: path.resolve('./', 'dist'),
        filename: 'main.min.js',
        library: 'WXMiniGameTs',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'this',
    },
    externals: {
    },
    module: {
        rules: [{
            test: /(.ts)$/,
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /(.js)$/,
            use: [{
                loader: 'babel-loader',
            }]
        }, {
            test: /(.js)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/,
            options: {
                configFile: './.eslintrc.js'
            }
        }]
    },
    plugins: [
        new ProgressBarPlugin(),
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};
```

prod.js

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: path.resolve('./', 'src/index.ts'),
    output: {
        path: path.resolve('./', 'dist'),
        filename: 'main.min.js',
        library: 'WXMiniGameTs',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'this',
    },
    externals: {
    },
    module: {
        rules: [{
            test: /(.ts)$/,
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /(.js)$/,
            use: [{
                loader: 'babel-loader',
            }]
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};
```

package.js script 添加:

```js
"dev": "webpack --config webpack-config/dev.js",
"build": "webpack --config webpack-config/prod.js",
```

### 2.3 增加 tsconfig

根目录新建 tsconfig.json:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "outDir": "dist",
        "sourceMap": false,
        "target": "es5",
        "module": "esnext",
        "moduleResolution": "node",
        "allowJs": true,
        "noUnusedLocals": true,
        "strictNullChecks": true,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "experimentalDecorators": true,
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "removeComments": false,
        "jsx": "preserve",
        "lib": ["esnext", "dom"],
        "rootDir": ".",
        "noEmit": false,
        "paths": {
        }
    },
    "include": [
        "src/**/*",
        "game.js"
    ],
    "exclude": [
        "./node_modules",
    ]
}
```

### 2.4 eslint 支持

需要vscode 安装 eslint插件

根目录新增  .eslintrc.js 

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  "globals": {
    "window": true,
    "console": true,
    "module": true,
    "require": true,
    "Promise": true
  },
  "env": {
    "browser": true,
  },
  "parserOptions": {
    "sourceType": "module" // ts 中使用 es 模块
  },
  "rules": {
    'no-var': "error",
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': [
        "error",
        "interface"
    ],
    "@typescript-eslint/no-unused-vars": "error", // 使用 ts 未使用变量的规则 比如枚举类型在es中会报错
    "no-extend-native": 0,
    "no-new": 0,
    "no-useless-escape": 0,
    "no-useless-constructor": 0,
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "indent": ["error", 4, {
      "SwitchCase": 1
    }],
    "space-infix-ops": ["error", {"int32Hint": false}],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "always"
    }],
    "semi": ["error", "always"],
    "comma-dangle": 0,
    "no-console": 0,
    "no-debugger": 0,
    "id-length": 0,
    "eol-last": 0,
    "object-curly-spacing": ["error", "never"],
    "arrow-spacing": "error",
    "no-multiple-empty-lines": "error",
    "spaced-comment": "error",
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "no-unreachable": "error",
    "keyword-spacing": "error",
    "space-before-blocks": "error",
    "semi-spacing": "error",
    "comma-spacing": "error",
    "key-spacing": "error",
    "no-undef": "error",
    "prefer-const": ["error", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }]
  }
};
```

新建 .eslintignore 文件

```
/dist
.eslintrc.js
/webpack-config
/game.js
/src/js/libs
commitlint.config.js
```

package.json script 增加

```
"lint": "eslint src --ext js"
```

### 2.5 增加 babel

根目录新建 .babelrc 文件

```js
{
    "presets": [[
        "@babel/preset-env",
        {
          "useBuiltIns": "entry",
          "targets": {
            "esmodules": true,
            "chrome": "58",
            "ie": "11"
          }
        }
    ]],
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-object-rest-spread"
    ]
}
```

### 2.6 commintlint （非必要）

根目录新建 commitlint.config.js 文件

```js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', [
            'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'
        ]],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never']
    }
};
```

package.json 增加 husky
```
    "husky": {
        "hooks": {
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    },
```

## 3. 代码改造

### 3.1 src源码目录

新建src 目录并且将 js文件迁移到 src目录内

![在这里插入图片描述](https://img-blog.csdnimg.cn/1e2784c1943e4183ba5f6fdda69ae5ed.png)


为了能够快速启动游戏，这里我们使用 ts调用js的方式来改造，暂时不对官方js demo代码进行改造，tsconfig.json中配置了支持这种调用

src 目录下新建 index.ts

```ts
import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'

new Main()
```

### 3.2 game.js 改造

game.js 只需要调用打包的 main.min.js 即可

```js
import './dist/main.min';
```

### 3.3 wx.d.ts

增加微信环境的声明文件 以使ts支持使用微信小游戏的api

src目录下新建 type/wx.d.ts文件 该文件太长 请到[此处](https://github.com/theajack/wx-minigame-ts/blob/master/src/type/wx.d.ts)复制使用


## dev运行 

执行 `npm run dev` 会以 watch mode 开启webpack打包，有代码变更时会自动更新main.min.js文件

打开微信开发者工具，就可以看到项目运行起来了， 其他的改造和coding就自己发挥啦

![在这里插入图片描述](https://img-blog.csdnimg.cn/2bcad032116849b5af4d2cbdcc800ea7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAdGFja2NoZW4=,size_12,color_FFFFFF,t_70,g_se,x_16)


project.config.json 文件修改 ignore 配置，忽略掉不需要上传的源码文件及sourcemap等文件

```
"packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": "dist/main.min.js.map"
      },
      {
        "type": "file",
        "value": ".babelrc"
      },
      {
        "type": "file",
        "value": ".eslintignore"
      },
      {
        "type": "file",
        "value": ".eslintrc.js"
      },
      {
        "type": "file",
        "value": ".gitignore"
      },
      {
        "type": "file",
        "value": "commitlint.config.js"
      },
      {
        "type": "file",
        "value": "package.json"
      },
      {
        "type": "file",
        "value": "README.md"
      },
      {
        "type": "file",
        "value": "tsconfig.json"
      },
      {
        "type": "file",
        "value": "package-lock.json"
      },
      {
        "type": "folder",
        "value": "node_modules"
      },
      {
        "type": "folder",
        "value": "src"
      },
      {
        "type": "folder",
        "value": "webpack-config"
      }
    ]
  },
```

发布时 执行 `npm run build` 之后就可以上传了

