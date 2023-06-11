import { type TextField } from 'payload/types'
import deepMerge, { formatSlug } from './utils'

export interface GetSlugFieldInput {
  buildFromField: string
  overrides?: Partial<TextField>
}

export const getSlugField = (input: GetSlugFieldInput) => {
  const field = deepMerge(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(input.buildFromField)],
      },
      unique: true,
    },
    input?.overrides ?? {},
  ) satisfies TextField
  return field
}
