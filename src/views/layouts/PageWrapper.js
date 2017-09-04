import React, {PropTypes} from 'react';
import { Link } from 'react-router'

export default class PageWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { children, title, rightButton } = this.props
    return (<div className="">
      <div className="container page-wrapper">
        <h3 style={{fontWeight: 'bold'}}>{title}
          <div style={{float: 'right'}}>
            {rightButton.map((button, index)=>{
              return <Link key={index} to={button.route}><button className="btn btn-primary">
                {button.label}
              </button></Link>
            })}
          </div>
        </h3>
        <hr/>
        {children}
      </div>
    </div>);
  }
}

PageWrapper.defaultProps = {
  rightButton: []
}

PageWrapper.propTypes = {
};
