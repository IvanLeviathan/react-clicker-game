import { getRandomInt } from './common'

export default function getrandomMonsterImage() {
  const randomInt = getRandomInt(1, 12)
  const monsterImage = require(`../assets/images/monsters/${randomInt}.svg`)
  return monsterImage
}
