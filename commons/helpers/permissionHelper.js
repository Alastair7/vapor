const RolePermissions = require('../enums/rolesPermissions')

async function validatePermissions(commandInteraction, commandName) {
    const allowedRoles = RolePermissions[commandName.toUpperCase()]

    if (!allowedRoles) {
        return true
    }

    const memberRoles = commandInteraction.member.roles.cache
    const memberRoleNames = memberRoles.map((role) => role.name)

    return allowedRoles.some((roleName) => memberRoleNames.includes(roleName))
}

module.exports = { validatePermissions }
