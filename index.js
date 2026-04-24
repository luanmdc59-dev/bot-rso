const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let numeroRSO = 1;

// REGISTRAR COMANDO /painel
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Envia o painel de RSO no canal atual")
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function registrarComandos() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Comando /painel registrado.");
  } catch (error) {
    console.error("Erro ao registrar comando:", error);
  }
}

client.once("ready", async () => {
  console.log(`Bot online como ${client.user.tag}`);
  await registrarComandos();
});

client.on("interactionCreate", async (interaction) => {

  // COMANDO /painel
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "painel") {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("PAINEL DE RSO - 2º BPCHQ ANCHIETA")
        .setDescription(
          "Ao finalizar o serviço, o oficial responsável deverá preencher e publicar o Relatório de Serviço Operacional."
        );

      const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("criar_rso")
          .setLabel("Criar RSO")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.reply({
        embeds: [embed],
        components: [botao]
      });
    }
  }

  // BOTÃO CRIAR RSO
  if (interaction.isButton()) {
    if (interaction.customId === "criar_rso") {
      const modal = new ModalBuilder()
        .setCustomId("modal_rso")
        .setTitle("Relatório de Serviço Operacional");

      const dadosViatura = new TextInputBuilder()
        .setCustomId("dados_viatura")
        .setLabel("Dados da Viatura")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Unidade, encarregado, motorista e terceiro homem")
        .setRequired(true);

      const supervisao = new TextInputBuilder()
        .setCustomId("supervisao")
        .setLabel("Supervisão do Patrulhamento")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: N/A ou resumo do patrulhamento")
        .setRequired(true);

      const horario = new TextInputBuilder()
        .setCustomId("horario")
        .setLabel("Início e Término do Patrulhamento")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: Início: 20:00 | Término: 23:00")
        .setRequired(true);

      const ilicitos = new TextInputBuilder()
        .setCustomId("ilicitos")
        .setLabel("Ilícitos Apreendidos")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Ex: - ou itens apreendidos")
        .setRequired(true);

      const estatisticas = new TextInputBuilder()
        .setCustomId("estatisticas")
        .setLabel("BOPMs e Estatísticas")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("BOPMs, presos, óbitos e abordados")
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

  // ENVIO DO RSO
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
            value: (dadosViatura || "-").slice(0, 1024)
          },
          {
            name: "📊 Supervisão do Patrulhamento",
            value: (supervisao || "-").slice(0, 1024)
          },
          {
            name: "⏰ Início e Término do Patrulhamento",
            value: (horario || "-").slice(0, 1024)
          },
          {
            name: "📦 Ilícitos Apreendidos",
            value: (ilicitos || "-").slice(0, 1024)
          },
          {
            name: "📝 BOPMs e Estatísticas",
            value: (estatisticas || "-").slice(0, 1024)
          }
        )
        .setFooter({
          text: "Sistema Interno 2ºBPChoque - Anchieta •"
        })
        .setTimestamp();

      await interaction.channel.send({
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
