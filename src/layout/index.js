import React from 'react';
import Layout from 'material-ui-layout';
import BasicAppBar from 'material-ui-layout/lib/templates/AppBar/BasicAppBar';
import BasicDrawer from 'material-ui-layout/lib/templates/Drawer/BasicDrawer';
import BasicFooter from 'material-ui-layout/lib/templates/Footer/BasicFooter';
import Home from '@material-ui/icons/Home';
import AuthService from '../components/AuthService';
import { Typography } from '@material-ui/core';

const Auth = new AuthService();

// Defined here for link format reference
const links_administration = [
  {
    icon: Home,
    href: '/home',
    label: 'Home',
  },
  {
    iconName: 'mail',
    href: 'request',
    label: 'Special Request',
  },
  // {
  //   iconName: 'add_circle',
  //   href: '/addinvoice',
  //   label: 'Add Order',
  // },
  // {
  //   iconName: 'map',
  //   href: 'map',
  //   label: 'Real-time Location',
  // },
  {
    iconName: 'view_list',
    href: 'invoicelistadmin',
    label: 'Order List',
  },
  // {
  //   iconName: 'sync',
  //   href: '#',
  //   label: 'Sync POIs & Vehs',
  //   onClick: () => {
  //     axios.get(`${server.url}/vehicles/syncData`).then(res => {
  //       if (res.data[0] ==='OK'){
  //         alert('Vehicle data synced successfully')
  //       }
  //     }).catch (err => {
  //       alert('Vehicle data synced fails', JSON.stringify(err))
  //     }).then(()=>{
  //       axios.get(`${server.url}/pois/syncData`).then(res => {
  //         if (res.data[0] ==='OK'){
  //           alert('POI data synced successfully')
  //         }
  //       }).catch (err => {
  //         alert('POI data synced fails', JSON.stringify(err))
  //       }).then(()=>{
  //         axios.get(`${server.url}/drivers/syncData`).then(res => {
  //           if (res.data[0] ==='OK'){
  //             alert('Driver data synced successfully')
  //           }
  //         }).catch (err => {
  //           alert('Driver data synced fails', JSON.stringify(err))
  //         })
  //       })
  //     })
  //   },
  // },

  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => {
      Auth.logout();
    },
  },
];
const links_user = [
  {
    icon: Home,
    href: '/home',
    label: 'Home',
  },
  {
    iconName: 'add_circle',
    href: '/addinvoice',
    label: 'Add Order',
  },
  {
    iconName: 'map',
    href: '/map',
    label: 'Real-time Location',
  },
  {
    iconName: 'view_list',
    href: '/invoicelist',
    label: 'Order List',
  },

  {
    iconName: 'mail',
    href: 'request',
    label: 'Special Request',
  },
  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => {
      Auth.logout();
    },
  },
];
const links_special = [
  {
    iconName: 'mail',
    href: 'request',
    label: 'Special Request',
  },
  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => Auth.logout(),
  },
];
const links_purchaser = [
  {
    icon: Home,
    href: '/home',
    label: 'Home',
  },
  {
    iconName: 'view_list',
    href: '/invoicelist',
    label: 'Order List',
  },
  {
    iconName: 'attach_money',
    href: '/priceDB',
    label: 'Price Database',
  },
  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => Auth.logout(),
  },
];

const links_supplier = [
  {
    icon: Home,
    href: '/home',
    label: 'Home',
  },
  // {
  //   iconName: 'map',
  //   href: '/map',
  //   label: 'Real-time Location',
  // },
  {
    iconName: 'view_list',
    href: '/invoicelist',
    label: 'Order List',
  },
  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => Auth.logout(),
  },
];

const links_admin = [
  {
    icon: Home,
    href: '/home',
    label: 'Home',
  },
  {
    iconName: 'add_circle',
    href: '/addinvoice',
    label: 'Add Order',
  },
  // {
  //   iconName: 'map',
  //   href: '/map',
  //   label: 'Real-time Location',
  // },
  {
    iconName: 'view_list',
    href: '/invoicelist',
    label: 'Order List',
  },
  {
    iconName: 'person',
    href: '#',
    label: 'Logout',
    onClick: () => Auth.logout(),
  },
];

function getDrawer() {
  switch (localStorage.getItem('role')) {
    case 'Special':
      return links_special;
    case 'Administrator':
      return links_administration;
    case 'admin':
      return links_admin;
    case 'issuer':
      return links_user;
    case 'purchaser':
      return links_purchaser;
    case 'supplier':
      return links_supplier;
    default:
      return null;
  }
}

class AppLayout extends React.Component {
  render() {
    console.log(getDrawer());
    const { children, history } = this.props;
    return (
      <Layout
        stickyFooter // default false
        mainGrow={false} // default true
        appBarPosition={'static'} //default value
        appBarContent={
          <BasicAppBar title={'Delivery Management System'} menuIconAlways>
            <Typography>Test</Typography>
          </BasicAppBar>
        }
        footerContent={
          history.location.pathname !== '/map' ? (
            <BasicFooter
              title={'Powermap'}
              logo={require('../assets/images/logo.png')}
            />
          ) : null
        }
        leftDrawerUnder // default false
        leftDrawerContent={<BasicDrawer links={getDrawer()} />} // If no content it will render null
        leftDrawerType="persistent" // default temporary
      >
        {children}
      </Layout>
    );
  }
}

export default AppLayout;
