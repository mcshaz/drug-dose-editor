import {
  Mark,
  getMarkAttributes,
  mergeAttributes
} from '@tiptap/core'

export interface TextStyleOptions {
  HTMLAttributes: Record<string, unknown>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textStyle: {
      /**
       * Remove spans without inline style attributes.
       */
      removeEmptyTextStyle: () => ReturnType,
    }
  }
}

export const TextClass = Mark.create<TextStyleOptions>({
  name: 'textClass',

  addOptions () {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML () {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const hasStyling = (element as HTMLElement).hasAttribute('class') ||
            (element as HTMLElement).hasAttribute('style')

          if (!hasStyling) {
            return false
          }

          return {}
        }
      }
    ]
  },

  addGlobalAttributes () {
    return [
      {
        types: [this.name],
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

  renderHTML ({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands () {
    return {
      setClass: className => ({ chain }) => {
        return chain()
          .setMark('textClass', { class: className })
          .run()
      },
      unsetClass: () => ({ chain }) => {
        return chain()
          .setMark('textClass', { class: null })
          .removeEmptyTextStyle()
          .run()
      },
      removeEmptyTextStyle: () => ({ state, commands }) => {
        const attributes = getMarkAttributes(state, this.type)
        // const hasAttributes = Object.entries(attributes).some(([, value]) => !!value)
        const hasAttributes = Object.values(attributes).some(v => v)
        if (hasAttributes) {
          return true
        }

        return commands.unsetMark(this.name)
      }
    }
  }

})
