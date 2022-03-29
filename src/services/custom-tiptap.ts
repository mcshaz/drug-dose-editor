import { Paragraph } from '@tiptap/extension-paragraph'
// import { Code } from '@tiptap/extension-code'
import { mergeAttributes } from '@tiptap/core'
import { Superscript } from '@tiptap/extension-superscript'
import { TextClass } from './tiptap/text-class'

// Tip Tap Paragraph Extension that changes the default tag to div from p
// Based on: https://github.com/ueberdosis/tiptap/tree/main/packages/extension-paragraph
export const paragraphDiv = Paragraph.extend({
  parseHTML () {
    return [
      { tag: 'div' }
    ]
  },
  renderHTML ({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  }
})

export const arrowRight = Superscript.extend({
  name: 'arrow-right',
  content: 'text*'
}).configure({
  HTMLAttributes: {
    class: 'arrow-right'
  }
})

export const spanFactory = (className: string) => TextClass.extend({
  name: className
}).configure({
  HTMLAttributes: {
    class: className
  }
})

/*
export const spannableCode = Code.extend({
  priority: 0,
  code: false,
  spanning: false
})
*/
