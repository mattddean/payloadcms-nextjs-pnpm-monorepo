import { type CollectionConfig } from 'payload/types'
import { isAdmin, isLoggedIn, isLoggedInOrDocPublished } from '../access'
import { blogPageRichTextBlock } from '../blocks/blog-page-rich-text'
import { getSlugField } from '../fields/slug'

const TITLE = 'title'

export const blogPagesCollection: CollectionConfig = {
  slug: 'blog-pages',
  labels: {
    singular: 'Blog Page',
    plural: 'Blog Pages',
  },
  access: {
    create: isLoggedIn,
    read: isLoggedInOrDocPublished,
    update: isLoggedIn,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: TITLE,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main',
          fields: [
            {
              name: TITLE,
              type: 'text',
              required: true,
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [blogPageRichTextBlock],
              minRows: 1,
              required: true,
            },
          ],
        },
      ],
    },
    getSlugField({
      buildFromField: TITLE,
      overrides: {
        admin: {
          description: 'This page will live at /blogs/{{Slug}}',
        },
      },
    }),
  ],
}
