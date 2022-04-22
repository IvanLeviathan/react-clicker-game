import React, { useEffect, useState } from 'react'
import { getRandomInt } from '../../utils/common'
import './style.css'
import bang from '../../assets/images/bang.png'

export default function Clicker(props) {
  const [monsterClass, setMonsterClass] = useState('monster')
  const [hitLeft, setHitLeft] = useState('0%')
  const [hitTop, setHitTop] = useState('0%')
  const calcHpPercentage = (cur, all) => {
    const percent = (cur / all) * 100
    return `${percent}%`
  }

  useEffect(() => {
    setMonsterClass('monster hit')
    const left = getRandomInt(20, 80)
    setHitLeft(`${left}%`)
    const top = getRandomInt(20, 80)
    setHitTop(`${top}%`)
    setTimeout(() => {
      setMonsterClass('monster')
    }, 500)
  }, [props.monsterCurHealth])

  return (
    <div className="container clicker-game py-4">
      <div className="row">
        <div className="col-12 col-lg-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>$: {props.money.toFixed(2)}</div>
            <div>DPS: {props.dps.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-lg-6 order-lg-1 order-2">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Level</th>
                <th scope="col">Cost</th>
                <th scope="col">Cur</th>
                <th scope="col">Next</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.list.map((listItem) => {
                return (
                  <tr key={listItem.id}>
                    <td>{listItem.name}</td>
                    <td>{listItem.level}</td>
                    <td>{props.sumForUpgrade(listItem)} $</td>
                    <td>{props.dpsCount(listItem)} DPS</td>
                    <td>{props.dpsCount(listItem, listItem.level + 1)} DPS</td>
                    <td>
                      <button
                        className={
                          listItem.canUpgrade
                            ? 'btn btn-success'
                            : 'btn btn-danger'
                        }
                        disabled={!listItem.canUpgrade}
                        onClick={() => props.upgradeLevel(listItem.id)}
                      >
                        Upgrade
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* MONSTER */}
        <div className="col-12 col-lg-6 order-lg-2 order-1">
          <div>Wave {props.wave}</div>
          <div>Time remain: {props.remainTime}</div>
          <div>
            {' '}
            <label htmlFor="auto-wave">
              Auto-play:
              <input
                type="checkbox"
                id="auto-wave"
                value={true}
                checked={props.autoWave}
                onChange={props.onChangeAutowave}
              />
            </label>
          </div>
          <div className="health-bar">
            <div
              className="inner"
              style={{
                width: calcHpPercentage(
                  props.monsterCurHealth,
                  props.monsterFullHealth,
                ),
              }}
            ></div>
            <div className="text">
              {props.monsterCurHealth}/{props.monsterFullHealth} HP
            </div>
          </div>
          <div className={monsterClass} onClick={props.onMonsterClick}>
            <div className="monster-name">{props.monsterName}</div>
            <div
              className="hit"
              style={{
                left: hitLeft,
                top: hitTop,
              }}
            >
              <img src={bang} alt="" />
              {props.dps.toFixed(2)}
            </div>
            {props.monsterImage && (
              <div>
                <img src={props.monsterImage} alt={props.monsterName}></img>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
