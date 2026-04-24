const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  const canal = await client.channels.fetch(process.env.CANAL_RSO);

  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("PAINEL DE RSO - 2º BPCHQ ANCHIETA")
    .setDescription("Ao finalizar o serviço, o oficial responsável deverá preencher e publicar o Relatório de Serviço Operacional.");

  const botao = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("criar_rso")
      .setLabel("Criar RSO")
      .setStyle(ButtonStyle.Danger)
  );

  await canal.send({
    embeds: [embed],
    components: [botao]
  });

  console.log("Painel enviado.");
  process.exit();
});

client.login(process.env.TOKEN);