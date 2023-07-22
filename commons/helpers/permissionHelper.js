async function validatePermissions(commandInteraction, requiredRole) {
    const role = commandInteraction.member.roles.cache.find(
        (r) => r.id === requiredRole.id
    )

    return !!role
}

module.exports = { validatePermissions }
