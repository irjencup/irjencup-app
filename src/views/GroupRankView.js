import React, {PropTypes} from 'react';
import PageWrapperFront from './layouts/PageWrapperFront'
import RankIcon from "react-icons/lib/md/view-list";
import FrownIcon from "react-icons/lib/fa/frown-o";
import SmileIcon from "react-icons/lib/fa/smile-o";
import PlayIcon from "react-icons/lib/fa/play-circle";
import MehIcon from "react-icons/lib/fa/meh-o";

export default class GroupRankView extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      teams: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps)
  }

  fetchData(props){
    this.setState({loading: true})
    database.ref(firepath + '/teams/').orderByChild('group')
    .startAt(props.params.id)
    .endAt(props.params.id)
    .once('value', (snap)=>{
      let TeamsObj = snap.val();

      // now fetch all match in this group
      database.ref(firepath + '/matches/').orderByChild('group')
      .startAt(props.params.id)
      .endAt(props.params.id)
      .once('value', (snap)=>{
        let MatchesObj = snap.val();
        // now filter only a finish match
        for(var matchKey in MatchesObj){
          if(parseInt(MatchesObj[matchKey].status) != 2){
            delete MatchesObj[matchKey]
          }
        }

        this.calculatePoints(TeamsObj, MatchesObj)

      })
    })
  }

  calculatePoints(TeamsObj, MatchesObj){
    // first set default points, draw, etc
    for(var teamKey in TeamsObj){
      TeamsObj[teamKey].win = 0;
      TeamsObj[teamKey].draw = 0;
      TeamsObj[teamKey].lost = 0;
      TeamsObj[teamKey].points = 0;
      TeamsObj[teamKey].play = 0;
      TeamsObj[teamKey].goal = 0;
      TeamsObj[teamKey].goaled = 0;
    }


    for(var matchKey in MatchesObj){
      let Match = MatchesObj[matchKey]

      // DECIDE WIN and POINT
      if(Match.score1 > Match.score2){
        // first team won
        TeamsObj[Match.team1].win = (!TeamsObj[Match.team1].win ? 1 : TeamsObj[Match.team1].win + 1)
        TeamsObj[Match.team1].points = (!TeamsObj[Match.team1].points ? 3 : TeamsObj[Match.team1].points + 3)
        // second team lost
        TeamsObj[Match.team2].lost = (!TeamsObj[Match.team2].lost ? 1 : TeamsObj[Match.team2].lost + 1)
      } else if (Match.score1 < Match.score2) {
        // add one win to first team
        TeamsObj[Match.team2].win = (!TeamsObj[Match.team2].win ? 1 : TeamsObj[Match.team2].win + 1)
        TeamsObj[Match.team2].points = (!TeamsObj[Match.team2].points ? 3 : TeamsObj[Match.team2].points + 3)
        // ad one lost to fist team
        TeamsObj[Match.team1].lost = (!TeamsObj[Match.team1].lost ? 1 : TeamsObj[Match.team1].lost + 1)
      } else {
        // draw
        TeamsObj[Match.team1].draw = (!TeamsObj[Match.team1].draw ? 1 : TeamsObj[Match.team1].draw + 1)
        TeamsObj[Match.team2].draw = (!TeamsObj[Match.team2].draw ? 1 : TeamsObj[Match.team2].draw + 1)
        TeamsObj[Match.team1].points = (!TeamsObj[Match.team1].points ? 1 : TeamsObj[Match.team1].points + 1)
        TeamsObj[Match.team2].points = (!TeamsObj[Match.team2].points ? 1 : TeamsObj[Match.team2].points + 1)
      }

      // goal and goaled
      TeamsObj[Match.team1].goal = (!TeamsObj[Match.team1].goal ? Match.score1 : TeamsObj[Match.team1].goal + Match.score1)
      TeamsObj[Match.team2].goal = (!TeamsObj[Match.team2].goal ? Match.score2 : TeamsObj[Match.team2].goal + Match.score2)

      TeamsObj[Match.team1].goaled = (!TeamsObj[Match.team1].goaled ? Match.score2 : TeamsObj[Match.team1].goaled + Match.score2)
      TeamsObj[Match.team2].goaled = (!TeamsObj[Match.team2].goaled ? Match.score1 : TeamsObj[Match.team2].goaled + Match.score1)

      // match played
      TeamsObj[Match.team1].play = (!TeamsObj[Match.team1].play ? 1 : TeamsObj[Match.team1].play + 1)
      TeamsObj[Match.team2].play = (!TeamsObj[Match.team2].play ? 1 : TeamsObj[Match.team2].play + 1)



    }
    this.makeTable(TeamsObj)
  }

  makeTable(TeamsObj){
    let TeamsArray = []

    for(var teamKey in TeamsObj){
      TeamsArray.push(TeamsObj[teamKey])
    }

    TeamsArray.sort((a,b)=>{
      if (a.points > b.points) return -1
      if (b.points > a.points) return 1

      if (parseInt(a.goal) - parseInt(a.goaled) > parseInt(b.goal) - parseInt(b.goaled)) return -1
      if (parseInt(b.goal) - parseInt(b.goaled) > parseInt(a.goal) - parseInt(a.goaled)) return 1

      if(parseInt(a.goal) > parseInt(b.goal)) return -1
      if(parseInt(b.goal) > parseInt(a.goal)) return 1;

    })

    this.setState({teams: TeamsArray, loading: false})

  }

  render() {
    let {teams} = this.state
    if(!teams.length){
      return <div className="container"><Loading></Loading></div>
    }
    return (<div>
      <PageWrapperFront title={<div><RankIcon/> klasemen</div>}>
        <div className="col-md-12">
          <table className="table table-bordered">
            <thead>
              <tr style={{background: "rgba(0,0,0,0.5)", color: '#fff'}}>
                <th style={{width: '30px', textAlign: 'right'}}>rank</th>
                <th style={{minWidth: '350px'}}>team</th>
                <th style={{textAlign: 'center', background: 'green', color: '#fff'}}>poin</th>
                <th style={{textAlign: 'center', background: '#2780E3'}}>selisih</th>
                <th style={{background: 'orange'}}>gol</th>
                <th>bobol</th>
                <th></th>
                <th style={{textAlign: 'center'}}><PlayIcon/></th>
                <th style={{textAlign: 'center', color: "#2880E3", fontWeight: 'bold'}}><SmileIcon/></th>
                <th style={{textAlign: 'center'}}><MehIcon/></th>
                <th style={{textAlign: 'center', color: "red"}}><FrownIcon/></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index)=>{
                return <tr key={index} style={index < 4 ? {background: 'rgba(144, 238, 144, 0.5)'} :{}}>
                    <td style={{textAlign: 'right'}}>{index+1}</td>
                    <td>{team.officialname}</td>
                    <td style={{textAlign: 'center'}}>{team.points}</td>
                    <td style={{textAlign: 'center'}}>{parseInt(team.goal) - parseInt(team.goaled)}</td>
                    <td style={{textAlign: 'center'}}>{team.goal}</td>
                    <td style={{textAlign: 'center'}}>{team.goaled}</td>
                    <td style={{background: 'rgba(0,0,0,0.5)'}}></td>
                    <td style={{textAlign: 'center'}}>{team.play}</td>
                    <td style={{textAlign: 'center'}}>{team.win}</td>
                    <td style={{textAlign: 'center'}}>{team.draw}</td>
                    <td style={{textAlign: 'center'}}>{team.lost}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </PageWrapperFront>
    </div>);
  }
}

GroupRankView.propTypes = {
};
