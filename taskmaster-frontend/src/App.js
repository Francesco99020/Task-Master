import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import HostDashboard from './HostDashboard';
import MemberDashboard from './MemberDashboard.js';
import withAuth from './withAuth';

const ProtectedHomePage = withAuth(HomePage);

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/home" component={ProtectedHomePage} />
                <Route path="/host-dashboard/:groupId" component={HostDashboard} />
                <Route path="/member-dashboard/:groupId" component={MemberDashboard} />
                <Route exact path="/" component={LoginPage} />
            </Switch>
        </Router>
    );
};

export default App;