import { Container, Divider, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport, {
  calcEngineerScore,
  calcDetectabilityScore,
  calcSolvingScore,
  calcSpeedScore
} from '../models/EngineerUserAbilityReport'
import {CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer, YAxis} from 'recharts';

interface Props {
  engineerUser: EngineerUser;
  abilities: EngineerUserAbilityReport[];
  rank: {
    engineer: number,
    detectability: number,
    solving: number,
    speed: number,
  }
}

const engineerScoreColor = "#333";
const detectabilityScoreColor = "#f44";
const solvingScoreColor = "#3d3";
const speedScoreColor = "#33f";

const useStyles = makeStyles((theme) => ({
  engineerScore: {
    color: engineerScoreColor,
  },
  detectabilityScore: {
    color: detectabilityScoreColor,
  },
  solvingScore: {
    color: solvingScoreColor,
  },
  speedScore: {
    color: speedScoreColor,
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
  }
}));

export default function EngineerUserAbility(props: Props) {
  const classes = useStyles();
  const { engineerUser, abilities, rank } = props;

  return (
    <Container>
      <div className="user">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <img
              width={200}
              height={200}
              src={engineerUser.photoURL}
              style={{
                borderRadius: "50%",
              }}
            ></img>
          </Grid>
          <Grid item xs={9}>
            <h2>{engineerUser.displayName}さん</h2>
            <h3>GitHubアカウント: <a href={`https://github.com/${engineerUser.loginName}`}>{engineerUser.loginName}</a></h3>
          </Grid>
        </Grid>
      </div>
      <div className={classes.sectionContainer}>
        <h2 className={classes.engineerScore}>エンジニアスコア {calcEngineerScore(abilities[0])} ({rank.engineer}位)</h2>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3 className={classes.detectabilityScore}>発見力 {calcDetectabilityScore(abilities[0]) }({rank.detectability}位)</h3>
            <p>イシュースコア {abilities[0].issueScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.solvingScore}>解決力 {calcSolvingScore(abilities[0])} ({rank.solving}位)</h3>
            <p>プロジェクトスコア {abilities[0].projectScore}</p>
            <p>リポジトリスコア {abilities[0].repositoryScore}</p>
            <p>コミットスコア {abilities[0].commitScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.speedScore}>スピード {calcSpeedScore(abilities[0])} ({rank.speed}位)</h3>
            <p>コミットスピードスコア {abilities[0].speedScore}</p>
          </Grid>
        </Grid>
      </div>
      <div className="chart">
        <ResponsiveContainer width="95%" height={500}>
          <LineChart
            data={abilities.map((ability) => ({
              engineerScore: calcEngineerScore(ability), 
              detectabilityScore: calcDetectabilityScore(ability),
              solvingScore: calcSolvingScore(ability),
              speedScore: calcSpeedScore(ability),
              createdAt: ability.createdAt.getTime(),
            }))}
          >
            <XAxis
              dataKey="createdAt"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(createdAt: number) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(createdAt) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <CartesianGrid stroke="#e5e5e5" />
            <Line type="monotone" name="エンジニアスコア" dataKey="engineerScore" stroke={engineerScoreColor} />
            <Line type="monotone" name="発見力" dataKey="detectabilityScore" stroke={detectabilityScoreColor} />
            <Line type="monotone" name="解決力" dataKey="solvingScore" stroke={solvingScoreColor} />
            <Line type="monotone" name="スピード" dataKey="speedScore" stroke={speedScoreColor} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}