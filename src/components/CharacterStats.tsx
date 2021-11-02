import { css } from "@emotion/react";
import { useMediaQuery, useTheme, Theme, ButtonGroup, Button, Input, SliderUnstyled } from "@mui/material";
import {
  ArtsResistanceIcon,
  AttackPowerIcon,
  AttackSpeedIcon,
  BlockIcon,
  DPCostIcon,
  DefenseIcon,
  EliteZeroIcon,
  EliteOneIcon,
  EliteTwoIcon,
  HealthIcon,
  RedeployTimeIcon,
} from "./icons/operatorStats";
import CharacterRange from "./CharacterRange";
import { CharacterObject } from "../utils/types";
import { highestCharacterStats } from "../utils/globals";
import { summonImage } from "../utils/images";
import React, { useState } from "react";
import CustomCheckbox from "./CustomCheckbox";

const SUMMON_ICON_SIZE = 60;

export interface CharacterStatsProps {
  characterObject: CharacterObject;
}

let lastOpLevel: number;

const CharacterStats: React.VFC<CharacterStatsProps> = ({
  characterObject,
}) => {
  const {
    artsResistance,
    attackPower,
    attacksPerSecond,
    blockCount,
    defense,
    dpCost,
    health,
    rangeObject,
    redeployTimeInSeconds,
  } = highestCharacterStats(characterObject);
  const { id, name, profession } = characterObject;
  const isSummon = profession === "TOKEN";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));

  const phases = characterObject.phases;
  const maxElite = phases.length - 1;
  const maxLevel = phases[phases.length - 1].maxLevel;

  const trustBonus = (isSummon) ? null : characterObject.favorKeyFrames[characterObject.favorKeyFrames.length - 1].data;

  const [statsState, setState] = useState({
    eliteLevel: maxElite,
    opLevel: maxLevel,
    trustBonus: true
  });
  const setEliteLevel = (level: number) => {
    setState({
      eliteLevel: level,
      opLevel: Math.min(statsState.opLevel, phases[level].maxLevel),
      trustBonus: statsState.trustBonus
    });
  }

  const setOpLevel = (level: number) => {
    setState({
      eliteLevel: statsState.eliteLevel,
      opLevel: level,
      trustBonus: statsState.trustBonus
    })
    lastOpLevel = level;
  }

  const setTrustBonus = (trust: boolean) => {
    setState({
      eliteLevel: statsState.eliteLevel,
      opLevel: statsState.opLevel,
      trustBonus: trust
    });
  };

  return (
    <section css={styles}>
      <h3 className="visually-hidden">
        {`${isSummon ? "Summon" : "Operator"} Stats`}
      </h3>
      <div className="stats-controls">
        <div className="trust-and-elite-buttons">
          <ButtonGroup variant="text" className="elite-buttons">
            <Button
              className={statsState.eliteLevel === 0 ? "active" : "inactive"}
              onClick={() => {setEliteLevel(0)}}
            >
              <EliteZeroIcon className="elite-zero"/>
            </Button>
            <Button
              className={statsState.eliteLevel === 1 ? "active" : "inactive"}
              onClick={() => {setEliteLevel(1)}}
            >
              <EliteOneIcon/>
            </Button>
            <Button
              className={statsState.eliteLevel === 2 ? "active" : "inactive"}
              onClick={() => {setEliteLevel(2)}}
            >
              <EliteTwoIcon/>
            </Button>
          </ButtonGroup>
          <div className="mobile-spacer"/>
          {!isSummon && <CustomCheckbox
            label="Trust"
            checked={statsState.trustBonus}
            onChange={(event) => {
              setTrustBonus(event.target.checked);
            }}
          />}
        </div>
        <div className="spacer"/>
        <div className="level-slider-container">
          <p>Level</p>
          <Input
            className="level-slider-input"
            value={statsState.opLevel}
            onChange={(event) => {
              if(event.target.value === '') {
                setOpLevel(1);
              }
              else if(!/^\d{1,2}$/.test(event.target.value)) {
                if(lastOpLevel) {
                  setOpLevel(lastOpLevel);
                } else {
                  setOpLevel(phases[statsState.eliteLevel].maxLevel);
                }
              } else {
                setOpLevel(Number(event.target.value));
              }
            }}
            inputProps={{
              maxLength: 2,
              onFocus: (event) => event.target.select()
            }}
          />
          <div className="level-slider-border">
            <SliderUnstyled
              className="level-slider"
              value={statsState.opLevel}
              onChange={(event: Event) => setOpLevel(Number(event.target.value))} // ts doesn't like this :(
              min={1}
              max={phases[statsState.eliteLevel].maxLevel}
            />
          </div>
        </div>
      </div>
      <dl className={isSummon ? "summon-stats" : "operator-stats"}>
        {isSummon && (
          <div className="summon-icon">
            <img
              src={summonImage(id)}
              alt={name}
              width={SUMMON_ICON_SIZE}
              height={SUMMON_ICON_SIZE}
            />
          </div>
        )}

        <div className="health">
          <dt>
            <HealthIcon aria-hidden="true" /> {isMobile ? "HP" : "Health"}
          </dt>
          <dd>{health}</dd>
        </div>

        <div className="attack-power">
          <dt>
            <AttackPowerIcon aria-hidden="true" />{" "}
            {isMobile ? "ATK" : "Attack Power"}
          </dt>
          <dd>{attackPower}</dd>
        </div>

        <div className="defense">
          <dt>
            <DefenseIcon aria-hidden="true" /> {isMobile ? "DEF" : "Defense"}
          </dt>
          <dd>{defense}</dd>
        </div>

        <div className="attack-speed">
          <dt>
            <AttackSpeedIcon aria-hidden="true" />{" "}
            {isMobile ? "ASPD" : "Attack Speed"}
          </dt>
          <dd>{attacksPerSecond} sec</dd>
        </div>

        <div className="arts-resistance">
          <dt>
            <ArtsResistanceIcon aria-hidden="true" />{" "}
            {isMobile ? "RES" : "Arts Resistance"}
          </dt>
          <dd>{artsResistance}%</dd>
        </div>

        <div className="block">
          <dt>
            <BlockIcon aria-hidden="true" /> Block
          </dt>
          <dd>{blockCount}</dd>
        </div>

        <div className="redeploy-time">
          <dt>
            <RedeployTimeIcon aria-hidden="true" />{" "}
            {isMobile ? "Redeploy" : "Redeploy Time"}
          </dt>
          <dd>{redeployTimeInSeconds} sec</dd>
        </div>

        <div className="dp-cost">
          <dt>
            <DPCostIcon aria-hidden="true" /> DP Cost
          </dt>
          <dd>{dpCost}</dd>
        </div>

        <div className="range">
          <dt className={isMobile ? "visually-hidden" : ""}>Range</dt>
          <dd>
            <CharacterRange rangeObject={rangeObject} />
          </dd>
        </div>
      </dl>
    </section>
  );
};
export default CharacterStats;

