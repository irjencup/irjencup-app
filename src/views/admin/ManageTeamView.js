import React, {PropTypes} from 'react';
import PageWrapper from '../layouts/PageWrapper'
import { connect } from 'react-redux'
import Loading from '../../components/Loading.react'
import  { Link } from 'react-router'
import localStorage from 'localStorage'
import config from '../../app.config'
const PASSWORD = config.PASSWORD
const PASSWORD_KEY = config.PASSWORD_KEY

export default class ManageTeamView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      loading: true,
      password: localStorage.getItem(PASSWORD_KEY)
    }
  }

  componentDidMount() {
    
    if(localStorage.getItem(PASSWORD_KEY) != PASSWORD){
      Swal(
        {
          type: "input",
          text: "Masukan administrator password",
          title: "Tunggu dulu!",
          inputType: "password"
        },
        password => {
          this.setState({ password: password });
          localStorage.setItem(PASSWORD_KEY, password);
        }
      );
    }
    this.setState({password: localStorage.getItem(PASSWORD_KEY)})
    this.getTeamList()
  }

  getTeamList(){
    this.setState({loading: true})
    console.log(firepath, 'what is the firepath')
    database.ref(firepath + '/teams/').once('value').then((snapshot)=>{
      let teamsObj = snapshot.val();
      let teamList = [];

      for(var team in teamsObj){
        teamList.push(_.extend({}, teamsObj[team], {key: team}))
      }

      this.setState({teams: teamList, loading: false})
    })
  }

  _deleteTeam(team){
    Swal({
      title: 'Yakin hapus?',
      text: team.officialname,
      type: 'warning',
      showCancelButton: true,
    }, ()=>{
      database.ref(firepath + '/teams/'+team.key).remove().then(()=>{
        this.getTeamList()
      })
    })
  }

  _switchGroup(team){
    Swal({
      title: 'Yakin Switch Group?',
      text: team.officialname,
      type: 'warning',
      showCancelButton: true,
    }, ()=>{
      database.ref(firepath + '/teams/'+team.key).update({group: team.group == "1" ? "2" : "1"}).then(()=>{
        this.getTeamList()
      })
    })
  }

  getLogo(team){
      return (
        <div style={{
            display: 'inline-block',
            width: '48',
            height: '48',
            border: '0px solid #ccc',
            marginBottom: '-12px', marginRight: '5px',
            background: 'url('+team.logo_url+')',
            backgroundSize: '48px 48px !important'
          }}></div>
      )
  }

  render() {
    if (this.state.password != PASSWORD) {
      return <div>Izin dulu om sama adminnya</div>;
    }
    let { teams } = this.state
    if(this.state.loading){
      return <div className="container"><Loading/></div>
    }
    let groupa = teams.filter((team, index)=>{
      return team.group == 1
    })
    let groupb = teams.filter((team, index)=>{
      return team.group == 2
    })

    return (<div>
      <PageWrapper
        title={<span>Kelola Tim</span>}
        rightButton={[{label: 'Add Team', route: 'kelola/tim/tambah'}]}
        >
        <div className="col-md-6">
          <h3>Group A</h3>
          <ul className="list-group">
          {groupa.map((team, index)=>{
            return <li className="list-group-item" key={index}>
                {this.getLogo(team)}
                {team.officialname}
                <div style={{ float: "right" }}>
                  <Link to={`/kelola/tim/${team.key}/pemain`}>
                    <button style={{ marginRight: "5px" }} className="btn btn-xs btn-success">
                      kelola
                    </button>
                  </Link>
                  <button style={{marginRight: "5px"}} onClick={this._deleteTeam.bind(this, team)} className="btn btn-xs btn-danger">
                    delete team
                  </button>
                  <button onClick={this._switchGroup.bind(this, team)} className="btn btn-xs btn-info">
                    switch group
                  </button>
                </div>
              </li>;
          })}
          </ul>
        </div>

        <div className="col-md-6">
          <h3>Group B</h3>
          <ul className="list-group">
          {groupb.map((team, index)=>{
            return <li className="list-group-item" key={index}>
                {this.getLogo(team)}
                {team.officialname}
                <div style={{ float: "right" }}>
                  <Link to={`/kelola/tim/${team.key}/pemain`}>
                    <button style={{ marginRight: "5px" }} className="btn btn-xs btn-success">
                      kelola
                    </button>
                  </Link>
                  <button style={{ marginRight: "5px" }} onClick={this._deleteTeam.bind(this, team)} className="btn btn-xs btn-danger">
                    delete team
                  </button>
                  <button onClick={this._switchGroup.bind(this, team)} className="btn btn-xs btn-info">
                    switch group
                  </button>
                </div>
              </li>;
          })}
          </ul>
        </div>


      </PageWrapper>
    </div>);
  }
}

ManageTeamView.propTypes = {
};
