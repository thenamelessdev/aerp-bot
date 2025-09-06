// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent] });

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("A ping command"),
]

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// ping command reply
client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.commandName == "ping") {
		interaction.reply("Pong!")
		console.log("Ping command used.")
	}
})


// Log in to Discord with your client's token
client.login(token);