import escapeHTML from 'escape-html'
import { cn } from '~/src/lib/utils'

// This copy-and-pasted from somewhere in lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts

// DOM
export const DOM_ELEMENT_TYPE = 1
export const DOM_TEXT_TYPE = 3

// Reconciling
export const NO_DIRTY_NODES = 0
export const HAS_DIRTY_NODES = 1
export const FULL_RECONCILE = 2

// Text node modes
export const IS_NORMAL = 0
export const IS_TOKEN = 1
export const IS_SEGMENTED = 2
// IS_INERT = 3

// Text node formatting
export const IS_BOLD = 1
export const IS_ITALIC = 1 << 1
export const IS_STRIKETHROUGH = 1 << 2
export const IS_UNDERLINE = 1 << 3
export const IS_CODE = 1 << 4
export const IS_SUBSCRIPT = 1 << 5
export const IS_SUPERSCRIPT = 1 << 6
export const IS_HIGHLIGHT = 1 << 7

export const IS_ALL_FORMATTING = IS_BOLD | IS_ITALIC | IS_STRIKETHROUGH | IS_UNDERLINE | IS_CODE | IS_SUBSCRIPT | IS_SUPERSCRIPT | IS_HIGHLIGHT

export const IS_DIRECTIONLESS = 1
export const IS_UNMERGEABLE = 1 << 1

// Element node formatting
export const IS_ALIGN_LEFT = 1
export const IS_ALIGN_CENTER = 2
export const IS_ALIGN_RIGHT = 3
export const IS_ALIGN_JUSTIFY = 4
export const IS_ALIGN_START = 5
export const IS_ALIGN_END = 6

export const TEXT_TYPE_TO_FORMAT: Record<TextFormatType | string, number> = {
  bold: IS_BOLD,
  code: IS_CODE,
  italic: IS_ITALIC,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
  underline: IS_UNDERLINE,
}

export type TextFormatType = 'bold' | 'underline' | 'strikethrough' | 'italic' | 'code' | 'subscript' | 'superscript'

export type SerializedLexicalEditorState = {
  words: number
  preview: string
  comments: unknown[]
  characters: number
  jsonContent: {
    root: {
      type: string
      format: string
      indent: number
      version: number
      children: SerializedLexicalNode[]
    }
  }
}

export type SerializedLexicalNodeBase = {
  children?: SerializedLexicalNode[]
  direction: string
  format: number
  indent?: string | number
  version: number
  style?: string
  mode?: string
  text?: string
  listType?: 'bullet' | string // TODO: what are the other list types?
}

interface SerializedLexicalNodeText extends SerializedLexicalNodeBase {
  type: 'text'
}

interface SerializedLexicalNodeLink extends SerializedLexicalNodeBase {
  type: 'link'
  attributes: {
    doc?: Record<string, unknown>
    linkType?: 'custom' | 'internal'
    newTab?: boolean
    nofollow?: boolean
    rel?: string
    sponsored?: boolean
    url?: string
  }
}

interface SerializedLexicalNodeLinebreak extends SerializedLexicalNodeBase {
  type: 'linebreak'
}

interface SerializedLexicalNodeList extends SerializedLexicalNodeBase {
  type: 'list'
}

interface SerializedLexicalNodeListitem extends SerializedLexicalNodeBase {
  type: 'listitem'
}

interface SerializedLexicalNodeHeading extends SerializedLexicalNodeBase {
  type: 'heading'
  tag: string
}

type SerializedLexicalNode =
  | SerializedLexicalNodeText
  | SerializedLexicalNodeLink
  | SerializedLexicalNodeLinebreak
  | SerializedLexicalNodeList
  | SerializedLexicalNodeListitem
  | SerializedLexicalNodeHeading

function getLinkForPage(_doc: Record<string, unknown> | undefined) {
  return 'implement this'
}

function serializeToHtml(children: SerializedLexicalNode[]): string[] {
  return children
    .map((node): string | null => {
      if (node.type === 'text') {
        let text = `${escapeHTML(node.text)}`

        if (node.format & IS_BOLD) {
          text = `<strong>${text}</strong>`
        }
        if (node.format & IS_ITALIC) {
          text = `<em>${text}</em>`
        }

        if (node.format & IS_STRIKETHROUGH) {
          text = `<span class="line-through">${text}</span>`
        }

        if (node.format & IS_UNDERLINE) {
          text = `<span class="underline">${text}</span>`
        }

        if (node.format & IS_CODE) {
          text = `<code>${text}</code>`
        }

        if (node.format & IS_SUBSCRIPT) {
          text = `<sub>${text}</sub>`
        }

        if (node.format & IS_SUPERSCRIPT) {
          text = `<sup>${text}</sup>`
        }

        return `${text}`
      }

      if (!node) {
        return null
      }

      const serializedChildren = node.children ? serializeToHtml(node.children).join('') : null

      switch (node.type) {
        case 'linebreak':
          return `<br>`
        case 'link':
          const attributes = node.attributes
          if (attributes.linkType === 'custom') {
            return `<a href="${attributes.url}"${attributes.newTab ? ' target=_"blank"' : ''} rel="${attributes?.rel ?? ''}${
              attributes?.sponsored ? ' sponsored' : ''
            }${attributes?.nofollow ? ' nofollow' : ''}">${serializedChildren}</a>`
          }
          return `<a href="${getLinkForPage(attributes.doc)}"${attributes.newTab ? ' target=_"blank"' : ''} rel="${attributes?.rel ?? ''}${
            attributes?.sponsored ? ' sponsored' : ''
          }${attributes?.nofollow ? ' nofollow' : ''}">${serializedChildren}</a>` // TODO: Check doc link handling
        case 'list': //TODO handle properly, especially nested lists
          if (node.listType === 'bullet') {
            return ` 
						<ul class="list-disc mb-4 pl-8">
						  ${serializedChildren}
						</ul>`
          } else {
            return `
						<ol class="list-disc mb-4 pl-8">
						  ${serializedChildren}
						</ol>`
          }
        case 'listitem':
          return `
						<li>
						  ${serializedChildren}
						</li>`
        case 'heading':
          return `
								<${node.tag}>
								  ${serializedChildren}
								</${node.tag}>`
        default: //Probably just a normal paragraph
          return `<p>${serializedChildren ? serializedChildren : '<br>'}</p>`
      }
    })
    .filter((node) => node !== null) as string[]
}

export const LexicalRichText: React.FC<{ content: SerializedLexicalNode[]; className?: string }> = ({ content, className }) => {
  if (!content) return null
  const nodes = serializeToHtml(content)
  return <div dangerouslySetInnerHTML={{ __html: nodes.join('') }} className={cn(className, 'prose')}></div>
}
