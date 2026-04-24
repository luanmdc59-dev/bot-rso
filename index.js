const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let numeroRSO = 1;

client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "criar_rso") {
      const modal = new ModalBuilder()
        .setCustomId("modal_rso")
        .setTitle("Relatório de Serviço Operacional");

      const dadosViatura = new TextInputBuilder()
        .setCustomId("dados_viatura")
        .setLabel("Dados da Viatura")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: Unidade, P1, P2, P2 E P3")

        .setRequired(true);

      const supervisao = new TextInputBuilder()
        .setCustomId("supervisao")
        .setLabel("Supervisão do Patrulhamento")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: N/A ou descreva o patrulhamento realizado")
        .setRequired(true);

      const horario = new TextInputBuilder()
        .setCustomId("horario")
        .setLabel("Início e Término do Patrulhamento")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex:\nInício: 18/12/2025, 15:35\nTérmino: 18/12/2025, 17:15")
        .setRequired(true);

      const ilicitos = new TextInputBuilder()
        .setCustomId("ilicitos")
        .setLabel("Ilícitos Apreendidos")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: - ou descreva os ilícitos apreendidos")
        .setRequired(true);

      const estatisticas = new TextInputBuilder()
        .setCustomId("estatisticas")
        .setLabel("BOPMs e Estatísticas")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(
          "Ex:\nBOPMs: Nenhum BOPM registrado\nPresos: 0 | Óbitos: 1 | Abordados: 0"
        )
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(dadosViatura),
        new ActionRowBuilder().addComponents(supervisao),
        new ActionRowBuilder().addComponents(horario),
        new ActionRowBuilder().addComponents(ilicitos),
        new ActionRowBuilder().addComponents(estatisticas)
      );

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal_rso") {
      const dadosViatura = interaction.fields.getTextInputValue("dados_viatura");
      const supervisao = interaction.fields.getTextInputValue("supervisao");
      const horario = interaction.fields.getTextInputValue("horario");
      const ilicitos = interaction.fields.getTextInputValue("ilicitos");
      const estatisticas = interaction.fields.getTextInputValue("estatisticas");

      const codigo = String(numeroRSO).padStart(3, "0");
      numeroRSO++;

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle(`🚔 NOVO RSO PUBLICADO - RSO-${codigo}`)
        .setDescription(`Publicado por: **${interaction.user.username}**`)
        .addFields(
          {
            name: "📋 Dados da Viatura",
            value: dadosViatura || "-"
          },
          {
            name: "📊 Supervisão do Patrulhamento",
            value: supervisao || "-"
          },
          {
            name: "⏰ Início e Término do Patrulhamento",
            value: horario || "-"
          },
          {
            name: "📦 Ilícitos Apreendidos",
            value: ilicitos || "-"
          },
          {
            name: "📝 BOPMs e Estatísticas",
            value: estatisticas || "-"
          }
        )
        .setFooter({
          text: "Sistema Interno 2ºBPChoque - Anchieta •"
        })
        .setTimestamp();

      const canal = await client.channels.fetch(process.env.CANAL_RSO);

      await canal.send({
        embeds: [embed]
      });

      await interaction.reply({
        content: "RSO publicado com sucesso.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);