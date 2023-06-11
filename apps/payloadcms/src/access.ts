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
