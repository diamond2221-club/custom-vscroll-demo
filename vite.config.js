import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { transform } from 'lightningcss';

// Import Map 内容：将 "$/" 映射到 "/theme/" 路径
const IMPORT_MAP = `<script type="importmap">
{
  "imports": {
    "$/": "/theme/"
  }
}
<\/script>`;

// Vite 插件：
// 1. configResolved：将 theme/v-scroll.css 压缩后写入 public/theme/v-scroll.js
// 2. closeBundle：将 importmap 注入到 dist/index.html（Vite 构建会移除 importmap 标签）
const cssModulePlugin = () => ({
  name: 'css-to-esm-module',
  configResolved(config) {
    const css_path = resolve(config.root, 'theme/v-scroll.css'),
      out_dir = resolve(config.root, 'public/theme'),
      out_path = resolve(out_dir, 'v-scroll.js');

    const css_src = readFileSync(css_path, 'utf-8');

    // 使用 lightningcss 压缩 CSS（去除空白与注释）
    const { code } = transform({
      filename: 'v-scroll.css',
      code: Buffer.from(css_src),
      minify: true,
    });

    // 包装为 ESM 模块
    const esm = `export default ${JSON.stringify(code.toString())};\n`;

    mkdirSync(out_dir, { recursive: true });
    writeFileSync(out_path, esm, 'utf-8');

    console.log('[css-to-esm] wrote public/theme/v-scroll.js');
  },
  closeBundle() {
    // Vite 构建完成后，将 importmap 重新注入到 dist/index.html
    const html_path = resolve('dist/index.html');
    try {
      let html = readFileSync(html_path, 'utf-8');
      // 先清除 Vite 可能残留的 importmap 标签，再统一注入
      html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
      // 在 </head> 前插入 importmap
      html = html.replace('</head>', `${IMPORT_MAP}\n</head>`);
      writeFileSync(html_path, html, 'utf-8');
      console.log('[css-to-esm] injected importmap into dist/index.html');
    } catch {
      // dev 模式不存在 dist/index.html，忽略
    }
  },
});

export default defineConfig({
  plugins: [cssModulePlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // "$/v-scroll.js" 是 Import Map 运行时解析的外部模块，构建时不打包
      external: [/^\$\//],
    },
  },
});
