import type { AccessArgs } from 'payload/config'
import { type Access, type FieldAccess } from 'payload/types'
import { type User } from './payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user?.roles.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}

export const adminsAndUser: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    return {
      id: user.id,
    }
  }

  return false
}

type isAdmin = (args: AccessArgs<any, User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

export const anyone: Access = () => true

export const isAdmin: Access<any, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}

export const isLoggedIn: Access<any, User> = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user)
}

export const isLoggedInOrDocPublished: Access<any, User> = (args) => {
  // TODO: once we set up some sort of authentication into the preview site, we can add this code back
  // but for now, unauthenticated users can view drafts.
  // // If there is a user logged in, let them retrieve all documents
  // if (isLoggedIn(args)) return true

  // // If there is no user, restrict the documents that are returned
  // // to only those where `_status` is equal to `published`.
  // // This is a query constraint.
  // return {
  //   _status: {
  //     equals: 'published',
  //   },
  // }
  return true
}
