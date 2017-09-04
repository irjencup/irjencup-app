import React, {PropTypes} from 'react';
import { Link } from 'react-router'

export default class PageWrapperFront extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { children, title, rightButton } = this.props
    return (<div className="">
      <div className="container page-wrapper animated zoomIn">
        <div className="col-md-12">
        <h3>{title}
          <div style={{float: 'right'}}>
            {rightButton.map((button, index)=>{
              return <Link key={index} to={button.route}><button className="btn btn-primary">
                {button.label}
              </button></Link>
            })}
          </div>
        </h3>
        </div>
        <br/>
        <br/>
        {children}
      </div>
    </div>);
  }
}

PageWrapperFront.defaultProps = {
  rightButton: []
}

PageWrapperFront.propTypes = {
};
