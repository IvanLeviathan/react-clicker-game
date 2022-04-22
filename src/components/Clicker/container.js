import React, { useEffect, useState } from 'react'
import Clicker from '.'
import useInterval from '../../hooks/useInterval'
import generateName from '../../utils/generateName'
import getrandomMonsterImage from '../../utils/getrandomMonsterImage'

export default function ClickerContainer() {
  const [money, setMoney] = useState(0)
  const [wave, setWave] = useState(1)
  const [monsterCurHealth, setMonsterCurHealth] = useState(null)
  const [remainTime, setRemainTime] = useState(1)
  const [autoWave, setAutoWave] = useState(true)
  const [monsterName, setMonsterName] = useState('')
  const [monsterImage, setMonsterImage] = useState('')

  const monster = {
    baseHealth: 100,
    healthModififer: 1.25,
  }

  const waveOptions = {
    baseReward: 5,
    reweardModififer: 1.1,
    roundTime: 30,
  }

  const listStart = [
    {
      id: 1,
      name: 'Catgirl Helper',
      level: 0,
      cost: 5,
      levelUpCost: 2,
      dps: 10,
      dpsOnUpgrade: 5,
      canUpgrade: false,
      onTimer: true,
    },
    {
      id: 2,
      name: 'Catgirl Apprentice',
      level: 0,
      cost: 100,
      levelUpCost: 50,
      dps: 50,
      dpsOnUpgrade: 10,
      canUpgrade: false,
      onTimer: true,
    },
    {
      id: 3,
      name: 'Catgirl 3',
      level: 0,
      cost: 500,
      levelUpCost: 150,
      dps: 100,
      dpsOnUpgrade: 20,
      canUpgrade: false,
      onTimer: true,
    },
  ]

  const [dpsers, setDpsers] = useState(listStart)

  // calcs
  const sumForUpgrade = (listItem) => {
    return listItem.cost + listItem.level * listItem.levelUpCost
  }

  const dpsCount = (listItem, toLevel = false) => {
    const level = !!toLevel ? toLevel : listItem.level
    if (level === 0) return 0
    if (level === 1) return listItem.dps
    return listItem.dps + level * listItem.dpsOnUpgrade - listItem.dpsOnUpgrade
  }

  //check when clicks is changed
  const checkUpgrade = () => {
    const newList = dpsers.map((listItem) => {
      const upgradeCost = sumForUpgrade(listItem)
      listItem.canUpgrade = money >= upgradeCost
      return listItem
    })
    setDpsers(newList)
  }
  useEffect(() => {
    checkUpgrade()
  }, [money])

  const upgradeLevel = (id) => {
    const listItem = dpsers.find((listItem) => listItem.id === id)
    const upgradeCost = sumForUpgrade(listItem)
    if (money >= upgradeCost) listItem.level += 1
    else return

    const newList = dpsers.map((item) =>
      item.id !== listItem.id ? item : listItem,
    )
    setDpsers(newList)
    setMoney(money - upgradeCost)
  }

  const onChangeAutowave = (e) => {
    setAutoWave(e.target.checked)
  }

  // ticks
  const calcMonsterFullHealth = (waveNum = false) => {
    return wave * monster.baseHealth * monster.healthModififer
  }
  const calcRewardForWave = () => {
    return (waveOptions.baseReward * wave) / waveOptions.reweardModififer
  }
  const onMonsterClick = () => {
    setMonsterCurHealth(monsterCurHealth - 10)
  }

  const calcAllDps = () => {
    let allDps = 0
    const newList = dpsers.filter(
      (listItem) => listItem.level > 0 && listItem.onTimer,
    )
    newList.forEach((listItem) => {
      const count = dpsCount(listItem)
      allDps += count
    })
    return allDps
  }

  const calcDPSforTick = () => {
    let allDps = calcAllDps()
    if (allDps > 0) {
      setMonsterCurHealth(monsterCurHealth - allDps)
    }
  }

  useInterval(() => {
    calcDPSforTick()
    setRemainTime(remainTime - 1)
  }, 1000)

  useEffect(() => {
    if (monsterCurHealth === null) return
    if (monsterCurHealth <= 0) {
      setMoney(money + calcRewardForWave())
      if (autoWave) {
        setWave(wave + 1)
      } else {
        setMonsterCurHealth(calcMonsterFullHealth())
        setRemainTime(waveOptions.roundTime)
      }
    }
  }, [monsterCurHealth])

  useEffect(() => {
    if (remainTime <= 0) {
      setWave(wave - 1 > 0 ? wave - 1 : 1)
      setAutoWave(false)
    }
  }, [remainTime])

  useEffect(() => {
    setMonsterCurHealth(calcMonsterFullHealth())
    setRemainTime(waveOptions.roundTime)
    setMonsterName(generateName())
    setMonsterImage(getrandomMonsterImage())
  }, [wave])

  return (
    <Clicker
      money={money}
      list={dpsers}
      upgradeLevel={upgradeLevel}
      sumForUpgrade={sumForUpgrade}
      dpsCount={dpsCount}
      wave={wave}
      onMonsterClick={onMonsterClick}
      monsterFullHealth={calcMonsterFullHealth()}
      monsterCurHealth={monsterCurHealth}
      dps={calcAllDps()}
      remainTime={remainTime}
      autoWave={autoWave}
      onChangeAutowave={onChangeAutowave}
      monsterName={monsterName}
      monsterImage={monsterImage}
    />
  )
}
