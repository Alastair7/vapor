async function validatePermissions(commandInteraction, requiredRoles) {
    const role = commandInteraction.member.roles.cache.find(r => r.name === requiredRoles);

    if (!role) {
        commandInteraction.reply("You don't have the permission to execute this command.");
    }
} 
