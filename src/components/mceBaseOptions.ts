import type { Editor as EditorType } from 'tinymce'

const setup = (editor: EditorType) => {
  editor.ui.registry.addToggleButton('codesample', {
    tooltip: 'Calculation',
    icon: 'code-sample',
    onAction () {
      if (!editor.selection.getContent()) editor.insertContent(' ') // ,{ no_selection: false }
      editor.execCommand('mceToggleFormat', false, 'code')
    },
    onSetup (api) {
      api.setActive(editor.formatter.match('code'))
      const unbind = editor.formatter.formatChanged('code', api.setActive).unbind
      return () => unbind && unbind()
    }
  })
  editor.ui.registry.addNestedMenuItem('insertvariable', {
    text: 'Variables',
    onSetup (api) {
      api.setDisabled(editor.selection.getNode().tagName !== 'CODE')
      return () => undefined
    },
    getSubmenuItems: () => [
      {
        type: 'menuitem',
        text: 'Weight (kg)',
        onAction: function () {
          editor.insertContent('weightKg')
        }
      },
      {
        type: 'nestedmenuitem',
        text: 'Age',
        icon: 'user',
        getSubmenuItems () {
          return [
            {
              type: 'menuitem',
              text: 'Years',
              icon: 'unlock',
              onAction () {
                editor.insertContent('ageYears')
              }
            },
            {
              type: 'menuitem',
              text: 'Days',
              icon: 'lock',
              onAction () {
                editor.insertContent('ageDays')
              }
            },
            {
              type: 'menuitem',
              text: 'CGA (weeks)',
              icon: 'lock',
              onAction () {
                editor.insertContent('cga')
              }
            }
          ]
        }
      },
      {
        type: 'menuitem',
        text: 'BSA (m²)',
        onAction () {
          editor.insertContent('bsa')
        }
      }
    ]
  })
}

const allBlocks = 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video'

export const mceBaseOptions = {
  selector: 'textarea',
  setup,
  plugins: 'textcolor colorpicker visualblocks contextmenu code',
  contextmenu: 'insertvariable',
  menubar: false,
  toolbar: 'undo redo | styleselect fontsizeselect | removeformat | bold italic | superscript subscript' +
    ' | outdent indent | code codesample | backcolor forecolor | underline strikethrough' +
    ' | alignleft aligncenter alignright',
  formats: {
    alignleft: { selector: allBlocks, classes: 'text-left' },
    aligncenter: { selector: allBlocks, classes: 'text-center' },
    alignright: { selector: allBlocks, classes: 'text-right' },
    strikethrough: { inline: 'del' }
  },
  fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt',
  content_css: 'bolus_drugs.css',
  forced_root_block: 'div',
  toolbar_location: 'bottom',
  valid_children: '-code[*]'
}
