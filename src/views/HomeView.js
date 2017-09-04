import _  from 'lodash'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class HomeView extends Component{
    constructor(props){
        super(props)

        this.state = {
          teams: []
        }
    }

    componentDidMount(){

    }

    render(){
        let { currentUser } = this.props
        return (<div>
            WELCOME
        </div>)
    }
}

HomeView.propTypes = {

}

HomeView.defaultProps = {
    currentUser : {}
}

HomeView.state = {

}


function mapStateToProps(state){
    return {
        currentUser: state.user
    }
}

export default connect(mapStateToProps)(HomeView)
