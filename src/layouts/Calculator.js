import React from 'react'
import { Link } from 'react-router'
import '../styles/app.css'

export default function CalculatorLayout({children}){
    return <div>
        <nav className="navbar navbar-default center">
          <div className="container navbar-inner">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#/grup/1">Grup A</a>
                </li>
                <li>
                  <a href="#/grup/2">Grup B</a>
                </li>
                <li>
                  <a href="#/jadwal">
                    {" "}
                    Jadwal <span className="sr-only" />
                  </a>
                </li>

                <li>
                  <a href="#/top-skor">
                    {" "}
                    Top Skor <span className="sr-only" />
                  </a>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Tahun <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="../2016">2016</a>
                    </li>
                    <li>
                      <a href="../2017">2017</a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right" />
            </div>
          </div>
        </nav>
        {children}
      </div>;
}
