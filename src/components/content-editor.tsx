import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

const TEXT_COLORS = ['#111111', '#1a4025', '#dc2626', '#2563eb', '#7c3aed', '#f59e0b', '#059669']
const HIGHLIGHT_COLORS = ['#ffff00', '#90ee90', '#ffb6c1', '#add8e6', '#ffa500', '#ffffff']
const FONT_SIZES = [
  { label: 'P', value: '2' },
  { label: 'N', value: '3' },
  { label: 'M', value: '4' },
  { label: 'G', value: '5' },
  { label: 'XG', value: '6' },
]

export function ContentEditor({
  value,
  onChange,
  isEditing,
}: {
  value: string
  onChange: (val: string) => void
  isEditing: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [showTextColor, setShowTextColor] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.innerHTML = value || ''
    }
  }, [isEditing])

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    ref.current?.focus()
    handleInput()
  }

  const preventDefault = (e: React.MouseEvent) => e.preventDefault()

  if (!isEditing) {
    return (
      <div
        className="content-html"
        dangerouslySetInnerHTML={{ __html: value || '<p>Nenhum dado informado.</p>' }}
        style={{ fontSize: '14px', marginBottom: '25px', color: '#111' }}
      />
    )
  }

  return (
    <div className="mb-6 border-2 border-primary/30 rounded-md bg-white shadow-sm overflow-visible transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary relative">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 font-bold"
          onMouseDown={preventDefault}
          onClick={() => exec('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 italic"
          onMouseDown={preventDefault}
          onClick={() => exec('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 underline"
          onMouseDown={preventDefault}
          onClick={() => exec('underline')}
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('formatBlock', 'h1')}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('formatBlock', 'h2')}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('formatBlock', 'h3')}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {FONT_SIZES.map((size) => (
          <Button
            key={size.value}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 min-w-8 px-1 text-xs font-medium"
            onMouseDown={preventDefault}
            onClick={() => exec('fontSize', size.value)}
          >
            {size.label}
          </Button>
        ))}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={preventDefault}
            onClick={() => {
              setShowHighlight(!showHighlight)
              setShowTextColor(false)
            }}
          >
            <Highlighter className="w-4 h-4" />
          </Button>
          {showHighlight && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowHighlight(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-md shadow-lg p-2 flex gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={preventDefault}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      exec('hiliteColor', color)
                      setShowHighlight(false)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={preventDefault}
            onClick={() => {
              setShowTextColor(!showTextColor)
              setShowHighlight(false)
            }}
          >
            <Palette className="w-4 h-4" />
          </Button>
          {showTextColor && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTextColor(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-md shadow-lg p-2 flex gap-1">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={preventDefault}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      exec('foreColor', color)
                      setShowTextColor(false)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('justifyLeft')}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('justifyCenter')}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onMouseDown={preventDefault}
          onClick={() => exec('justifyRight')}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onMouseDown={preventDefault}
          onClick={() => exec('insertUnorderedList')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onMouseDown={preventDefault}
          onClick={() => exec('insertOrderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className="content-html min-h-[200px] p-5 focus:outline-none bg-white"
        style={{ fontSize: '14px', color: '#111' }}
      />
    </div>
  )
}
