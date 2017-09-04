import React, {PropTypes} from 'react';
import PageWrapper from '../layouts/PageWrapper'
import Loading from '../../components/Loading.react'
import FileInput from 'react-file-input'
import { findDOMNode } from 'react-dom'
import localStorage from 'localStorage'
import config from "../../app.config";
const PASSWORD = config.PASSWORD;
const PASSWORD_KEY = config.PASSWORD_KEY;
const firepath = config.firepath


let initialModel = {
  name: '',
  team: '',
  goal: 0
}

export default class AddTeamPlayerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: null,
      pemainList: [],
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
    this.setState({ password: localStorage.getItem(PASSWORD_KEY) });
    this.getTeamData()
  }

  getTeamData(){
    let { key } = this.props.params;

    database.ref(firepath+'/teams/'+key).once('value').then((snapshot)=>{
      let team = {}
      team = snapshot.val()
      this.setState({team: team})
    })

    // now fetch players
    database.ref(firepath + '/players/').orderByChild('team')
            .startAt(key)
            .endAt(key)
            .once('value', (snapshot)=>{
              let players = snapshot.val();
              let pemainList = [];
              for(var player in players ){
                pemainList.push(_.extend({}, players[player], {key: player}));
              }
              this.setState({pemainList: pemainList})
            })


  }

  _addPlayer(e){
    e.preventDefault();
    let model = _.clone(initialModel)
        model.name = this.refs.name.value;
        model.team = this.props.params.key;

    // first create players key
    let newPlayerKey = database.ref(firepath + '/players/').push(model).key;

    // then update players key with data and as well team players
    let updates = {}
        updates[firepath + '/players/' + newPlayerKey ] = model;
        updates[firepath + '/teams/' + this.props.params.key + '/players/' + newPlayerKey] = true;

    // commit the update
    database.ref().update(updates).then(()=>{
      this.refs.name.value = '';
      this.getTeamData()
    })

  }

  _deletePlayer(player){
    Swal({
      title: 'Anda Yakin hapus?',
      text: player.name,
      type: 'warning',
      showCancelButton: true
    }, ()=>{
      database.ref(firepath + '/players/'+player.key).remove().then(()=>{
        this.getTeamData();
      })
    })
  }
    _deletePlayer(player){
    Swal({
      title: 'Anda Yakin hapus?',
      text: player.name,
      type: 'warning',
      showCancelButton: true
    }, ()=>{
      database.ref(firepath + '/players/'+player.key).remove().then(()=>{
        this.getTeamData();
      })
    })
  }

  _clearGoal(player){
    Swal({
      title: 'Anda Yakin mereset gol pemain ini?',
      text: player.name,
      type: 'warning',
      showCancelButton: true
    }, ()=>{
      database.ref(firepath + '/players/'+player.key).update({'/goal': 0}).then(()=>{
        this.getTeamData();
      })
    })
  }

  _editPlayer(player){
    Swal({
      title: 'Ganti Nama Pemain',
      type: 'input',
      text: player.name,
      showCancelButton: true,
      closeOnConfirm: false,
    }, (input)=>{
      if(input === false){
        return false;
      }
      if(input.length < 4){
        Swal.showInputError("Nama harus diisi lebih dari 4 karakter!", "error")
        return false;
      }
      let updates = {}
          updates[firepath + '/players/'+player.key + '/name'] = input

      database.ref().update(updates).then(()=>{
        this.getTeamData();
        Swal.close()
      })
    })
  }

  _uploadFile(e){
    let uploadTask = storageBase.ref + (firepath + '/logo/'+this.state.team.nickname+'.jpg').put(e.target.files[0])

    uploadTask.on('state_changed', (snapshot)=>{
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       console.log('Upload is ' + progress + '% done');
       switch (snapshot.state) {
         case firebase.storage.TaskState.PAUSED: // or 'paused'
           console.log('Upload is paused');
           break;
         case firebase.storage.TaskState.RUNNING: // or 'running'
           console.log('Upload is running');
           break;
       }
    }, (error)=>{

    }, ()=>{
      // success
      let updates = {};
          updates[firepath + '/logo_url'] = uploadTask.snapshot.downloadURL;
      database.ref(firepath + '/teams/' + this.props.params.key).update(updates).then(()=>{
        this.getTeamData();
        findDOMNode(e.targe).value = ''
      })
    })
  }
  getLogo(){
    if(null == this.state.team.logo_url){
      return <span>belum ada logo</span>
    }

    return (<div style={{paddingTop: '35px'}}>
      <img style={{width: '150px'}} src={this.state.team.logo_url}/>
    </div>)
  }

  render() {
    if(this.state.password != PASSWORD){
      return <div>Tidak diizinkan</div>
    }
    let { team, pemainList } = this.state
    if(null == team ){
      return <div className="container"><Loading></Loading></div>
    }
    console.log(pemainList, 'pemain list');
    return (<div>
      <PageWrapper
        title="Kelola Pemain Tim"
        rightButton={[{label: 'kembali', route: '/kelola/tim'}]}
        >
      <div className="row">
        <div className="col-md-3">
          {this.getLogo()}
          <br/>
          <input type="file" onChange={this._uploadFile.bind(this)}/>
        </div>
        <div className="col-md-9">
          <h2>{team.officialname}</h2>
          <ul className="list-group">
            {pemainList.map((pemain, index)=>{
              return <li key={index} className="list-group-item" style={{ overflow: "hidden" }}>
                  <button className="btn btn-info btn-xs" style={{ marginRight: "5px" }}>
                    {pemain.goal} gol
                  </button>
                  {pemain.name}
                  <div style={{ float: "right" }}>
                    <button onClick={this._editPlayer.bind(this, pemain)} className="btn btn-success btn-xs">
                      edit nama
                    </button>
                    <button onClick={this._clearGoal.bind(this, pemain)} className="btn btn-warning btn-xs">
                      clear gol
                    </button>

                    <button onClick={this._deletePlayer.bind(this, pemain)} className="btn btn-danger btn-xs">
                      delete pemain
                    </button>
                  </div>
                </li>;
            })}
            <li className="list-group-item" style={{overflow: 'hidden'}}>
              <form onSubmit={this._addPlayer.bind(this)}>
                <input ref="name" placeholder="Nama pemain" type="text" className="form-control"/>
                <br/>
                <input type="submit" className="btn btn-sm btn-primary" value="tambah"
                  style={{float: 'right'}}
                  onClick={this._addPlayer.bind(this)}
                  />
              </form>
            </li>
          </ul>

        </div>
      </div>



      </PageWrapper>
    </div>);
  }
}

AddTeamPlayerView.propTypes = {
};
