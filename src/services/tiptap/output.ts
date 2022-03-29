import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes
} from '@tiptap/core'

export interface OutputOptions {
  HTMLAttributes: Record<string, unknown>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    output: {
      /**
       * Set a bold mark
       */
      setOutput: () => ReturnType,
      /**
       * Toggle a bold mark
       */
      toggleOutput: () => ReturnType,
      /**
       * Unset a bold mark
       */
      unsetOutput: () => ReturnType,
    }
  }
}

const moustacheInputRegex = /(?:^|\s)((?:{{)((?:[^}]+))(?:}}))$/
const moustachePasteRegex = /(?:^|\s)((?:{{)((?:[^}]+))(?:}}))/g

export const Output = Mark.create<OutputOptions>({
  name: 'output',

  addOptions () {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML () {
    return [
      {
        tag: 'output'
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['output', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands () {
    return {
      setOutput: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleOutput: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetOutput: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  },

  addKeyboardShortcuts () {
    return {
      'Mod-o': () => this.editor.commands.toggleOutput(),
      'Mod-O': () => this.editor.commands.toggleOutput()
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
