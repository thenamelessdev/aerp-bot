// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, REST, Routes, Status, ContextMenuCommandBuilder, ModalBuilder, ApplicationCommandType } = require('discord.js');
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

// msg and member report channel id
const msgReportChannelID = "1414180142921809950";
const memberReportChannelID = "1413515559672348792";

// welcome channel id
const welcomeChannelID = "1411672142445150271";


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
        ),
    new SlashCommandBuilder()
        .setName("talk-to-beans")
        .setDescription("You can talk to beans using this command")
        .addStringOption(option =>
            option
            .setName("message")
            .setDescription("The message that you want to send to beans")
            .setRequired(true)
        ),
    new ContextMenuCommandBuilder()
        .setName("Report Message")
        .setType(3),
    new ContextMenuCommandBuilder()
        .setName("Report Member")
        .setType(2)
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
            .setDescription(`Punishment: ${punishmentType} \nReason: ${reason} \nPunishing HR: <@${interaction.member.id}>`)

        if (interaction.member.roles.cache.has(hrid)) {
            try {
                await target.send({ embeds: [embed] });
            } catch (err) {
                // User may have DMs closed
            }
            // Fetch the channel each time since fetch returns a Promise
            const punishlogging = await client.channels.fetch(punishlogid);
            await punishlogging.send(
                `Target: <@${target.id}> \nPunishment: ${punishmentType}\nReason: ${reason}\nPunishing HR: <@${interaction.member.id}>`
            );
            await interaction.reply({ content: "Punished user.", MessageFlags: [MessageFlags.Ephemeral] });
        } else {
            await interaction.reply({ content: "You don't have permissions to run this command.", MessageFlags: [MessageFlags.Ephemeral] });
        }
		console.log("Punish command used");
    }
});


// talk to beans
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.commandName == "talk-to-beans") {
        const msgToBeans = interaction.options.getString("message")
        await console.log("Beans used");
        const response = await fetch("https://api.shapes.inc/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${shapesToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: `shapesinc/${shape}`,
            messages: [{ role: "user", content: msgToBeans }]
        })
        });

        const data = await response.json();

        const reply = data.choices[0].message.content;
        await interaction.reply(reply);
        console.log("Beans replyed: " + reply);

    }
})


// report member and message
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.commandName == "Report Message") {
        const msgReportChannel = await client.channels.fetch(msgReportChannelID);
        await msgReportChannel.send(`**Message report** \nMessage: ${interaction.targetMessage.url} \nMessage content: ${interaction.targetMessage.content} \nAuthor: <@${interaction.targetMessage.author.id}> \nReporter: <@${interaction.user.id}>`);
        await interaction.reply({ content: "Message reported!", MessageFlags: [MessageFlags.Ephemeral] });
    }
})
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.commandName == "Report Member") {
        const memberReportChannel = await client.channels.fetch(memberReportChannelID);
        await memberReportChannel.send(`**Member report** \nReported member: <@${interaction.targetMember.id}> \nReporter: <@${interaction.user.id}>`);
        await interaction.reply({ content: "Member reported.", MessageFlags: [MessageFlags.Ephemeral] });
    }
})



// events

// welcome message
client.on(Events.GuildMemberAdd, async (member) => {
    const welcomeChannel = await client.channels.fetch(welcomeChannelID);
    await welcomeChannel.send(`Welcome <@${member.user.id}> to ${member.guild.name}!`);
})


// Log in to Discord with your client's token
client.login(token);