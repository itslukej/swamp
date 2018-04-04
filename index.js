const Eris = require('eris');
const config = require('./config.json');

const client = new Eris(config.token);

function isManagedRoom(channel) {
  return channel.name.startsWith('Private Room ');
}

client.on('ready', () => {
  console.log('Ready');
});

client.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
  client.emit('voiceChannelJoin', member, newChannel);
  client.emit('voiceChannelLeave', member, oldChannel);
});

client.on('voiceChannelJoin', (member, channel) => {
  if(!isManagedRoom(channel)) return;
  if(!member.bot) return;

  console.log('Bot joined', channel.name);
  channel.edit({ userLimit: channel.userLimit + 1 }, 'Private Room Management');
});

client.on('voiceChannelLeave', (member, channel) => {
  if(!isManagedRoom(channel)) return;
  if(!member.bot) return;

  console.log('Bot left', channel.name);
  channel.edit({ userLimit: channel.userLimit - 1 }, 'Private Room Management');
});

console.log('Starting up');
client.connect();