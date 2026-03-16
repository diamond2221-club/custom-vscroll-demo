# v-scroll

原生 Web Components 自定义滚动条组件，零依赖，基于 Vite 构建。

## 特性

- 原生 `customElements` 注册，无框架依赖
- `overflow: auto` 真实滚动 + CSS 隐藏系统滚动条
- Shadow DOM 隔离，`::part()` 伪元素暴露样式控制点
- `ResizeObserver` 动态探测内容高度，自适应滑块
- `Pointer Events` + `setPointerCapture` 防脱离拖拽
- Import Map 主题切换机制
- Vite 插件将 CSS 压缩为 ESM 模块

## 快速开始

```bash
bun i
bun run dev
```

## 构建

```bash
bun run build
```

构建产物在 `dist/`，可直接部署为静态页面。

Vite 插件会在构建时：
1. 读取 `theme/v-scroll.css`
2. 用 `lightningcss` 压缩
3. 写入 `public/theme/v-scroll.js`（ESM 格式）

## 用法

```html
<script type="importmap">
{ "imports": { "$/": "/theme/" } }
</script>

<v-scroll style="width:320px;height:300px;">
  <div>任意内容...</div>
</v-scroll>

<script type="module" src="/src/v-scroll.js"></script>
```

## 主题定制

通过 CSS 变量控制外观：

```css
v-scroll {
  --track-width: 6px;
  --thumb-color: rgba(0,0,0,0.25);
  --thumb-hover-color: rgba(0,0,0,0.45);
  --thumb-active-color: rgba(0,0,0,0.65);
  --track-color: transparent;
  --track-hover-color: rgba(0,0,0,0.06);
}
```

切换主题只需修改 Import Map 的 `"$/"` 路径指向新主题目录。

## 项目结构

```
src/v-scroll.js      # 组件源码
theme/v-scroll.css   # 默认主题样式
public/theme/        # 构建生成的 ESM 主题模块
vite.config.js       # Vite 配置 + CSS 模块插件
index.html           # 演示页面
dist/                # 构建产物（GitHub Pages 部署目录）
```
