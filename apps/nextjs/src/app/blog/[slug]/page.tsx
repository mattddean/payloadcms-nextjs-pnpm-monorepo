import type { NextPage } from 'next'
import { notFound } from 'next/navigation'
import { payloadResolve } from '~/src/graphql/payloadcms/generated-gqty'
import { LexicalRichText } from '../../../components/lexical-rich-text'
import { blogPageRichTextFragment } from '../../../graphql/payloadcms/fragments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

function fetchPage(slug: string) {
  // gqty uses js proxies to generate a graphql request for the fields accessed. This means that we need to directly access each field
  // that we want present in the generated query.
  return payloadResolve(({ query }) => {
    return {
      blogPageDocs: query.BlogPages({ where: { slug: { equals: slug } } })?.docs?.map((doc) => {
        return doc
          ? {
              __typename: doc.__typename,
              title: doc.title,
              blocks: doc.blocks.map((block) => {
                const cmsRichTextBlogPage = block.$on.BlogPageRichText
                if (cmsRichTextBlogPage) return blogPageRichTextFragment(cmsRichTextBlogPage)
              }),
            }
          : undefined
      }),
    }
  })
}

type Params = { slug?: string }

/* @ts-expect-error Async Server Component */
const Page: NextPage<{ params?: Params }> = async (props) => {
  if (!props.params?.slug) notFound()

  const pageResult = await fetchPage(props.params.slug)
  const page = pageResult.blogPageDocs?.[0]?.__typename !== undefined ? pageResult.blogPageDocs?.[0] : undefined

  if (!page) notFound()

  return (
    <>
      <div className='h-12'></div>
      <div>
        {page.blocks &&
          page.blocks.map((block, i) => {
            let Block
            if (block?.richText) {
              Block = (
                <div className='flex justify-center'>
                  <LexicalRichText content={block.richText} />
                </div>
              )
            }
            if (!Block) return null
            return <section key={i}>{Block}</section>
          })}
      </div>
    </>
  )
}

export default Page
