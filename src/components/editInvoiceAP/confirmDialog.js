import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import TimeLine from './deliverTimeline';
import axios from 'axios';
import server from '../../config';
import moment from 'moment';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    root: {
      minWidth: '700px',
      maxWidth: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
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
    
  handleClose = () => {
    this.setState({ open: false });
    this.props.onUpdateState(false);
  };
  

  handleSubmit = (data) => {
    this.setState({ open: false });
    this.props.onUpdateState(false);
    /** use put method for confirmed updated */
    axios.put(`${server.url}/orders/${this.props.orderid}`, data).then(res => {
      console.log(res);
      alert('Updated Data successfully');

      /** Resettime here */
      
      axios.post(`${server.url}/orders/resettime`, {order_id: this.props.orderid,
        dest_geo_in: data.destination, dest_geo_out: data.destination
      });

    }).then(()=> {
      this.props.history.push('invoicelist')
    })
 };
      
  render() {
    console.log(this.props);
    const {classes} = this.props;

    return (
      <div>
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
                            <TableCell >{this.props.data.created_date?new moment(this.props.data.created_date).toDate().toLocaleString():''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Invoice</b>
                            </TableCell>
                            <TableCell >{this.props.data.invoice_no}</TableCell>
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