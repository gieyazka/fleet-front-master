import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import TimeLine from './deliverTimeline';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import AddIcon from '@material-ui/icons/Add';
// import RestoreIcon from '@material-ui/icons/Restore';
import LeftIcon from '@material-ui/icons/SkipPrevious';
import RightIcon from '@material-ui/icons/SkipNext';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import server from '../../config';
import { Typography } from '@material-ui/core';
import Draggable from 'react-draggable';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

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
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const SweetAlert = withReactContent(Swal);

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = (theme) => ({
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

const styles = (theme) => ({
  root: {
    // ...theme.mixins.gutters(),
    padding: '0.5cm',
    width: window.innerWidth <= 1024 ? '95%' : '60%',
    height: 'auto',
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
  },
  box: {
    border: 'solid',
    padding: 10,
    borderWidth: 0.25,
    borderColor: 'grey',
    boxSizing: 'border-box',
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

function PaperComponent(props) {
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

class PaperSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      lastOrder: '',
      firstOrder: '',
      open: false,
      updated_data: '',
      filled_data: '',
      reset_time: false,
      snackbar_open: false,
      order_id: '',
    };
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentWillMount() {
    let self = this;
    const lastOrder = axios.get(
      `${server.url}/orders?company_id=${localStorage.getItem(
        'companyID'
      )}&_sort=job_no:DESC&_limit=1`
    );
    const firstOrder = axios.get(
      `${server.url}/orders?company_id=${localStorage.getItem(
        'companyID'
      )}&_sort=job_no:ASC&_limit=1`
    );

    /** Prepare logo, comany's name */
    Promise.all([lastOrder, firstOrder])
      .then(function (values) {
        console.log(values);
        self.setState({
          lastOrder: values[0].data[0].job_no,
          firstOrder: values[1].data[0].job_no,
        });
      })
      .catch(function (err) {
        console.log(err.message); // some coding error in handling happened
      })
      // loading data from reference id
      .then(() => {
        axios
          .get(
            `${server.url}/orders/${this.props.history.location.search.replace(
              '?',
              ''
            )}`
          )
          .then((res) => {
            console.log(res.data);
            this.setState({
              data: res.data,
            });
          });
      });
  }

  previous() {
    if (localStorage.getItem('role') === 'supplier') {
      axios
        .get(
          `${server.url}/orders?job_no=${this.pad(
            parseInt(this.state.data.job_no) - 1,
            5
          )}&supplier=${this.state.data.supplier}`
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.length === 0) {
            // console.log(props);

            let alertText =
              'Order ' +
              this.pad(parseInt(this.state.data.job_no) - 1) +
              ' is not found';
            SweetAlert.fire({
              title: 'Error',
              text: alertText,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            this.setState({
              data: res.data[0],
            });
          }
        });
    } else {
      axios
        .get(
          `${server.url}/orders?job_no=${this.pad(
            parseInt(this.state.data.job_no) - 1,
            5
          )}&company_id=${localStorage.getItem('companyID')}`
        )
        .then((res) => {
          console.log(res.data);
          this.setState({
            data: res.data[0],
          });
        });
    }
  }

  handleConfirm() {
    console.log(this);
    this.setState({
      open: false,
    });
    if (this.state.updated_data !== '') {
      axios
        .put(
          `${server.url}/orders/${this.state.data.id}`,
          this.state.updated_data
        )
        .then((res) => {
          // alert('update successfully'); // change this to snakbar
        })
        .then(() => {
          this.setState({
            data: { ...this.state.data, ...this.state.updated_data },
            snackbar_open: true,
            updated_data: '',
          });
        });
    } else if (this.state.filled_data !== '') {
      // call url for auto filled
      axios
        .post(`${server.url}/orders/filltime`, this.state.filled_data)
        .then((res) => {
          /** reload state */
          axios
            .get(
              `${server.url
              }/orders/${this.props.history.location.search.replace('?', '')}`
            )
            .then((res) => {
              console.log(res.data);
              this.setState({
                data: { ...this.state.data, ...res.data },
                snackbar_open: true,
                open: false,
                filled_data: '',
              });
            });
        });
    } else if (this.state.reset_time) {
      // call url for auto filled
      axios
        .post(`${server.url}/orders/resettime`, {
          order_id: this.state.order_id,
          dest_geo_in: this.state.dest_geo_in,
          dest_geo_out: this.state.dest_geo_out,
        })
        .then((res) => {
          /** reload state */
          axios
            .get(
              `${server.url
              }/orders/${this.props.history.location.search.replace('?', '')}`
            )
            .then((res) => {
              console.log(res.data);
              this.setState({
                data: { ...this.state.data, ...res.data },
                snackbar_open: true,
                open: false,
                reset_time: false,
              });
            });
        });
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar_open: false });
  };

  next() {
    console.log(this.pad(parseInt(this.state.data.job_no) + 1, 5));
    if (localStorage.getItem('role') === 'supplier') {
      axios
        .get(
          `${server.url}/orders?job_no=${this.pad(
            parseInt(this.state.data.job_no) + 1,
            5
          )}&supplier=${this.state.data.supplier}`
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.length === 0) {
            // console.log(props);
            let alertText =
              'Order ' +
              this.pad(parseInt(this.state.data.job_no) + 1) +
              ' is not found';
            SweetAlert.fire({
              title: 'Error',
              text: alertText,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            this.setState({
              data: res.data[0],
            });
          }
        });
    } else {
      axios
        .get(
          `${server.url}/orders?job_no=${this.pad(
            parseInt(this.state.data.job_no) + 1,
            5
          )}&company_id=${localStorage.getItem('companyID')}`
        )
        .then((res) => {
          console.log(res.data);
          this.setState({
            data: res.data[0],
          });
        });
    }
  }

  // add leading zero
  pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  render() {
    console.log(this.state);
    console.log(this.props);
    const { classes } = this.props;
    const { data, lastOrder, firstOrder } = this.state;
    if (isEmpty(data)) {
      return (
        <div>
          <LinearProgress />
          <br />
          <LinearProgress color="secondary" />
        </div>
      );
    }
    return (
      <Grid container style={{ justifyContent: 'center', margin: '10px' }}>
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
        {/* Confirm dialog */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to perform this operation?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary">
              No
            </Button>
            <Button onClick={() => this.handleConfirm()} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container style={{ justifyContent: 'center' }}>
          <Paper
            style={{
              width: '100%',
              margin: 10,
              textAlign: 'center',
              display: 'contents',
            }}
          >
            {localStorage.getItem('role') !== 'Administrator' ? (
              <Button
                variant="contained"
                size="small"
                disabled={data ? data.job_no === firstOrder : false}
                className={classes.button}
                onClick={() => this.previous()}
              >
                <LeftIcon
                  className={classNames(classes.leftIcon, classes.iconSmall)}
                />
                Previous
              </Button>
            ) : null}
            {/* check if role admin && if order has return && if all date are filled */}
            {console.log(
              data.will_return
                ? data.return_out === ''
                  ? false
                  : true
                : data.dest_geo_out.split('|').includes('0')
                  ? true
                  : false
            )}
            {localStorage.getItem('role') === 'admin' &&
              data.status === 'match' ? (
              <Button
                variant="contained"
                style={{ backgroundColor: '#5CB85C', color: 'white' }}
                className={classes.button}
                onClick={() => {
                  this.setState({
                    open: true,
                    updated_data: {
                      checked_by: localStorage.getItem('username'),
                      status: 'confirm',
                      updated_date: new Date(),
                    },
                  });
                }}
              >
                Confirm
                <CheckIcon className={classes.rightIcon} />
              </Button>
            ) : null}
            {localStorage.getItem('role') === 'admin' ? (
              <Button
                variant="contained"
                style={{ backgroundColor: '#C90D0D', color: 'white' }}
                className={classes.button}
                onClick={() => {
                  this.setState({
                    open: true,
                    updated_data: {
                      checked_by: localStorage.getItem('username'),
                      status: 'void',
                      updated_date: new Date(),
                    },
                  });
                }}
              >
                Void
                <ClearIcon className={classes.rightIcon} />
              </Button>
            ) : null}
            {data.status === 'GPS_error' &&
              localStorage.getItem('role') === 'Administrator' ? (
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => {
                  this.setState({
                    open: true,
                    filled_data: {
                      id: data.id,
                      created_date: data.created_date,
                      delivered_date: data.delivered_date,
                      plate_no: data.plate_no,
                      origin: data.origin,
                      destination: data.destination,
                      will_return: data.will_return,
                      origin_geo_in: data.origin_geo_in,
                      origin_geo_out: data.origin_geo_out,
                      return_in: data.return_in,
                      return_out: data.return_out,
                      dest_geo_in: data.dest_geo_in,
                      dest_geo_out: data.dest_geo_out,
                      driver_name: data.driver_name,
                      price: data.price,
                    },
                  });
                }}
              >
                Fix Time
                <AddIcon className={classes.rightIcon} />
              </Button>
            ) : null}

            {localStorage.getItem('role') === 'Administrator' ? (
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => {
                  this.setState({
                    open: true,
                    reset_time: true,
                    order_id: data.id,
                    dest_geo_in: data.dest_geo_in,
                    dest_geo_out: data.dest_geo_out,
                  });
                }}
              >
                Reset Time
                <ClearIcon className={classes.rightIcon} />
              </Button>
            ) : null}

            {/* {data.status === 'GPS_error' && localStorage.getItem('role') === 'Administrator'?
            <Button variant="contained" color="secondary" className={classes.button} 
              onClick = { () => {
                this.setState({
                  open: true,
                  updated_data: {
                    // required name statmp
                    origin_geo_in:"0",
                    origin_geo_out:"0",
                    return_in:null,
                    return_out:null,
                    dest_geo_in: new Array(data.destination.split("|").length).fill(0).join("|"),
                    dest_geo_out: new Array(data.destination.split("|").length).fill(0).join("|"),
                    updated_date: new Date(),
                    status: 'reset'
                  }
                })
                }
              }
            >
              Reset Time
              <RestoreIcon className={classes.rightIcon} />
            </Button>
          :null} */}

            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={() => {
                this.props.history.push('print', { id: data.id });
              }}
            >
              <PrintIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Print Preview
            </Button>

            {/* Send out report id & vehicle number & created_date & delivered_date */}
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={() => {
                this.props.history.push('report', { data });
              }}
            >
              <SearchIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Track Daily Record
            </Button>

            {(data.issuer === localStorage.getItem('username') ||
              localStorage.getItem('role') === 'admin') &&
              data.status !== 'confirm' ? (
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                onClick={() => {
                  this.props.history.push('editinvoice', { id: data.id });
                }}
              >
                <EditIcon
                  className={classNames(classes.leftIcon, classes.iconSmall)}
                />
                Edit
              </Button>
            ) : null}

            {localStorage.getItem('role') !== 'Administrator' ? (
              <Button
                variant="contained"
                size="small"
                disabled={data ? data.job_no === lastOrder : false}
                className={classes.button}
                onClick={() => this.next()}
              >
                Next
                <RightIcon className={classes.rightIcon} />
              </Button>
            ) : null}
          </Paper>
        </Grid>
        <Paper className={classes.root} elevation={1}>
          <Typography>
            {' '}
            Order status:{' '}
            <Chip
              label={data.status.replace('_', ' ')}
              key={data.status}
              color="primary"
            />
            <br />
            Updated date:{' '}
            {new moment(data.updated_date)
              .add(-7, 'hours')
              .toDate()
              .toLocaleString()}
            <br />
          </Typography>
          <Grid container style={{ justifyContent: 'center' }}>
            <Grid
              item
              xs={8}
              className={classes.box}
              style={{ textAlign: 'center' }}
            >
              <img
                src={data.company_logo}
                alt="no logo found"
                width="75px"
                style={{ float: 'left' }}
              />
              <b style={{ textAlign: 'top' }}>{data.company_name}</b>
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.box}
              style={{ justifyContent: 'end' }}
            >
              Job no. | ใบงานที่: {data.job_no}
            </Grid>
            <Grid item xs={8} className={classes.box}>
              Transporter | ขนส่ง: {data.supplier}
            </Grid>
            <Grid item xs={4} className={classes.box}>
              Date | วันที่:{' '}
              {new moment(data.created_date)
                .add(-7, 'hours')
                .toDate()
                .toLocaleString()}
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.box}
              style={{ justifyContent: 'end' }}
            >
              Invoice No.: {data.invoice_no}
            </Grid>
            <Grid item xs={4} className={classes.box}>
              Car Plate* | ทะเบียนรถ: {data.plate_no}
            </Grid>
            <Grid item xs={4} className={classes.box}>
              No. of trip | เที่ยวที่: {data.trip_no}
            </Grid>

            <TimeLine
              origin={data.origin}
              destination={data.destination ? data.destination.split('|') : []}
              origin_geo_in={data.origin_geo_in ? data.origin_geo_in : ''}
              origin_geo_out={data.origin_geo_out ? data.origin_geo_out : ''}
              dest_geo_in={data.dest_geo_in ? data.dest_geo_in.split('|') : []}
              dest_geo_out={
                data.dest_geo_out ? data.dest_geo_out.split('|') : []
              }
              return_in={data.return_in}
              return_out={data.return_out}
              will_return={data.will_return}
            />

            <Grid item xs={4} className={classes.box}>
              {' '}
              Return* | รับกลับ: {data.will_return ? '✔️' : '-'}
            </Grid>
            <Grid item xs={4} className={classes.box}>
              Overtime* | ล่วงเวลา: {data.over_time ? '✔️' : '-'}
            </Grid>
            <Grid item xs={4} className={classes.box}>
              Over Night | ค้างคืน*: {data.over_night ? '✔️' : '-'}
              <br />
              {data.over_night ? (
                <TextField
                  id="date"
                  label="Delivered date"
                  type="date"
                  value={new moment(data.delivered_date)
                    .toDate()
                    .toISOString()
                    .slice(0, 10)}
                  fullWidth
                  className={classes.textField}
                  InputProps={{
                    style: {
                      fontSize: 12,
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      zIndex: 0,
                    },
                  }}
                  name="delivered_date"
                  disabled
                />
              ) : null}
            </Grid>
            <Grid item xs={6} className={classes.box}>
              Product*:{' '}
              {data.products
                ? data.products.split('|').map((product) => {
                  if (product === 'Pallet') {
                    return (
                      <Chip
                        label={`Pallet [${data.num_pallet}]`}
                        key={product}
                        color="primary"
                      />
                    );
                  } else if (product === 'Rack') {
                    return (
                      <Chip
                        label={`Rack [${data.num_rack}]`}
                        key={product}
                        color="primary"
                      />
                    );
                  } else if (product === 'Dies') {
                    return (
                      <Chip
                        label={`Dies [${data.num_die}]`}
                        key={product}
                        color="primary"
                      />
                    );
                  } else if (product === 'Box') {
                    return (
                      <Chip
                        label={`Box [${data.num_box}]`}
                        key={product}
                        color="primary"
                      />
                    );
                  } else {
                    return (
                      <Chip label={product} key={product} color="primary" />
                    );
                  }
                })
                : []}
            </Grid>
            <Grid item xs={6} className={classes.box}>
              Seal Number: {data.seal_no} <br />
            </Grid>

            <Grid item xs={6} className={classes.box}>
              Department : {data.department} <br />
            </Grid>
            <Grid item xs={6} className={classes.box}>
              Delivery Type: {data.delivery_type} <br />
            </Grid>
            <Grid item xs={6} className={classes.box}>
              Type of car: {data.car_type}
            </Grid>
            <Grid item xs={6} className={classes.box}>
              Amount | ราคา: {data.price} Baht
            </Grid>
            <Grid item xs={12} className={classes.box}>
              Note:
              {data.note}
            </Grid>
            <Grid
              item
              xs={4}
              style={{ padding: 20, textAlign: 'center', marginBottom: 30 }}
              className={classes.box}
            >
              Driver Name | คนขับรถ: <br />
              {data.driver_name}
            </Grid>
            <Grid
              item
              xs={4}
              style={{ padding: 20, textAlign: 'center', marginBottom: 30 }}
              className={classes.box}
            >
              Issuer's name | ผู้สั่งงาน: <br /> <b>{data.issuer}</b>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ padding: 20, textAlign: 'center', marginBottom: 30 }}
              className={classes.box}
            >
              Checked by | ผู้ตรวจงาน: <br /> {data.checked_by}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
