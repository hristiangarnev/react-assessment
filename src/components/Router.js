import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './NotFound';
import Weather from './Weather';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Weather} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default Router;
