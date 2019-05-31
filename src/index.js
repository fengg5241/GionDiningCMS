import React from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd-mobile';
import Login from './container/login/login';
import Register from './container/register/register';
import AuthRoute from './component/authroute/AuthRoute';
import reducers from './reducer';
import './config';
import './index.css';
import Dashboard from './component/dashboard/dashboard';
import TransactionDetail from './component/transaction/transactionDetail';
import UserDetail from './component/user/userDetail';
import ShareDetail from './component/share/shareDetail';
import Version from './component/version/version';

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
function Boss() {
  return <h2>BOSS页面</h2>;
}
ReactDom.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <BrowserRouter basename="/gion-dining-cms">
        <div>
          <AuthRoute />
          <Switch>
            <Route path="/boss" component={Boss} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/transactionDetail" component={TransactionDetail} />
            <Route path="/userDetail" component={UserDetail} />
            <Route path="/shareDetail" component={ShareDetail} />
            <Route path="/version" component={Version} />
            <Route default component={Dashboard} />
          </Switch>
        </div>
      </BrowserRouter>
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
);
