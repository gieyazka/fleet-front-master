import React, { Component } from 'react';

import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  AddInvoice,
  Login,
  Home,
  MapView,
  InvoiceList,
  InvoiceListAdmin,
  Print,
  EditInvoice,
  ViewInvoice,
  ViewInvoiceAP,
  EditInvoiceAP,
  Report,
  Alert,
  Form,
  Status,
  RequestTable,
} from './containers/index';
import './App.css';
import AppLayout from './layout/';
import AuthService from './components/AuthService';
import priceDB from './components/priceDB';
/** React table */
import 'react-table/react-table.css';
import PrintProvider, { NoPrint } from 'react-easy-print';

// important
import createBrowserHistory from 'history/createBrowserHistory';

import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c',
});

const history = createBrowserHistory();

const Auth = new AuthService();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.loggedIn() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);
export default class App extends Component {
  render() {
    console.log(Auth.loggedIn());
    return (
      <JssProvider generateClassName={generateClassName}>
        <PrintProvider>
          <NoPrint>
            <Router history={history}>
              <AppLayout history={history}>
                <div
                  style={{
                    width: '-webkit-fill-available',
                    backgroundColor: 'black',
                  }}
                >
                  <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route
                      exact
                      path="/status/:id/:status/:email"
                      component={Status}
                    />
                    <PrivateRoute
                      path="/home"
                      component={
                        localStorage.getItem('role') === 'Special'
                          ? RequestTable
                          : Home
                      }
                    />
                    {/* <PrivateRoute path="/map" component={MapView} /> */}
                    <PrivateRoute
                      path="/addinvoice"
                      component={AddInvoice}
                    />{' '}
                    {/* <PrivateRoute path="/addinvoice" component={AddInvoice} /> }/>  */}
                    {/* component={() => <Dashboard isAuthed={true} />}   */}
                    {/* {localStorage.getItem('role') !== 'supplier' && localStorage.getItem('role') !== 'purchaser' && localStorage.getItem('role') !== 'Administrator'?<PrivateRoute path="/addinvoice" component={AddInvoice} />:null} */}
                    <PrivateRoute path="/invoicelist" component={InvoiceList} />
                    <PrivateRoute
                      path="/invoicelistadmin"
                      component={InvoiceListAdmin}
                    />
                    <PrivateRoute path="/editinvoice" component={EditInvoice} />
                    <PrivateRoute path="/form" component={Form} />
                    <PrivateRoute path="/request" component={RequestTable} />
                    <PrivateRoute path="/viewinvoice" component={ViewInvoice} />
                    <PrivateRoute
                      path="/viewinvoiceAP"
                      component={ViewInvoiceAP}
                    />
                    <PrivateRoute
                      path="/editinvoiceAP"
                      component={EditInvoiceAP}
                    />
                    <PrivateRoute path="/print" component={Print} />
                    <PrivateRoute path="/report" component={Report} />
                    <PrivateRoute path="/priceDB" component={priceDB} />
                    <Route
                      path="*"
                      component={() => <Redirect to="/InvoiceList" />}
                    />
                  </Switch>
                </div>
              </AppLayout>
            </Router>
          </NoPrint>
        </PrintProvider>
      </JssProvider>
    );
  }
}
