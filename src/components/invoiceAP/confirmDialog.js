import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import classNames from 'classnames';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import TimeLine from './deliverTimeline';
import axios from 'axios';
import server from '../../config';
import { Divider } from '@material-ui/core';


import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    root: {
      minWidth: '700px',
      maxWidth: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    // table: {
    //   minWidth: 700,
    // },
    tableHead:{
        backgroundColor: 'green'
    }
  });

  
//   let data = {
//     job_no,invoice_no, supplier, plate_no, origin, destination, 
//     will_return, over_night, over_time, seal_no, car_type, note, 
//     price, issuer, created_date: new Date().toLocaleDateString()
//   };
/** Extent object prototype */

class AlertDialogSlide extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            snackbar_open: false
        };
    }
    

  handleClose = () => {
    this.setState({ open: false });
    this.props.onUpdateState(false);
  };
  

  handleSubmit = (data) => {
    this.setState({ open: false });
    this.props.onUpdateState(false);
    axios.post(`${server.url}/orders`, data).then(res => {
      console.log(res);
      this.setState({
          snackbar_open: true
      })
      this.props.history.push('invoicelist')
    })
 };
 
 
 handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar_open: false });
  };
  
  render() {
    console.log(this.props);
    const {classes} = this.props;

    return (
      <div>
          
        {/* snackbar */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbar_open}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant="success"
            message="Operation successful!"
          />
        </Snackbar>

        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title" style={{margin: 'auto'}}>
              Please verified before confirm order?
          </DialogTitle> 
          <Divider />
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-slide-description"> */}
            <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Date</b>
                            </TableCell>
                            <TableCell >{this.props.data.created_date?new moment(this.props.data.created_date).add(0, 'hours').toDate().toLocaleString():''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Invoice</b>
                            </TableCell>
                            <TableCell >
                              {Object.keys(this.props.data).length !== 0 ?this.props.data.invoices_out_ap.split("\n").map((invoice, ind) => 
                                  {
                                  return <Chip label={`${invoice}`} key={invoice} color="primary"/>
                                  }
                              ):null}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Transporter</b>
                            </TableCell>
                            <TableCell >{this.props.data.supplier}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Vehicle</b>
                            </TableCell>
                            <TableCell >{this.props.data.plate_no}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Product</b>
                            </TableCell>
                            <TableCell >
                            {Object.keys(this.props.data).length !== 0 ?this.props.data.products_ap.split("\n").map((product, ind) => 
                                {
                                return <Chip label={`${product}[${this.props.data.pro_quantity_ap.split("\n")[ind] || ' '}]`} key={product} color="primary"/>
                                }
                            ):null}
                            </TableCell>
                        </TableRow>
                        
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Note</b>
                            </TableCell>
                            <TableCell >{this.props.data.note}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Return</b>
                            </TableCell>
                                <TableCell >{this.props.data.will_return?(<Chip label="True" 
                                    color="primary"/>):(<Chip label="False" />)}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>ค้างคืน*</b> 
                            </TableCell>
                            <TableCell >{this.props.data.over_night?(<Chip label="True" 
                                color="primary"/>):(<Chip label="False" />)}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
            {/* </DialogContentText> */}
            <TimeLine origin ={Object.keys(this.props.data).length !== 0 ?this.props.data.origin:''} destination={Object.keys(this.props.data).length !== 0 ?this.props.data.destination.split("|"):[]}/>            
          </DialogContent> 
          <Divider />
          <DialogActions>
            <Button onClick={this.handleClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button onClick={() => this.handleSubmit(this.props.data)} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AlertDialogSlide);