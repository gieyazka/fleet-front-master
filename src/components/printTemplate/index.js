import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import TimeLine from './deliverTimeline';
import axios from 'axios';
import server from '../../config';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from "react-to-print";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '20cm',
    height: '100%',
    fontSize: 12
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  box: {
    border: 'solid',
    padding: 10,
    borderWidth: 0.25,
    borderColor: 'grey',
    boxSizing: "border-box",
  }
});

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

class PaperSheet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      company_logo: '',
      company_name: '',
      data: []
    }
  }

  componentWillMount() {
    axios.get(`${server.url}/orders/${this.props.history.location.state.id}`).then(res => {
      console.log(res.data);
      this.setState({
        data: res.data,
        company_logo: res.data.company_logo,
        company_name: res.data.company_name
      })
    })
  }

  render() {
    const { classes } = this.props;
    const { data, company_logo, company_name } = this.state;
    console.log(this.state);
    if (isEmpty(this.state.data)) {
      return (
        <div>
          <LinearProgress />
          <br />
          <LinearProgress color="secondary" />
        </div>
      )
    }
    return (
      <Grid container style={{ justifyContent: 'center', padding: 20 }} >

        <Paper className={classes.root} elevation={1}>

          <ReactToPrint
            trigger={() => <Button variant="contained" size="small" className={classes.button} onClick={() => { this.props.history.push('print', { id: data.id }) }}>
              <PrintIcon className={classes.iconSmall} />

            </Button>}
            content={() => this.componentRef}
          />
          <div ref={el => (this.componentRef = el)}>
            <Grid container style={{ justifyContent: 'center', padding: 20 }} >
              <Grid item xs={6} >
                <Typography> Order status: {data.status.replace('_', ' ')}
                </Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{ float: 'right' }}>
                  Updated date: {new moment(data.updated_date).add(-7, 'hours').toDate().toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={8} className={classes.box} style={{ textAlign: 'center' }}>
                <img src={company_logo} alt='no logo found' width='50px' style={{ float: 'left' }} />
                <b style={{ textAlign: 'top' }}>{company_name}</b>
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Job no. | ใบงานที่: {data.job_no}
              </Grid>
              <Grid item xs={8} className={classes.box}>
                Transporter | ขนส่ง: {data.supplier}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Date | วันที่: {new moment(data.created_date).add(-7, 'hours').toDate().toLocaleString()}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Invoice No.: {data.invoice_no}
              </Grid>
              <Grid item xs={4} className={classes.box} >
                Car Plate* |
                ทะเบียนรถ: {data.plate_no}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                No. of trip |
                เที่ยวที่: {data.trip_no}
              </Grid>

              <TimeLine origin={data.origin} destination={data.destination ? data.destination.split('|') : []}
                origin_geo_in={data.origin_geo_in ? data.origin_geo_in : ''}
                origin_geo_out={data.origin_geo_out ? data.origin_geo_out : ''}
                dest_geo_in={data.dest_geo_in ? data.dest_geo_in.split('|') : []}
                dest_geo_out={data.dest_geo_out ? data.dest_geo_out.split('|') : []}
                return_in={data.return_in}
                return_out={data.return_out}
                will_return={data.will_return}
              />

              <Grid item xs={4} className={classes.box}>Return* | รับกลับ: {' '}
                {data.will_return ? '✔️' : '-'}
              </Grid>
              <Grid item xs={4} className={classes.box}>Overtime* | ล่วงเวลา: {' '}
                {data.over_time ? '✔️' : '-'}
              </Grid>
              <Grid item xs={4} className={classes.box}>Over Night | ค้างคืน*: {' '}
                {data.over_night ? '✔️' : '-'}
              </Grid>

              <Grid item xs={6} className={classes.box}>Product*: {' '}
                {data.products ? data.products.split("|").map(product => {
                  if (product === 'Pallet') {
                    return <Chip label={`Pallet [${data.num_pallet}]`} key={product} color="primary" />
                  } else if (product === 'Rack') {
                    return <Chip label={`Rack [${data.num_rack}]`} key={product} color="primary" />
                  } else if (product === 'Dies') {
                    return <Chip label={`Dies [${data.num_die}]`} key={product} color="primary" />
                  } else if (product === 'Box') {
                    return <Chip label={`Box [${data.num_box}]`} key={product} color="primary" />
                  } else {
                    return <Chip label={product} key={product} color="primary" />
                  }
                }) : []
                }
              </Grid>
              <Grid item xs={6} className={classes.box}>
                Seal Number: {data.seal_no}
              </Grid>
              <Grid item xs={6} className={classes.box}>
                Type of car: {data.car_type}
              </Grid>
              <Grid item xs={6} className={classes.box}>
                {/* Amount | ราคา: { data.price} {' '} Baht */}

              </Grid>
              <Grid item xs={12} className={classes.box}>Note:
                {data.note}
              </Grid>
              <Grid item xs={4} style={{ padding: 20, textAlign: 'center', marginBottom: 30 }} className={classes.box}>
                Driver Name |
                คนขับรถ: <br /> {data.driver_name}
              </Grid>
              <Grid item xs={4} style={{ padding: 20, textAlign: 'center', marginBottom: 30 }} className={classes.box}>
                Issuer's name |
                ผู้สั่งงาน: <br /> {data.issuer}
              </Grid>
              <Grid item xs={4} style={{ padding: 20, textAlign: 'center', marginBottom: 30 }} className={classes.box}>
                Checked by |
                ผู้สั่งงาน: <br /> {data.checked_by}
              </Grid>

            </Grid>
            <Typography style={{ float: 'left', marginLeft: 10 }}><i> For factory only</i></Typography>
            <Divider variant="middle" style={{ margin: '20px 0px 0px 0px', borderTop: '4px dotted rgba(0, 0, 0, 0.98)' }} />
            <Typography style={{ float: 'right', marginRight: 10 }}><i> For driver only</i></Typography>

            <Grid container style={{ justifyContent: 'center', padding: 20 }}>
              <Grid item xs={8} className={classes.box} style={{ textAlign: 'center' }}>
                <img src={company_logo} alt='no logo found' width='50px' style={{ float: 'left' }} />
                <b style={{ textAlign: 'top' }}>{company_name}</b>
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Job no. | ใบงานที่: {data.job_no}
              </Grid>
              <Grid item xs={8} className={classes.box}>
                Transporter | ขนส่ง: {data.supplier}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Date | วันที่: {new moment(data.created_date).add(-7, 'hours').toDate().toLocaleString()}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                Invoice No.: {data.invoice_no}
              </Grid>
              <Grid item xs={4} className={classes.box} >
                Car Plate* |
                ทะเบียนรถ: {data.plate_no}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                No. of trip |
                เที่ยวที่: {data.trip_no}
              </Grid>

              <TimeLine origin={data.origin} destination={data.destination ? data.destination.split('|') : []}
                origin_geo_in={data.origin_geo_in ? data.origin_geo_in : ''}
                origin_geo_out={data.origin_geo_out ? data.origin_geo_out : ''}
                dest_geo_in={data.dest_geo_in ? data.dest_geo_in.split('|') : []}
                dest_geo_out={data.dest_geo_out ? data.dest_geo_out.split('|') : []}
                return_in={data.return_in}
                return_out={data.return_out}
                will_return={data.will_return}
              />

              <Grid item xs={4} className={classes.box}>Return* | รับกลับ: {' '}
                {data.will_return ? '✔️' : '-'}
              </Grid>
              <Grid item xs={4} className={classes.box}>Overtime* | ล่วงเวลา: {' '}
                {data.over_time ? '✔️' : '-'}
              </Grid>
              <Grid item xs={4} className={classes.box}>Over Night | ค้างคืน*: {' '}
                {data.over_night ? '✔️' : '-'}
              </Grid>

              <Grid item xs={4} style={{ padding: 20, textAlign: 'center' }} className={classes.box}>
                Driver Name |
                คนขับรถ: <br /> {data.driver_name}
              </Grid>
              <Grid item xs={4} style={{ padding: 20, textAlign: 'center' }} className={classes.box}>
                Issuer's name |
                ผู้สั่งงาน: <br /> {data.issuer}
              </Grid>
              <Grid item xs={4} style={{ padding: 20, textAlign: 'center' }} className={classes.box}>
                Checked by |
                ผู้สั่งงาน: <br /> {data.checked_by}
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Grid>
    );
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