const styles = (theme: Theme) => css`
  .stats-controls {
    display: flex;
    flex-direction: row;
    height: ${theme.spacing(8)};
    background: ${theme.palette.midtone.main};
    margin-top: ${theme.spacing(3)};

    ${theme.breakpoints.down("mobile")} {
      flex-direction: column-reverse;
      margin-top: ${theme.spacing(9)};
    }

    .trust-and-elite-buttons {
      display: flex;
      height: ${theme.spacing(8)};
      background: ${theme.palette.midtone.main};
      
      .elite-buttons {
        height: ${theme.spacing(8)};
        button {
          padding: ${theme.spacing(0, 2)};
          border: none;
          border-radius: 0;

          ${theme.breakpoints.down("mobile")} {
            border-radius: ${theme.spacing(0.5, 0.5, 0, 0)};
          }

          path {
            fill: ${theme.palette.midtoneBrighterer.main};
          }

          .elite-zero path {
            fill: transparent;
            stroke: ${theme.palette.midtoneBrighterer.main};
          }
        }

        button.active {
          background: ${theme.palette.midtoneBrighter.main};
          border-bottom: 3px solid ${theme.palette.white.main};
    
          path {
            fill: ${theme.palette.white.main};
          }
  
          .elite-zero path {
            fill: transparent;
            stroke: ${theme.palette.white.main};
          }
        }
      }

      label {
        padding: ${theme.spacing(0, 3)};
        margin: ${theme.spacing(2, 0, 2, 3)};
        border-left: 1px solid ${theme.palette.midtoneBrighter.main};

        ${theme.breakpoints.down("mobile")} {
          border: none;
          padding-right: ${theme.spacing(2)};
        }
      }
      
      .mobile-spacer {
        ${theme.breakpoints.down("mobile")} {
          flex: 1 1 0%;
        }
      }
    }

    .spacer {
      flex: 1 1 0%;
    }

    .level-slider-container {
      display: flex;
      flex-direction: row;
      margin-right: ${theme.spacing(2)};

      ${theme.breakpoints.down("mobile")} {
        position: relative;
        height: ${theme.spacing(8)};
        background: ${theme.palette.midtone.main};
        margin-right: 0;
        padding-left: ${theme.spacing(2)};
      }

      p {
        margin-top: auto;
        margin-bottom: auto;
      }

      .level-slider-input {
        input {
          text-align: center;
        }

        background: ${theme.palette.midtoneDarker.main};
        width: ${theme.spacing(5)};
        height: ${theme.spacing(4)};
        margin: ${theme.spacing(2, 1)};
        color: ${theme.palette.white.main};
        border-radius: ${theme.spacing(0.5)};
      }

      .level-slider-border {
        width: ${theme.spacing(32)};
        height: ${theme.spacing(3)};
        margin: auto 0;
        padding: ${theme.spacing(0.5, 2.25)};
        border-radius: ${theme.spacing(0.5)};
        border: ${theme.spacing(0.25)} solid ${theme.palette.midtoneBrighterer.main};

        ${theme.breakpoints.down("mobile")} {
          flex-grow: 1;
          margin-right: ${theme.spacing(2)};
        }
        
        .level-slider {
          display: inline-block;
          width: ${theme.spacing(32)};
          height: ${theme.spacing(3)};
          position: relative;
          cursor: pointer;

          ${theme.breakpoints.down("mobile")} {
            flex-grow: 1;
            width: 100%;
          }

          & .MuiSlider-track {
            display: block;
            position: absolute;
            height: ${theme.spacing(3)};
            margin-left: ${theme.spacing(-1.75)};
            border-radius: 0;
            background: ${theme.palette.midtoneBrighter.main};
          }

          & .MuiSlider-rail {
            display: block;
            position: absolute;
            width: 100%;
            padding-right: ${theme.spacing(1.75)};
            height: ${theme.spacing(3)};
            background: ${theme.palette.midtoneDarker.main};
            border-radius: 0;
          }

          & .MuiSlider-thumb {
            position: absolute;
            display: grid;
            margin-left: ${theme.spacing(-1.75)};
            margin-top: ${theme.spacing(0)};
            border-radius: ${theme.spacing(0.25)};
            height: ${theme.spacing(3)};
            width: ${theme.spacing(3.5)};
            background-attachment: fixed;
            background: url("data:image/svg+xml,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.5 0.5C0.776143 0.5 1 0.723858 1 1L1 10C1 10.2761 0.776142 10.5 0.5 10.5C0.223858 10.5 -1.20705e-08 10.2761 0 10L3.93396e-07 1C4.05467e-07 0.723858 0.223858 0.5 0.5 0.5Z' fill='%2387879B'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.5 0.5C5.77614 0.5 6 0.723858 6 1L6 10C6 10.2761 5.77614 10.5 5.5 10.5C5.22386 10.5 5 10.2761 5 10L5 1C5 0.723858 5.22386 0.5 5.5 0.5Z' fill='%2387879B'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.5 0.5C10.7761 0.5 11 0.723858 11 1V10C11 10.2761 10.7761 10.5 10.5 10.5C10.2239 10.5 10 10.2761 10 10V1C10 0.723858 10.2239 0.5 10.5 0.5Z' fill='%2387879B'/%3E%3C/svg%3E%0A") no-repeat center ${theme.palette.white.main};
          }
        }
      }
    }
  }

  dl {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-auto-flow: column;
    gap: ${theme.spacing(0.25)};
    margin-top: 0;

    ${theme.breakpoints.down("mobile")} {
      grid-auto-flow: unset;
    }

    &.operator-stats {
      grid-template-columns: repeat(4, 195fr) 224fr;

      ${theme.breakpoints.down("mobile")} {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(5, max-content);
      }

      .health {
        border-top-left-radius: ${theme.spacing(0.5)};
      }

      .attack-power {
        border-bottom-left-radius: ${theme.spacing(0.5)};

        ${theme.breakpoints.down("mobile")} {
          border-bottom-left-radius: 0;
          border-top-right-radius: ${theme.spacing(0.5)};
        }
      }
    }

    &.summon-stats {
      grid-template-columns: 88fr repeat(4, 149fr) 224fr;

      ${theme.breakpoints.down("mobile")} {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(6, max-content);

        .range {
          grid-row: 6;
        }
      }
    }

    .summon-icon {
      grid-row-start: span 2;
      border-radius: ${theme.spacing(0.5, 0, 0, 0.5)};

      ${theme.breakpoints.down("mobile")} {
        grid-row-start: unset;
        grid-column: span 2;
        border-radius: ${theme.spacing(0.5, 0.5, 0, 0)};
      }

      img {
        margin: auto;
      }
    }

    .health {
      svg path {
        fill: ${theme.palette.lime.main};
      }
    }

    .attack-power {
      svg path {
        fill: ${theme.palette.red.main};
      }
    }

    .defense {
      svg path {
        fill: ${theme.palette.orange.main};
      }
    }

    .attack-speed {
      svg path {
        fill: ${theme.palette.yellow.main};
      }
    }

    .arts-resistance {
      svg path {
        fill: ${theme.palette.blue.main};
      }
    }

    .block {
      svg path {
        fill: ${theme.palette.softBlue.main};
      }
    }

    .redeploy-time {
      svg path {
        fill: ${theme.palette.pink.main};
      }
    }

    .dp-cost {
      svg path {
        fill: ${theme.palette.white.main};
      }
    }

    .range {
      grid-row-start: span 2;
      position: relative;
      border-radius: ${theme.spacing(0, 0.5, 0.5, 0)};

      ${theme.breakpoints.down("mobile")} {
        grid-row: 5;
        grid-column-start: span 2;
        border-radius: ${theme.spacing(0, 0, 0.5, 0.5)};
      }

      dd {
        position: absolute;
        top: -5px; /* this is needed to counteract extra space made by .visually-hidden */
        left: -5px;
        margin-top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        ${theme.breakpoints.down("mobile")} {
          position: relative;
          top: -2.5px;
          left: -2.5px;
        }
      }
    }
  }
`;
