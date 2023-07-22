async function validatePermissions(commandInteraction, requiredRole) {

    console.log(`Required Role is ${requiredRole.id}`);
    const role = commandInteraction.member.roles.cache.find(r => r.id === requiredRole.id);
    console.log(`Role is: ${role}`);

    return role ? true : false;
} 

module.exports = { validatePermissions }
