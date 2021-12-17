require('dotenv').config();
const axios = require('axios');
const config = require('./config.json');

function checkAlexRank(guild) {
  const url = `https://eun1.api.riotgames.com/tft/league/v1/entries/by-summoner/${config.SummonerID}`;
  axios
    .get(url, { headers: { 'X-Riot-Token': process.env.LOL_API } })
    .then((res) => {
      const data = res.data[0];

      const mapName = {
        MASTER: 'Masterbator 😩',
        GRANDMASTER: 'Granny Master 👵',
        CHALLENGER: 'CHALLANGED 👑'
      };
      let roleName = mapName[data['tier']] ? mapName[data['tier']] : 'Biggus Dickus';

      let roleColor;
      const mapShades = [
        [29, 2, 0],
        [52, 28, 2],
        [65, 25, 0],
        [127, 81, 18],
        [122, 89, 1],
        [173, 144, 13]
      ];
      const colorID = Math.min(
        Math.floor(data['leaguePoints'] / (600 / mapShades.length)),
        mapShades.length - 1
      );

      if (data['tier'] === 'CHALLENGER') {
        roleColor = [255, 215, 0];
      } else if (['MASTER', 'GRANDMASTER'].includes(data['tier'])) {
        roleColor = mapShades[colorID];
      } else {
        roleColor = [29, 2, 0];
      }

      guild.roles
        .edit(config.roleID, {
          name: roleName,
          color: roleColor
        })
        .then((res) => {
          console.log('Role successfully set.');
        })
        .catch((err) => {
          console.log('Role setting failed.');
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { checkAlexRank };
