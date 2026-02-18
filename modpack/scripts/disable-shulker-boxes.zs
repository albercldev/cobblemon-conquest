println("Disabling shulker box crafting recipes...");

craftingTable.removeByRegex("minecraft:shulker_box.*");
craftingTable.removeByRegex("sophisticatedstorage:.*shulker.*");

println("Disabled shulker box crafting recipe");