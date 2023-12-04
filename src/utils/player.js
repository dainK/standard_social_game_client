import { ref } from 'vue';

const player = ref(null);

// player.currScore = {
//   name: null,
//   score: -1,
//   rank: -1,
//   rankId:-1
// }

// function setRankData (rankId) {
//   player.currScore.rankId = rankId;
// }

export default {player};

// import { createPlayer } from 'vuex';

// const player = createPlayer({
//   rank: {
//     rankId : null,
//     score: null,
//   },
//   mutations: {
//     setCurrScore(rankId,score) {
//       rank.rankId = rankId;
//       rank.score = score;
//     },
//   },
// });

// export default player;