import React, {PropTypes} from 'react';
import PageWrapper from '../layouts/PageWrapper'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'
import moment from 'moment-timezone'
moment.locale('id')
import { hashHistory } from 'react-router'
import localStorage from 'localStorage'
import config from '../../app.config'
let PASSWORD = config.PASSWORD
let PASSWORD_KEY = config.PASSWORD_KEY

export default class AddMatchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      selectedGroup: 1,
      model: {
        team1: null,
        team2: null,
        date: moment(),
        score1: 0,
        score2: 0,
        type: 'group',
        scorer1: null,
        scorer2: null,
        status: 0 ,// 0 belum dimulai, 1 berlangsung, 2 selesai,
        password: localStorage.getItem(PASSWORD_KEY)
      }
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
    this.getTeams()
  }

  getTeams(){
    let { selectedGroup } = this.state
    database.ref(firepath + '/teams/').orderByChild('group')
            .startAt(selectedGroup.toString())
            .endAt(selectedGroup.toString())
            .once('value',((snapshot)=>{
                let teams = snapshot.val();
                let teamList = []
                for(var team in teams){
                  teamList.push(_.extend({}, teams[team], {key: team}))
                }
                this.setState({teams: teamList})
            }))
  }

  _onGroupChange(){
    let selectedGroup = this.refs.group.value;
    this.setState({selectedGroup: selectedGroup}, this.getTeams)
  }

  _onDateChange(date){
    this.setState({
      model: _.extend({}, this.state.model, {date: date})
    })
  }

  _submit(e){
    e.preventDefault();
    let model = _.clone(this.state.model);

    for(var key in this.refs){
      model[key] = this.refs[key].value;
    }
    model = _.extend(model, {date: moment(model.date).format('L')})
    let required = ['date', 'team1', 'team2']
    for(var property in model){
      if(required.indexOf(property) > -1 && !model[property].length){
        Swal({
          title: property + ' Harus diisi!',
          type: 'error'
        })
        return false;
      }
    }
    if(model.team1 == model.team2){
      Swal({
        title: 'Tim 1 dan Tim 2 tidak boleh sama!',
        type: 'error'
      })
      return false;
    }
    this.saveMatch(model)
  }

  saveMatch(model){
    database.ref(firepath + '/matches').push(model).then(()=>{
      hashHistory.push('/kelola/pertandingan')
    })
  }

  render() {
    if(this.state.password != PASSWORD){
      return <div>Tidak diizinkan</div>
    }
    return (<div>
      <PageWrapper title="Tambah Pertandingan"
        rightButton={[{label: 'Kembali', route: '/kelola/pertandingan'}]}
        >
      <div className="row">
        <div className="col-md-12">
          <form>
            <div className="row">
            <div className="col-md-5">
              <select
                 ref="group"
                 onChange={this._onGroupChange.bind(this)} className="form-control"
                 value={this.state.selectedGroup}
                 >
                <option value="1"> Group A</option>
                <option value="2"> Group B</option>
              </select>
            </div>
            <div className="col-md-12">
              <hr/>

              <DatePicker
                placeholderText="pilih tanggal"
                className="form-control"
                onChange={this._onDateChange.bind(this)}
                selected={this.state.model.date}
                />
            </div>
            </div>
            <br/>
            <div className="row">
            <div className="col-md-5">
              <select ref="team1" className="form-control">
                {this.state.teams.map((team, index)=>{
                  return <option value={team.key} key={index}>
                    {team.officialname}
                  </option>
                })}
              </select>
            </div>
            <div className="col-md-2" style={{textAlign: 'center'}}>
              vs
            </div>
            <div className="col-md-5">
              <select ref="team2" className="form-control">
                {this.state.teams.map((team, index)=>{
                  return <option value={team.key} key={index}>
                    {team.officialname}
                  </option>
                })}
              </select>
            </div>
            </div>
            <br/>
            <input
              onClick={this._submit.bind(this)}
              type="submit" value="Tambah" className="btn btn-primary"/>
          </form>
        </div>
      </div>
      </PageWrapper>
    </div>);
  }
}

AddMatchView.propTypes = {
};
