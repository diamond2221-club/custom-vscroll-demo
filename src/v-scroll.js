// v-scroll Web Component
// 基于原生滚动 + 自定义滑块的虚拟滚动条组件
// Import CSS string injected by Vite plugin via Import Map alias "$/v-scroll.js"
import CSS from '$/v-scroll.js';

// 将 CSS 字符串注入到 document.head（仅注入一次）
const injectStyle = () => {
  if (document.head.querySelector('#v-scroll-style')) return;
  const el = document.createElement('style');
  el.id = 'v-scroll-style';
  el.textContent = CSS;
  document.head.appendChild(el);
};

// 端点间距常量（px），滑块上下两端预留空间
const PADDING = 3;

// 最小滑块高度（px）
const MIN_THUMB = 16;

// 计算滑块高度：可见区域 / 总内容高度 * 轨道高度，不低于 MIN_THUMB
const calcThumbH = (viewport_h, content_h, track_h) =>
  Math.max(MIN_THUMB, Math.round((viewport_h / content_h) * track_h));

// 计算可滚动的轨道范围（排除端点间距和滑块本身）
const calcTrackRange = (track_h, thumb_h) => track_h - thumb_h - PADDING * 2;

// 根据 scrollTop 计算滑块 top 位置
const scrollToThumbTop = (scroll_top, scroll_range, track_range) =>
  PADDING + (scroll_top / scroll_range) * track_range;

// 根据滑块位移计算 scrollTop
const thumbDeltaToScroll = (delta_y, scroll_range, track_range) =>
  (delta_y / track_range) * scroll_range;

