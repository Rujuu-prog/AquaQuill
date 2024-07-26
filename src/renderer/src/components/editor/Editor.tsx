import '@mantine/tiptap/styles.css'
import classes from './Editor.module.css'

import { useEditor, BubbleMenu, FloatingMenu } from '@tiptap/react'
import { RichTextEditor, Link, getTaskListExtension } from '@mantine/tiptap'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
// icon
import { IconColorPicker, IconSourceCode } from '@tabler/icons-react'
// code
import ts from 'highlight.js/lib/languages/typescript'

interface EditorProps {
  tab: { value: string; label: string; content: string }
  updateTabContent: (tabValue: string, content: string) => void
}

const lowlight = createLowlight()
// register languages that you are planning to use
lowlight.register({ ts })

const SourceCodeIcon = () => <IconSourceCode size="1rem" stroke={1.5} />

export default function Editor({ tab, updateTabContent }: EditorProps): JSX.Element {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '🌊 Start your journey...' }),
      Color,
      TextStyle,
      CodeBlockLowlight.configure({ lowlight }),
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'test-item'
        }
      })
    ],
    content: tab.content,
    onUpdate({ editor }) {
      const content = editor.getHTML()
      updateTabContent(tab.value, content)
    }
  })

  return (
    <RichTextEditor editor={editor} classNames={classes}>
      <RichTextEditor.Toolbar sticky stickyOffset={0}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
          <RichTextEditor.CodeBlock icon={SourceCodeIcon} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.TaskList />
          <RichTextEditor.TaskListLift />
          <RichTextEditor.TaskListSink />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
        {/* color */}
        <RichTextEditor.ColorPicker
          colors={[
            '#25262b',
            '#868e96',
            '#fa5252',
            '#e64980',
            '#be4bdb',
            '#7950f2',
            '#4c6ef5',
            '#228be6',
            '#15aabf',
            '#12b886',
            '#40c057',
            '#82c91e',
            '#fab005',
            '#fd7e14'
          ]}
        />
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control interactive={false}>
            <IconColorPicker size="1rem" stroke={1.5} />
          </RichTextEditor.Control>
          <RichTextEditor.Color color="#F03E3E" />
          <RichTextEditor.Color color="#7048E8" />
          <RichTextEditor.Color color="#1098AD" />
          <RichTextEditor.Color color="#37B24D" />
          <RichTextEditor.Color color="#F59F00" />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.UnsetColor />
      </RichTextEditor.Toolbar>

      {editor && (
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.BulletList />
          </RichTextEditor.ControlsGroup>
        </FloatingMenu>
      )}

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
