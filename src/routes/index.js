import React, {Component } from 'react'
import { Route, IndexRoute } from 'react-router'

import CalculatorLayout from '../layouts/Calculator'
import HomeView from '../views/HomeView'
import AboutView from '../views/AboutView'
import ManageTeamView from '../views/admin/ManageTeamView'
import AddTeamView from '../views/admin/AddTeamView'
import AddTeamPlayerView from '../views/admin/AddTeamPlayerView'
import ManageMatchView from '../views/admin/ManageMatchView'
import AddMatchView from '../views/admin/AddMatchView'
import AddMatchOnStageView from '../views/admin/AddMatchOnStageView'

import TopScoreView from '../views/TopScoreView'
import GroupRankView from '../views/GroupRankView'
import ScheduleView from '../views/ScheduleView'


export default (
    <Route path="/" component={CalculatorLayout}>
        <IndexRoute component={ScheduleView} />
        <Route path="/about" component={AboutView} />
        <Route path="/top-skor" component={TopScoreView} />
        <Route path="/grup/:id" component={GroupRankView} />
        <Route path="/jadwal" component={ScheduleView} />

        <Route path="/kelola/tim" component={ManageTeamView}/>
        <Route path="/kelola/tim/tambah" component={AddTeamView} />
        <Route path="/kelola/tim/:key/pemain" component={AddTeamPlayerView} />
        <Route path="/kelola/pertandingan" component={ManageMatchView}/>
        <Route path="/kelola/pertandingan/tambah" component={AddMatchView} />
        <Route path="/kelola/pertandingan/stage/tambah" component={AddMatchOnStageView}/>
    </Route>
)
