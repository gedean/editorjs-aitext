import Paragraph from '@editorjs/paragraph'
import {
  TAITextApi,
  TAITextCSS,
  TAITextCallback,
  TAITextConstructor,
  TAITextData,
  TAITextElement,
  TAITextReadOnly
} from '../aitext'
import { debounce } from './lib'

class AIText extends Paragraph {
  private callback: TAITextCallback
  private _element: TAITextElement
  private _CSS: TAITextCSS
  private _data: TAITextData
  private readOnly: TAITextReadOnly = false
  private api: TAITextApi
  private typingTimer: number | undefined

  static get toolbox() {
    return {
      title: 'AI TEXT',
      icon: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    }
  }

  constructor({ api, block, config, data }: TAITextConstructor) {
    super({
      api,
      block,
      config,
      data
    })

    if (!config.callback) {
      throw new Error('Callback function é obrigatória!')
    }

    this.callback = config.callback
  }

  getAICompletion(content: string) {
    if (!content) return

    this.callback?.(content)
      .then((response) => {
        const aiSuggestions = document.createElement('span')
        aiSuggestions.innerHTML = ''
        aiSuggestions.id = 'ai-suggestions'
        aiSuggestions.style.color = 'lightgray'
        aiSuggestions.innerHTML = response

        this._element?.appendChild(aiSuggestions)

        this._element?.querySelector('#ai-suggestions-loader')?.remove()
      })
      .catch((error) => {
        throw new Error(error)
      })
  }

  onInput = debounce((e) => {
    clearTimeout(this.typingTimer)

    const aiSuggestionsElement = this._element?.querySelector('#ai-suggestions')
    if (aiSuggestionsElement) {
      aiSuggestionsElement.remove()
    }

    const textContent = e.target.innerHTML

    if (
      e.inputType === 'deleteContentBackward' ||
      e.inputType === 'deleteContentForward' ||
      e.inputType === 'insertParagraph' ||
      e.inputType === 'insertFromPaste' ||
      e.inputType === 'insertFromDrop' ||
      !textContent
    ) {
      return
    }

    if (textContent.endsWith('&nbsp;&nbsp;') && !aiSuggestionsElement) {
      this.getAICompletion(textContent)
    }

    this.typingTimer = setTimeout(() => {
      this.acceptAISuggestion()
    }, 2500)
  })

  acceptAISuggestion() {
    const aiSuggestionElement = this._element?.querySelector('#ai-suggestions')
    if (!aiSuggestionElement) return

    const aiSuggestionTextContent = aiSuggestionElement.textContent
    if (!aiSuggestionTextContent) return

    const aiSuggestionTextNode = document.createTextNode(aiSuggestionTextContent)

    this._element?.appendChild(aiSuggestionTextNode)
    aiSuggestionElement.remove()

    let fullTextContent = this._element?.textContent || ''

    fullTextContent = fullTextContent
      .replace(/\s{2,}/g, ' ')
      .replace(/\s([.,:;!?'"(){}[\]<>\-\\/~`@#$%^&*_=+|])/g, '$1')

    if (this._element) {
      this._element.textContent = fullTextContent
    }

    this.moveCursorToEnd()
  }

  moveCursorToEnd() {
    const range = document.createRange()
    const selection = window.getSelection()
    if (!selection || !this._element) return

    range.selectNodeContents(this._element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    this._element.focus()
  }

  onKeyUp(e: { code: string }) {
    clearTimeout(this.typingTimer)

    if (e.code === 'Escape' || e.code === 'Backspace') {
      this._element?.querySelector('#ai-suggestions')?.remove()
      return
    }

    if ((e.code !== 'Backspace' && e.code !== 'Delete') || !this._element) {
      return
    }

    const { textContent } = this._element

    if (textContent === '') {
      this._element.innerHTML = ''
    }
  }

  drawView() {
    const div = document.createElement('DIV')

    div.classList.add(this._CSS.wrapper, this._CSS.block)
    div.contentEditable = 'false'
    div.dataset.placeholder = this.api.i18n.t(this._placeholder)

    if (this._data.text) {
      div.innerHTML = this._data.text
    }

    if (!this.readOnly) {
      div.contentEditable = 'true'
      div.addEventListener('keyup', this.onKeyUp)
      div.addEventListener('input', this.onInput)
    }

    return div
  }

  private _placeholder(_placeholder: any): string | undefined {
    throw new Error('Method not implemented.')
  }
}

export default AIText
