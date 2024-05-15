(function() {
  try {
    if (typeof document < "u") {
      var a = document.createElement("style");
      a.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-paragraph[data-placeholder]:empty:before{content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:before{opacity:1}.codex-editor--toolbox-opened .ce-block:first-child .ce-paragraph[data-placeholder]:empty:before,.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:focus:before{opacity:0}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(a);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const c = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class l {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: n, readOnly: i }) {
    this.api = n, this.readOnly = i, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t.placeholder ? t.placeholder : l.DEFAULT_PLACEHOLDER, this._data = {}, this._element = null, this._preserveBlank = t.preserveBlank !== void 0 ? t.preserveBlank : !1, this.data = e;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete")
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = !1, e.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = !0, e.addEventListener("keyup", this.onKeyUp)), e;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {ParagraphData} data
   * @public
   */
  merge(e) {
    const t = {
      text: this.data.text + e.text
    };
    this.data = t;
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !(e.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = {
      text: e.detail.data.innerHTML
    };
    this.data = t;
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: !0
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Get current Tools`s data
   *
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    if (this._element !== null) {
      const e = this._element.innerHTML;
      this._data.text = e;
    }
    return this._data;
  }
  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {ParagraphData} data — data to set
   * @private
   */
  set data(e) {
    this._data = e || {}, this._element !== null && this.hydrate();
  }
  /**
   * Fill tool's view with data
   */
  hydrate() {
    window.requestAnimationFrame(() => {
      this._element.innerHTML = this._data.text || "";
    });
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: c,
      title: "Text"
    };
  }
}
function d(a, e = 500) {
  let t;
  return (...n) => {
    clearTimeout(t), t = setTimeout(() => {
      a.apply(null, n);
    }, e);
  };
}
class h extends l {
  constructor({ api: e, block: t, config: n, data: i }) {
    if (super({
      api: e,
      block: t,
      config: n,
      data: i
    }), this.readOnly = !1, this.onInput = d((r) => {
      var s;
      clearTimeout(this.typingTimer);
      const o = (s = this._element) == null ? void 0 : s.querySelector("#ai-suggestions");
      o && o.remove(), !(r.inputType === "deleteContentBackward" || r.inputType === "deleteContentForward" || r.inputType === "insertParagraph" || r.inputType === "insertFromPaste" || r.inputType === "insertFromDrop" || !r.target.innerHTML) && (this.getAICompletion(r.target.innerHTML), this.typingTimer = setTimeout(() => {
        this.acceptAISuggestion();
      }, 3500));
    }), !n.callback)
      throw new Error("Callback function é obrigatória!");
    this.callback = n.callback;
  }
  static get toolbox() {
    return {
      title: "AI TEXT",
      icon: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    };
  }
  getAICompletion(e) {
    var t;
    e && ((t = this.callback) == null || t.call(this, e).then((n) => {
      var r, o, s;
      const i = document.createElement("span");
      i.innerHTML = "", i.id = "ai-suggestions", i.style.color = "lightgray", i.innerHTML = n, (r = this._element) == null || r.appendChild(i), (s = (o = this._element) == null ? void 0 : o.querySelector("#ai-suggestions-loader")) == null || s.remove();
    }).catch((n) => {
      throw new Error(n);
    }));
  }
  acceptAISuggestion() {
    var i, r;
    const e = (i = this._element) == null ? void 0 : i.querySelector("#ai-suggestions");
    if (!e)
      return;
    const t = e.textContent;
    if (!t)
      return;
    const n = document.createTextNode(t);
    (r = this._element) == null || r.appendChild(n), e.remove(), this.moveCursorToEnd();
  }
  moveCursorToEnd() {
    const e = document.createRange(), t = window.getSelection();
    !t || !this._element || (e.selectNodeContents(this._element), e.collapse(!1), t.removeAllRanges(), t.addRange(e), this._element.focus());
  }
  onKeyUp(e) {
    var n, i;
    if (clearTimeout(this.typingTimer), e.code === "Escape" || e.code === "Backspace") {
      (i = (n = this._element) == null ? void 0 : n.querySelector("#ai-suggestions")) == null || i.remove();
      return;
    }
    if (e.code === "ArrowRight" || e.code === "Enter" || e.code === "AltLeft") {
      this.acceptAISuggestion();
      return;
    }
    if (e.code !== "Backspace" && e.code !== "Delete" || !this._element)
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = "false", e.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = "true", e.addEventListener("keyup", this.onKeyUp), e.addEventListener("input", this.onInput)), e;
  }
  _placeholder(e) {
    throw new Error("Method not implemented.");
  }
}
export {
  h as default
};
