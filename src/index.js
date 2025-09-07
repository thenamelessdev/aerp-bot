// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, REST, Routes, Status } = require('discord.js');
const { token, shapesToken } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent] });

// variables

// punishment logging channel ID
const punishlogid = "1411671957937848361";

// high rank role id
const hrid = "1411678103033610301";

// server join code and link
const joincode = "tkc45ps2";
const joinlink = "https://www.roblox.com/games/start?placeId=7711635737&launchData=joinCode%3Dtkc45ps2";

// shapes channel and shape
const shapechannelid = "1413448834138243112";
const shape = "beans-cc8v";


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

    client.user.setPresence({
        activities: [{ name: `Join code: ${joincode}`, type: 0 }],
        status: "online",
    })
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
        const embed = new EmbedBuilder()
            .setTitle("Punishment")
            .setDescription("Punishment: ${punishmentType} \nReason: ${reason} \nPunishing HR: <@${interaction.member.id}>")
            .setFooter("Sent from AERP")
        const actionRow = new ActionRowBuilder()
            .addComponents(embed)

        if (interaction.member.roles.cache.has(hrid)) {
            try {
                await target.send({ components: [actionRow] });
            } catch (err) {
                // User may have DMs closed
            }
            // Fetch the channel each time since fetch returns a Promise
            const punishlogging = await client.channels.fetch(punishlogid);
            await punishlogging.send(`Target: ${target} \nPunishment: ${punishmentType} \nReason: ${reason} \nPunishing HR: <@${interaction.member.id}>`);
            await interaction.reply("Punished user");
        } else {
            await interaction.reply({ content: "You don't have permissions to run this command.", ephemeral: true });
        }
		console.log("Punish command used");
    }
});


// events

// talk to beans
client.on(Events.MessageCreate, async (message) => {
    if (message.channel.id == shapechannelid) {
        const response = await fetch("https://api.shapes.inc/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${shapesToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: `shapesinc/${shape}`,
            messages: [{ role: "user", content: message.content }]
        })
        });

        const data = await response.json();

        const reply = data.response.choices[0].message.content;
        message.reply(reply);
    }
})

// Log in to Discord with your client's token
client.login(token);