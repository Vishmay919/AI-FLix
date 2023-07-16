import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import VideoUpload from './VideoUpload';
import VideoList from './VideoList';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={VideoList} />
        <Route path="/upload" component={VideoUpload} />
      </Switch>
    </Router>
  );
};

export default App;