// v-scroll 自定义元素
const VScroll = class extends HTMLElement {
  // Shadow DOM 内部引用
  #viewport = null; // 真实滚动容器
  #track = null;    // 滚动轨道
  #bar = null;      // 滑块

  // 拖拽状态
  #drag_start_y = 0;
  #drag_start_scroll = 0;
  #is_dragging = false;

  // Resize Observer 实例
  #ro = null;

  connectedCallback() {
    injectStyle();
    this.#build();
    this.#bind();
  }

  disconnectedCallback() {
    this.#destroy();
  }

  // 构建 Shadow DOM 结构
  #build() {
    const shadow = this.attachShadow({ mode: 'open' });

    // 滚动容器：真实的 overflow:auto 容器，隐藏原生滚动条
    this.#viewport = document.createElement('div');
    this.#viewport.setAttribute('part', 'viewport');

    // 将 light DOM 的 slot 内容投射进来
    const slot = document.createElement('slot');
    this.#viewport.appendChild(slot);

    // 轨道容器
    this.#track = document.createElement('s');
    this.#track.setAttribute('part', 'track');

    // 滑块
    this.#bar = document.createElement('b');
    this.#bar.setAttribute('part', 'bar');
    this.#track.appendChild(this.#bar);

    shadow.appendChild(this.#viewport);
    shadow.appendChild(this.#track);

    // Shadow DOM 内部基础布局样式（仅结构，外观在 CSS 文件中通过 ::part 控制）
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
      }
      [part="viewport"] {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        /* 隐藏系统滚动条：webkit 方案 + 标准方案 */
        scrollbar-width: none;
        -ms-overflow-style: none;
        box-sizing: border-box;
      }
      [part="viewport"]::-webkit-scrollbar {
        display: none;
      }
      [part~="track"] {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
      }
      [part~="track"].visible {
        display: block;
      }
      [part~="bar"] {
        position: absolute;
        left: 0;
        right: 0;
      }
    `;
    shadow.prepend(style);
  }

  // 绑定事件与观察者
  #bind() {
    // 滚动同步：滚动时更新滑块位置
    this.#viewport.addEventListener('scroll', this.#onScroll);

    // 滑块拖拽：使用 Pointer Events + setPointerCapture 防止鼠标脱出
    this.#bar.addEventListener('pointerdown', this.#onBarDown);

    // 轨道点击（点击空白轨道区域跳页）
    this.#track.addEventListener('pointerdown', this.#onTrackDown);

    // 监听容器和内容尺寸变化
    this.#ro = new ResizeObserver(this.#onResize);
    this.#ro.observe(this.#viewport);
    // 监听 slot 内容变化（内容插入/删除时重算）
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', this.#onResize);
  }

  // 销毁：解绑所有监听，防止内存泄漏
  #destroy() {
    this.#viewport?.removeEventListener('scroll', this.#onScroll);
    this.#bar?.removeEventListener('pointerdown', this.#onBarDown);
    this.#track?.removeEventListener('pointerdown', this.#onTrackDown);
    this.#ro?.disconnect();
    this.#ro = null;
  }

  // 尺寸变化处理
  #onResize = () => {
    const viewport_h = this.#viewport.clientHeight,
      content_h = this.#viewport.scrollHeight;

    // 内容不超出容器时隐藏滚动条
    if (content_h <= viewport_h) {
      this.#track.classList.remove('visible');
      return;
    }
    this.#track.classList.add('visible');
    this.#updateBar();
  };

  // 更新滑块位置和高度
  #updateBar() {
    const viewport_h = this.#viewport.clientHeight,
      content_h = this.#viewport.scrollHeight,
      scroll_top = this.#viewport.scrollTop,
      track_h = this.#track.clientHeight,
      thumb_h = calcThumbH(viewport_h, content_h, track_h),
      scroll_range = content_h - viewport_h,
      track_range = calcTrackRange(track_h, thumb_h),
      top = scrollToThumbTop(scroll_top, scroll_range, track_range);

    this.#bar.style.height = thumb_h + 'px';
    this.#bar.style.top = top + 'px';
  }

  // 同步滚动位置到滑块
  #onScroll = () => {
    this.#updateBar();
  };

  // 滑块按下：开始拖拽
  #onBarDown = (e) => {
    // 只响应主键（左键）
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    // 捕获指针，防止鼠标移出元素时丢失事件
    this.#bar.setPointerCapture(e.pointerId);

    this.#is_dragging = true;
    this.#drag_start_y = e.clientY;
    this.#drag_start_scroll = this.#viewport.scrollTop;

    // 拖拽中激活样式
    this.#bar.setAttribute('part', 'bar bar-active');
    this.#track.setAttribute('part', 'track track-active');

    this.#bar.addEventListener('pointermove', this.#onBarMove);
    this.#bar.addEventListener('pointerup', this.#onBarUp);
    this.#bar.addEventListener('pointercancel', this.#onBarUp);
  };

  // 拖拽移动：映射到 scrollTop
  #onBarMove = (e) => {
    if (!this.#is_dragging) return;

    const delta_y = e.clientY - this.#drag_start_y,
      viewport_h = this.#viewport.clientHeight,
      content_h = this.#viewport.scrollHeight,
      track_h = this.#track.clientHeight,
      thumb_h = calcThumbH(viewport_h, content_h, track_h),
      scroll_range = content_h - viewport_h,
      track_range = calcTrackRange(track_h, thumb_h),
      scroll_delta = thumbDeltaToScroll(delta_y, scroll_range, track_range);

    this.#viewport.scrollTop = Math.max(0, Math.min(scroll_range, this.#drag_start_scroll + scroll_delta));
  };

  // 拖拽结束
  #onBarUp = (e) => {
    this.#is_dragging = false;
    this.#bar.releasePointerCapture(e.pointerId);
    this.#bar.setAttribute('part', 'bar');
    this.#track.setAttribute('part', 'track');
    this.#bar.removeEventListener('pointermove', this.#onBarMove);
    this.#bar.removeEventListener('pointerup', this.#onBarUp);
    this.#bar.removeEventListener('pointercancel', this.#onBarUp);
  };

  // 点击轨道空白处：滚动一页
  #onTrackDown = (e) => {
    // 如果点击的是滑块本身则跳过（由 onBarDown 处理）
    if (e.target === this.#bar) return;
    e.preventDefault();

    const track_rect = this.#track.getBoundingClientRect(),
      click_y = e.clientY - track_rect.top,
      viewport_h = this.#viewport.clientHeight,
      content_h = this.#viewport.scrollHeight,
      track_h = this.#track.clientHeight,
      thumb_h = calcThumbH(viewport_h, content_h, track_h),
      scroll_range = content_h - viewport_h,
      track_range = calcTrackRange(track_h, thumb_h),
      // 点击位置映射到 scrollTop
      target_scroll = ((click_y - PADDING - thumb_h / 2) / track_range) * scroll_range;

    this.#viewport.scrollTo({ top: Math.max(0, Math.min(scroll_range, target_scroll)), behavior: 'smooth' });
  };
};

customElements.define('v-scroll', VScroll);
