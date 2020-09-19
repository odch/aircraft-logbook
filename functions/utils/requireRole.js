const requireRole = (member, roles) => {
  const memberRoles = member.get('roles') || []
  if (memberRoles.length > 0) {
    const hasOne = memberRoles.some(role => roles.includes(role))
    if (hasOne === true) {
      return
    }
  }
  throw new Error(
    `Member ${member.id} in organization ${
      member.ref.parent.id
    } has none of the following roles: ${roles.join(', ')}`
  )
}

module.exports = requireRole
