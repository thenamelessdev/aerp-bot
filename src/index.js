// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, REST, Routes, Status } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent] });

// variables

// high rank role id
const hrid = "1411678103033610301";

// server join code and link
const joincode = "tkc45ps2";
const joinlink = "https://www.roblox.com/games/start?placeId=7711635737&launchData=joinCode%3Dtkc45ps2";


// commands
const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("A ping command"),
    new SlashCommandBuilder()
        .setName("punish")
        .setDescription("Punishes a user")
        .addUserOption(option =>
            option
            .setName("target")
            .setDescription("The person you want to punish")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("punishment-type")
            .setDescription("The punishment that you want to give")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("reason")
            .setDescription("The reason of the punishemnt")
            .setRequired(true)
        )
]

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const rest = new REST({ version: "10" }).setToken(token);
    try {
        console.log("Registering commands...");
        await rest.put(
            Routes.applicationCommands(readyClient.user.id), // Use applicationCommands for global commands
            { body: commands.map(cmd => cmd.toJSON()) }
        );
        console.log("Commands registered.");
    } catch (error) {
        console.error("There was an error registering commands:", error);
    }
});

// commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
        console.log("Ping command used.");
    }

    if (interaction.commandName === "punish") {
        const target = interaction.options.getUser("target");
        const punishmentType = interaction.options.getString("punishment-type");
        const reason = interaction.options.getString("reason");

        if (interaction.member.roles.cache.has(hrid)) {
            try {
                await target.send(`You got punished: Punishment: ${punishmentType}, Reason: ${reason}, Punishing HR: <@${interaction.member.id}>`);
            } catch (err) {
                // User may have DMs closed
            }
            // Fetch the channel each time since fetch returns a Promise
            const punishlogging = await client.channels.fetch("1411671957937848361");
            await punishlogging.send(`Target: ${target} \nPunishment: ${punishmentType} \nReason: ${reason} \nPunishing HR: <@${interaction.member.id}>`);
            await interaction.reply("Punished user");
        } else {
            await interaction.reply({ content: "You don't have permissions to run this command.", ephemeral: true });
        }
		console.log("Punish command used")
    }
});


// events


// Log in to Discord with your client's token
client.login(token);