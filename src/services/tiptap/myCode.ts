import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes
} from '@tiptap/core'

export interface MyCodeOptions {
  HTMLAttributes: Record<string, unknown>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    code: {
      /**
       * Set a bold mark
       */
      setCode: () => ReturnType,
      /**
       * Toggle a bold mark
       */
      toggleCode: () => ReturnType,
      /**
       * Unset a bold mark
       */
      unsetCode: () => ReturnType
    }
  }
}

const moustacheInputRegex = /(?:^|\s)((?:{{)((?:[^}]+))(?:}}))$/
const moustachePasteRegex = /(?:^|\s)((?:{{)((?:[^}]+))(?:}}))/g

export const myCode = Mark.create<MyCodeOptions>({
  name: 'code',
  priority: -1,
  code: false,
  spanning: false,
  // excludes: '_',
  addOptions () {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML () {
    return [
      {
        tag: 'code'
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands () {
    return {
      setCode: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleCode: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetCode: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  },

  addKeyboardShortcuts () {
    return {
      'Mod-e': () => this.editor.commands.toggleOutput(),
      'Mod-E': () => this.editor.commands.toggleOutput()
    }
  },

  addInputRules () {
    return [
      markInputRule({
        find: moustacheInputRegex,
        type: this.type
      })
    ]
  },

  addPasteRules () {
    return [
      markPasteRule({
        find: moustachePasteRegex,
        type: this.type
      })
    ]
  }
})
