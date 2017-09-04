import React, {PropTypes} from 'react';
import PageWrapper from '../layouts/PageWrapper'
import EditScore from '../../components/EditScore.react'
import localStorage from 'localStorage'
import config from '../../app.config'
let PASSWORD = config.PASSWORD
let PASSWORD_KEY = config.PASSWORD_KEY;

export default class ManageMatchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      groupa: [],
      groupb: [],
      perempatfinal: [],
      semifinal:[],
      finalmatch:[],
      loading: true,
      editedMatch: {},
      password: localStorage.getItem(PASSWORD_KEY)
    }
  }

  componentDidMount() {
        if (localStorage.getItem(PASSWORD_KEY) != PASSWORD) {
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
    this.getMatches()
  }

  getMatches(){
    this.setState({loading: true})
    database.ref(firepath + '/teams').once('value')
            .then((snapshot)=>{
              let teams = snapshot.val();
              let teamList = [];
              for(var team in teams){
                teams[team].key = team;
              }
              this.mergeWithMatch(teams)
            })


  }

  mergeWithMatch(teamList){
    database.ref(firepath + '/matches').on('value',
            (snapshot)=>{
              let matches = snapshot.val();
              let matchList = [];

              for(var the_match in matches){
                matchList.push(_.extend({}, matches[the_match], {key: the_match}))
              }

            matchList = matchList.map((tmatch, index)=>{
              tmatch.team1 = teamList[tmatch.team1]
              tmatch.team2 = teamList[tmatch.team2]
              return tmatch
            })
            this.setState({matches: matchList, loading: false})
            this.classifyMatch(matchList)

          })
  }

  classifyMatch(matches){
    let groupa = matches.filter((match, index)=>{
      return parseInt(match.group) == 1
    })

    let groupb = matches.filter((match, index)=>{
      return parseInt(match.group) == 2
    })

    let perempatfinal = matches.filter((match, index)=>{
      return match.stage == 'quarter'
    })

    let semifinal = matches.filter((match, index)=>{
      return match.stage == 'semi'
    })

    let finalmatch = matches.filter((match, index)=>{
      return match.stage == 'final'
    })

    this.setState({
      groupa: groupa,
      groupb: groupb,
      perempatfinal: perempatfinal,
      semifinal: semifinal,
      finalmatch: finalmatch
    })


  }


  onGoalAdded(){
    this.getMatches();
  }

  _editMatch(match){
    if(match.key == this.state.editedMatch.key){
      this.setState({editedMatch: {}})
      return false;
    }
    this.setState({editedMatch: match})
  }

  _deleteMatch(match){
    Swal({
      title: 'Yakin hapus pertandingan?',
      text: match.team1.officialname + ' vs ' + match.team2.officialname,
      showCancelButton: true,
      closeOnConfirm: false,
    }, ()=>{
      // delete match
      // TODO
      if(match.scorer1 || match.scorer2){
        Swal({
          title: 'Hapus dulu semua gol!',
          text: 'Sebelum menghapus pertandingan, hapus dulu semua pencetak gol',
          type: 'error',
        }, ()=>{
        })
        return false;
      }

      // trully delete
      database.ref(firepath + '/matches/' + match.key).remove().then(()=>{
        Swal({
          title:'Berhasil Menghapus Pertandingan',
          type: 'success'
        }, ()=>{
          this.getMatches()
        })
      })

    })
  }

  _onScoreUpdate(){
    this.getMatches();
  }

  render() {
    if(this.state.password != PASSWORD){
      return <div>Tidak diizinkan</div>
    }
    if(this.state.loading){
      return <div className="container"><Loading/></div>
    }

    let { selectedMatch }  = this.state
    return (<div>
      <PageWrapper title="Kelola Pertandingan"
        rightButton={[{label: 'Tambah Pertandingan Grup', route: '/kelola/pertandingan/tambah'}, {label: 'Tambah Pertandingan Knockout', route: '/kelola/pertandingan/stage/tambah'}]}
        >
        <ul className="list-group">
          {this.state.groupa.map((the_match, index)=>{
            return <li className="list-group-item" key={index} style={{marginBottom: '10px'}}>
              <div className="row">
                <div className="col-md-2">
                  <span className="btn btn-xs btn-success">{the_match.date}</span>
                  {parseInt(the_match.status) == 2 ? <span className="btn btn-xs btn-info">selesai</span> : ''}
                  {parseInt(the_match.status) == 1 ? <span className="btn btn-xs btn-info">berlangsung</span> : ''}

                </div>
                <div className="col-md-3" style={{textAlign: 'right'}}>
                  {the_match.team1.officialname}
                </div>
                <div className="col-md-2" style={{textAlign: 'center'}}>
                  <span
                    style={{marginRight: '4px'}}
                     className="btn btn-sm btn-info">{the_match.score1}</span>
                   vs
                  <span
                    style={{marginLeft: '4px'}}
                    className="btn btn-sm btn-info">{the_match.score2}</span>
                </div>
                <div className="col-md-3">
                  {the_match.team2.officialname}
                </div>
                <div className="col-md-2" style={{textAlign: 'right'}}>
                  <span onClick={this._editMatch.bind(this, the_match)} className="btn btn-xs btn-primary">edit</span>
                  <span
                    onClick={this._deleteMatch.bind(this, the_match)}
                    className="btn btn-xs btn-danger">x</span>
                </div>
              </div>
              <EditScore
                show={this.state.editedMatch.key == the_match.key}
                match={the_match}
                onScoreUpdate={this._onScoreUpdate.bind(this)}
                />
            </li>
          })}
        </ul>
        <hr/>

        <h2>Group B</h2>
          <ul className="list-group">
            {this.state.groupb.map((the_match, index)=>{
              return <li className="list-group-item" key={index} style={{marginBottom: '10px'}}>
                <div className="row">
                  <div className="col-md-2">
                    <span className="btn btn-xs btn-success">{the_match.date}</span>
                    {parseInt(the_match.status) == 2 ? <span className="btn btn-xs btn-info">selesai</span> : ''}
                    {parseInt(the_match.status) == 1 ? <span className="btn btn-xs btn-info">berlangsung</span> : ''}

                  </div>
                  <div className="col-md-3" style={{textAlign: 'right'}}>
                    {the_match.team1.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'center'}}>
                    <span
                      style={{marginRight: '4px'}}
                       className="btn btn-sm btn-info">{the_match.score1}</span>
                     vs
                    <span
                      style={{marginLeft: '4px'}}
                      className="btn btn-sm btn-info">{the_match.score2}</span>
                  </div>
                  <div className="col-md-3">
                    {the_match.team2.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'right'}}>
                    <span onClick={this._editMatch.bind(this, the_match)} className="btn btn-xs btn-primary">edit</span>
                    <span
                      onClick={this._deleteMatch.bind(this, the_match)}
                      className="btn btn-xs btn-danger">x</span>
                  </div>
                </div>
                <EditScore
                  show={this.state.editedMatch.key == the_match.key}
                  match={the_match}
                  onScoreUpdate={this._onScoreUpdate.bind(this)}
                  />
              </li>
            })}
          </ul>
          <hr/>

        <h2>Perempat Final</h2>
          <ul className="list-group">
            {this.state.perempatfinal.map((the_match, index)=>{
              return <li className="list-group-item" key={index} style={{marginBottom: '10px'}}>
                <div className="row">
                  <div className="col-md-2">
                    <span className="btn btn-xs btn-success">{the_match.date}</span>
                    {parseInt(the_match.status) == 2 ? <span className="btn btn-xs btn-info">selesai</span> : ''}
                    {parseInt(the_match.status) == 1 ? <span className="btn btn-xs btn-info">berlangsung</span> : ''}

                  </div>
                  <div className="col-md-3" style={{textAlign: 'right'}}>
                    {the_match.team1.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'center'}}>
                    <span
                      style={{marginRight: '4px'}}
                       className="btn btn-sm btn-info">{the_match.score1}</span>
                     vs
                    <span
                      style={{marginLeft: '4px'}}
                      className="btn btn-sm btn-info">{the_match.score2}</span>
                  </div>
                  <div className="col-md-3">
                    {the_match.team2.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'right'}}>
                    <span onClick={this._editMatch.bind(this, the_match)} className="btn btn-xs btn-primary">edit</span>
                    <span
                      onClick={this._deleteMatch.bind(this, the_match)}
                      className="btn btn-xs btn-danger">x</span>
                  </div>
                </div>
                <EditScore
                  show={this.state.editedMatch.key == the_match.key}
                  match={the_match}
                  onScoreUpdate={this._onScoreUpdate.bind(this)}
                  />
              </li>
            })}
          </ul>
          <hr/>

        <h2> Semifinal </h2>
          <ul className="list-group">
            {this.state.semifinal.map((the_match, index)=>{
              return <li className="list-group-item" key={index} style={{marginBottom: '10px'}}>
                <div className="row">
                  <div className="col-md-2">
                    <span className="btn btn-xs btn-success">{the_match.date}</span>
                    {parseInt(the_match.status) == 2 ? <span className="btn btn-xs btn-info">selesai</span> : ''}
                    {parseInt(the_match.status) == 1 ? <span className="btn btn-xs btn-info">berlangsung</span> : ''}

                  </div>
                  <div className="col-md-3" style={{textAlign: 'right'}}>
                    {the_match.team1.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'center'}}>
                    <span
                      style={{marginRight: '4px'}}
                       className="btn btn-sm btn-info">{the_match.score1}</span>
                     vs
                    <span
                      style={{marginLeft: '4px'}}
                      className="btn btn-sm btn-info">{the_match.score2}</span>
                  </div>
                  <div className="col-md-3">
                    {the_match.team2.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'right'}}>
                    <span onClick={this._editMatch.bind(this, the_match)} className="btn btn-xs btn-primary">edit</span>
                    <span
                      onClick={this._deleteMatch.bind(this, the_match)}
                      className="btn btn-xs btn-danger">x</span>
                  </div>
                </div>
                <EditScore
                  show={this.state.editedMatch.key == the_match.key}
                  match={the_match}
                  onScoreUpdate={this._onScoreUpdate.bind(this)}
                  />
              </li>
            })}
          </ul>
          <hr/>

        <h2>Final</h2>
          <ul className="list-group">
            {this.state.finalmatch.map((the_match, index)=>{
              return <li className="list-group-item" key={index} style={{marginBottom: '10px'}}>
                <div className="row">
                  <div className="col-md-2">
                    <span className="btn btn-xs btn-success">{the_match.date}</span>
                    {parseInt(the_match.status) == 2 ? <span className="btn btn-xs btn-info">selesai</span> : ''}
                    {parseInt(the_match.status) == 1 ? <span className="btn btn-xs btn-info">berlangsung</span> : ''}

                  </div>
                  <div className="col-md-3" style={{textAlign: 'right'}}>
                    {the_match.team1.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'center'}}>
                    <span
                      style={{marginRight: '4px'}}
                       className="btn btn-sm btn-info">{the_match.score1}</span>
                     vs
                    <span
                      style={{marginLeft: '4px'}}
                      className="btn btn-sm btn-info">{the_match.score2}</span>
                  </div>
                  <div className="col-md-3">
                    {the_match.team2.officialname}
                  </div>
                  <div className="col-md-2" style={{textAlign: 'right'}}>
                    <span onClick={this._editMatch.bind(this, the_match)} className="btn btn-xs btn-primary">edit</span>
                    <span
                      onClick={this._deleteMatch.bind(this, the_match)}
                      className="btn btn-xs btn-danger">x</span>
                  </div>
                </div>
                <EditScore
                  show={this.state.editedMatch.key == the_match.key}
                  match={the_match}
                  onScoreUpdate={this._onScoreUpdate.bind(this)}
                  />
              </li>
            })}
          </ul>
      </PageWrapper>
    </div>);
  }
}

ManageMatchView.propTypes = {
};
