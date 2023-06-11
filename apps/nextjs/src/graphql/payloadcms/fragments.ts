import { type SerializedLexicalEditorState } from '~/src/components/lexical-rich-text'
import { type BlogPageRichText } from '~/src/graphql/payloadcms/generated-gqty'

export const blogPageRichTextFragment = (cmsRichTextBlogPage: BlogPageRichText) => {
  const lexicalRichText = cmsRichTextBlogPage.lexicalRichText() as SerializedLexicalEditorState | undefined
  return {
    id: cmsRichTextBlogPage.id,
    richText: lexicalRichText?.jsonContent.root.children,
  }
}
export type RichTextBlogPageWrappedFragment = ReturnType<typeof blogPageRichTextFragment>
