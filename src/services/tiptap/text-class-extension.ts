import { Extension } from '@tiptap/core'
import '@tiptap/extension-text-style'

export type TextClassOptions = {
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    class: {
      /**
       * Set the text color
       */
      setClass: (className: string) => ReturnType,
      /**
       * Unset the text color
       */
      unsetClass: () => ReturnType,
    }
  }
}

export const Color = Extension.create<TextClassOptions>({
  name: 'class',

  addOptions () {
    return {
      types: ['textStyle']
    }
  },

  addGlobalAttributes () {
    return [
      {
        types: this.options.types,
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.className,
            renderHTML: attributes => {
              if (!attributes.class) {
                return {}
              }

              return {
                class: attributes.class
              }
            }
          }
        }
      }
    ]
  },

  addCommands () {
    return {
      setClass: className => ({ chain }) => {
        return chain()
          .setMark('textStyle', { class: className })
          .run()
      },
      unsetClass: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { class: null })
          .removeEmptyTextStyle()
          .run()
      }
    }
  }
})
