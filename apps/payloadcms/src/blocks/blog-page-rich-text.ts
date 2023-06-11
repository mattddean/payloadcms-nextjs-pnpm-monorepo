import { type Block } from 'payload/types'
import { buildLexicalRichTextField } from '../fields/lexical-rich-text'

export const blogPageRichTextBlock: Block = {
  slug: 'blogPageRichText',
  fields: [buildLexicalRichTextField()],
}
