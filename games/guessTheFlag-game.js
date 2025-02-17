class GTF {
   
    constructor(options) {
        if(!options.token) throw new TypeError('Missing argument: token')
        if(typeof options.token !== 'string') throw new TypeError('token must be in a string')
        if(!options.stopCommand) throw new TypeError('Missing argument: stopCommand')
        if(typeof options.stopCommand !== 'string') throw new TypeError('stopCommand Must be a string')
        if(!options.message) throw new TypeError('Missing argument: message')
/*
        if (typeof options.winFooter !== 'string') throw new TypeError('embedFooter must be a string')
        if (typeof options.winColor !== 'string') throw new TypeError('embedColor must be a string')

        if (typeof options.lostFooter !== 'string') throw new TypeError('embedFooter must be a string')
        if (typeof options.lostColor !== 'string') throw new TypeError('embedColor must be a string')

        if (typeof options.questionFooter !== 'string') throw new TypeError('embedFooter must be a string')
        if (typeof options.questionColor !== 'string') throw new TypeError('embedColor must be a string')
        */
        this.message = options.message;
        this.token = options.token;
        this.winFooter = options.winFooter;
        this.winColor = options.winColor
        this.lostColor = options.lostColor;
        this.lostFooter = options.lostFooter;
        this.questionColor = options.questionColor;
        this.questionFooter = options.questionFooter;
        this.stopCommand = options.stopCommand
      
    }
    async start() {
        const fetch = require("node-fetch")
        const Discord = require('discord.js');
        fetch(`https://api.dagpi.xyz/data/flag`, {
            headers: {
                "Authorization": this.token
            }
        })
        .then(res => res.json())
        .then(data => {
          
    const que = new Discord.MessageEmbed()
    .setTitle(`Guess the Flag!`)
    .addField(`Capital:`, `${data.Data.capital}`)
    .setColor(this.questionColor || "RANDOM")
    .setImage(data.flag)
    .setFooter(this.questionFooter || "Made by GizmoLab")
    

    const right = new Discord.MessageEmbed()
    .setTitle(`You Guessed It Right!`)
    .setAuthor(this.message.author.tag)
    .setColor(this.winColor || "RANDOM")
    .setDescription(`It was ${data.Data.name.common}`)
    .setImage(data.flag)
    .setFooter(this.winFooter || "Made by GizmoLab")
   

    const wrong = new Discord.MessageEmbed()
    .setTitle(`You Lost`)
    .setColor(this.lostColor || "RANDOM")
    .setAuthor(this.message.author.tag)
    .setDescription(`It was ${data.Data.name.common}`)
    .setImage(data.flag)
    .setFooter(this.lostFooter || "Made by GizmoLab")
    

    this.message.channel.send(que)
    const gameFilter = m => m.author.id
    const gameCollector = this.message.channel.createMessageCollector(gameFilter);

    gameCollector.on('collect', async msg => {
      if(msg.author.bot) return
          const selection = msg.content;
if (selection === data.Data.name.common.toLowerCase()) {
this.message.reply(right)
gameCollector.stop()
          }else if (selection === this.stopCommand) {
            this.message.channel.send(wrong)
            gameCollector.stop();
          } else if (selection !== data.Data.name.common) {
            this.message.channel.send(`Wrong Guess Try Again! - Type ${this.stopCommand} to cancel the Game`)
          }
    })
    
})
}
}

module.exports = GTF;
