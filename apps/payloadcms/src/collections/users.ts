import type { AfterChangeHook } from 'payload/dist/collections/config/types'
import type { CollectionConfig, FieldHook } from 'payload/types'
import { admins, adminsAndUser, anyone, checkRole } from '../access'
import type { User } from '../payload-types'

// ensure the first user created is an admin
// 1. lookup a single user on create as succinctly as possible
// 2. if there are no users found, append `admin` to the roles array
// access control is already handled by this fields `access` property
// it ensures that only admins can create and update the `roles` field
export const ensureFirstUserIsAdmin: FieldHook<User> = async ({ req, operation, value }) => {
  if (operation === 'create') {
    const users = await req.payload.find({ collection: 'users', limit: 0, depth: 0 })
    if (users.totalDocs === 0) {
      // if `admin` not in array of values, add it
      if (!(value || []).includes('admin')) {
        return [...(value || []), 'admin']
      }
    }
  }

  return value
}

export const loginAfterCreate: AfterChangeHook<User> = async ({ doc, req, req: { payload, body = {}, res }, operation }) => {
  if (operation === 'create' && !req.user) {
    const { email, password } = body as { email: string | undefined; password: string | undefined }

    if (email && password) {
      const { user, token } = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
        res,
      })

      return {
        ...doc,
        token,
        user,
      }
    }
  }

  return doc
}

const UserFields: CollectionConfig['fields'] = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'roles',
    type: 'select',
    hasMany: true,
    defaultValue: ['customer'],
    options: [
      {
        label: 'admin',
        value: 'admin',
      },
      {
        label: 'customer',
        value: 'customer',
      },
    ],
    hooks: {
      beforeChange: [ensureFirstUserIsAdmin],
    },
    access: {
      read: admins,
      create: admins,
      update: admins,
    },
  },
  {
    name: 'skipSync',
    label: 'Skip Sync',
    type: 'checkbox',
    admin: {
      position: 'sidebar',
      readOnly: true,
      hidden: true,
    },
  },
]

export const usersCollection: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  auth: true,
  fields: UserFields,
  timestamps: true,
}
