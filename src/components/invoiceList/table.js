import React from "react";
import { Link } from 'react-router-dom';
import { Logo, Tips } from "../../utils/util";
import matchSorter from 'match-sorter'

import classNames from 'classnames';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DoubleScrollbar from 'react-double-scrollbar';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import DeleteIcon from '@material-ui/icons/Delete';
import {CSVLink} from "react-csv";
import DownloadButton from "./downloadButton";
import moment from 'moment';
import axios from 'axios';
import server from '../../config';


import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

// excel export
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

var options = { year: '2-digit', month: '2-digit', day: '2-digit' };

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
  
export const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
  
class LoginStatus extends React.Component {
  constructor(props) {
    super(props);
    this.download = this.download.bind(this);
    this.state = {
      data: props.data,
      dataToDownload: [],
      selectExport: '',  
      open: false,
      deleteRow: null,
      snackbar_open: false,
      alert: ''
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };
  
  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar_open: false });
  };

  chipColor = (status) => {
    switch (status) {
        case 'new':
            return {
                backgroundColor: '#777777',
                color: 'white'
            };
        case 'delivering':
            return {backgroundColor: '#F0AD4E',
            color: 'white'};
        case 'confirm':
            return {backgroundColor: '#5CB85C',
            color: 'white'};
        case 'match':
            return {backgroundColor: '#5BC0DE',
            color: 'white'};
        default:
        return {backgroundColor: '#C90D0D',
        color: 'white'};
    }
  }

  columns= [
    {
        Header: 'View',
        accessor: 'id',
        Cell: row => (
            row.row.company_name === 'AAPICO PLASTIC CO., LTD'?
                <Link target="_blank"
                    to={{
                        pathname: "/viewinvoiceAP",
                        search: row.value
                    }}>
                    <IconButton aria-label="View" color="primary" style={{
                        margin: 0,
                        padding: 0
                    }}>
                        <EyeIcon />
                    </IconButton>
                </Link>
                :
                <Link target="_blank"
                    to={{
                        pathname: "/viewinvoice",
                        search: row.value
                    }}>
                    <IconButton aria-label="View" color="primary" style={{
                        margin: 0,
                        padding: 0
                    }}>
                        <EyeIcon />
                </IconButton>
                </Link>
        ),
        filterable: false,
        width: 60
    },
    {
        Header: 'Factory',
        accessor: 'company_name',
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["company_name"] }),
        filterAll: true
    }, {
        Header: 'Job No.',
        accessor: 'job_no',
        width: 60
    }, {
        Header: 'Order date',
        id: 'timestamp',
        accessor: 'created_date',
        Cell: row => (
            <span> {new moment(row.value).add(-7, 'hours').toDate().toLocaleDateString('en-GB', options).replace(/[/]/g, '-')}
            <br />
            {new moment(row.value).add(-7, 'hours').toDate().toLocaleTimeString()}
            </span>
            ),
        filterable: false,
        width: 100
    },  {
        Header: 'Origin',
        accessor: 'origin',
        Cell: row => (
            <span>
            {row.value.split("|").map(val => 
                (
                <Chip label={val} key={val} color='primary'/>
                )
            )}
            </span>
        ),
        filterable: true
    }, 
    {
        Header: 'Destination',
        accessor: 'destination',
        Cell: row => (
            <span>
            {row.value.split("|").map(val => 
                (
                <Chip label={val} key={val} color="primary"/>
                )
            )}
            </span>
        ),
        filterable: true
    }, {
        Header: 'Vehicle',
        accessor: 'plate_no',
        filterable: true,
        width: 100
    }, {
        Header: 'Trip',
        accessor: 'trip_no',
        filterable: false,
        width: 60
    }, {
        Header: 'Return',
        accessor: 'will_return',
        Cell: row => (
            <span>
                {
                row.value ? '✔️': ''
                }
            </span>
        ),
        filterable: false,
        width: 60
    }, {
        Header: 'Status',
        accessor: 'status',
        Cell: row => (
            <span>
            {
            <Chip label={row.value.replace('_', ' ')} key={row.value} style={this.chipColor(row.value)} />
            }
            </span>
        ),
        filterable: false,
        width: 100
    }, 
    // {
    //     Header: 'Supplier',
    //     accessor: 'supplier',
    //     filterable: false
    // },
     {

        Header: 'Driver',
        accessor: 'driver_name',
        filterable: false,
        width: 60
    }, {
        Header: 'Delete',
        accessor: 'issuer',
        Cell: row => (
            <IconButton aria-label="View" color="primary" style={{
                margin: 0,
                padding: 0
            }}>
                {(row.value === localStorage.getItem('username') && row.row.status !== 'confirm' )?<DeleteIcon 
                onClick ={ () =>
                    this.setState({
                        deleteRow: row,
                        open: true
                    })
                }
                />:null}
                {/* TODO delete button */}
            </IconButton>
        ),
        filterable: false,
        width: 60
    }];

    pad_array = (arr,len,fill) => {
        return arr.concat(Array(len).fill(fill)).slice(0,len);
    }

    download = async (event) => {

    // get data from state instead 
    // click on download button
    // show supplier available to download
    // prepared data based on selected supplier

    // csv format

    const sortedDataBeforeExport = this.state.data.sort((a, b) => parseFloat(a.job_no) - parseFloat(b.job_no));
    console.log(sortedDataBeforeExport);
    const toDownload = [];
    var n=0;
    for (let i=0; i<sortedDataBeforeExport.length; i++){
        if (this.state.selectExport === sortedDataBeforeExport[i].supplier){
            n = n + 1;
            // create products
            let productList = sortedDataBeforeExport[i].products.split("|");
            var finalProducts = '';
            var invoices = '';
            if (sortedDataBeforeExport[i].company_name !== 'AAPICO PLASTIC CO., LTD'){
                for (let j=0; j<productList.length; j++){
                    console.log(sortedDataBeforeExport[i])
                    if (productList[j] === 'Pallet'){
                        console.log(sortedDataBeforeExport[i].num_pallet);
                        finalProducts += `Pallet (${sortedDataBeforeExport[i].num_pallet}),`;
                    } else if (productList[j] === 'Rack'){
                        finalProducts += `Rack (${sortedDataBeforeExport[i].num_rack}),`
                    } else if (productList[j] === 'Box'){
                        console.log(sortedDataBeforeExport[i].num_box);
                        finalProducts += `Box (${sortedDataBeforeExport[i].num_box}),`
                    } else if (productList[j] === 'Dies'){
                        finalProducts += `Dies (${sortedDataBeforeExport[i].num_die}),`
                    } else {
                        finalProducts += productList[j];
                    }
                }
                invoices = sortedDataBeforeExport[i].invoice_no;
            } else {
                finalProducts = sortedDataBeforeExport[i].products_ap.replace(/\n/g, '|');
                invoices = sortedDataBeforeExport[i].invoices_out_ap.replace(/\n/g, '|');
            }
            console.log(finalProducts);
            console.log(sortedDataBeforeExport[i].trip_no);
            var toPush = {
                '#': n,
                'Factory': sortedDataBeforeExport[i].company_name,
                'Suppiler': sortedDataBeforeExport[i].supplier,
                'Invoice Number': invoices,
                'Job No': sortedDataBeforeExport[i].job_no,
                'Date Submit': new moment(sortedDataBeforeExport[i].created_date).add(-7, 'hours').toDate().toLocaleDateString('en-GB', options).replace(/[/]/g, '-'),
                'Origin': sortedDataBeforeExport[i].origin,
                'Des 1': sortedDataBeforeExport[i].destination.split("|")[0],
                'Des 2': sortedDataBeforeExport[i].destination.split("|")[1],	
                'Des 3': sortedDataBeforeExport[i].destination.split("|")[2],
                'Des 4': sortedDataBeforeExport[i].destination.split("|")[3],
                'Des 5': sortedDataBeforeExport[i].destination.split("|")[4],
                'Des 6': sortedDataBeforeExport[i].destination.split("|")[5],
                'Des 7': sortedDataBeforeExport[i].destination.split("|")[6],	
                'Overnight': sortedDataBeforeExport[i].over_night?'Yes':'',	
                'Del Date':	sortedDataBeforeExport[i].delivered_date?new moment(sortedDataBeforeExport[i].delivered_date).add(-7, 'hours').toDate().toLocaleDateString('en-GB', options).replace(/[/]/g, '-'):'',  
                'Product': finalProducts,
                'Note':	sortedDataBeforeExport[i].note,
                'Return': sortedDataBeforeExport[i].will_return?'Return':'',	
                'Overtime':	sortedDataBeforeExport[i].over_time?'Overtime':'',
                'Department': 	sortedDataBeforeExport[i].department !== ': '?sortedDataBeforeExport[i].department:'',
                'Delivery type': sortedDataBeforeExport[i].delivery_type !== 'special'?'':sortedDataBeforeExport[i].delivery_type,
                'No of trip':	sortedDataBeforeExport[i].trip_no,
                'Driver name': /\d/.test(sortedDataBeforeExport[i].driver_name)?'driver not register':sortedDataBeforeExport[i].driver_name,
                'Truck Plate': sortedDataBeforeExport[i].plate_no,	
                'Truck Type': sortedDataBeforeExport[i].car_type.replace('-u', 'u').replace('-', ' ').toUpperCase(),
                'Total Price':	sortedDataBeforeExport[i].price,
                'Ori - In':	sortedDataBeforeExport[i].origin_geo_in!=='0'?new moment(sortedDataBeforeExport[i].origin_geo_in).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Ori - Out': sortedDataBeforeExport[i].origin_geo_out!=='0'?new moment(sortedDataBeforeExport[i].origin_geo_out).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Des1 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[0]!=='0'?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[0]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Des1 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[0]!=='0'?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[0]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Des2 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[1]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[1]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[1]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des2 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[1]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[1]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[1]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des3 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[2]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[2]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[2]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des3 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[2]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[2]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[2]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des4 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[3]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[3]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[3]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des4 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[3]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[3]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[3]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des5 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[4]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[4]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[4]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des5 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[4]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[4]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[4]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des6 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[5]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[5]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[5]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des6 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[5]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[5]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[5]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des7 - In': sortedDataBeforeExport[i].dest_geo_in.split("|")[6]!=='0'?sortedDataBeforeExport[i].dest_geo_in.split("|")[6]?new moment(sortedDataBeforeExport[i].dest_geo_in.split("|")[6]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Des7 - Out': sortedDataBeforeExport[i].dest_geo_out.split("|")[6]!=='0'?sortedDataBeforeExport[i].dest_geo_out.split("|")[6]?new moment(sortedDataBeforeExport[i].dest_geo_out.split("|")[6]).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'':'',
                'Return-In': sortedDataBeforeExport[i].return_in !=='0'?new moment(sortedDataBeforeExport[i].return_in).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Return-Out': sortedDataBeforeExport[i].return_out !=='0'?new moment(sortedDataBeforeExport[i].return_out).add(0, 'hours').toDate().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}):'',
                'Name List For Signature of Job': sortedDataBeforeExport[i].issuer,
                'Auditor':	sortedDataBeforeExport[i].checked_by,
                'Seal Number':	sortedDataBeforeExport[i].seal_no,
                'Delivery Status': sortedDataBeforeExport[i].status.replace('_', ' '),
                'Transportation Description': `${sortedDataBeforeExport[i].company_name}-${sortedDataBeforeExport[i].supplier}-${sortedDataBeforeExport[i].car_type.toUpperCase().replace("-"," ")}-${sortedDataBeforeExport[i].origin}-${this.pad_array(sortedDataBeforeExport[i].destination.split("|").filter((obj) => obj ),7,"").join("-")}-${sortedDataBeforeExport[i].onReturn?"Return-":"-"}${sortedDataBeforeExport[i].onOvertime?"Overtime":""}`
               };
            
            if (sortedDataBeforeExport[i].company_name !== 'AAPICO PLASTIC CO., LTD'){
                toDownload.push(toPush);
            } else {
                delete toPush['Total Price'];
                toPush['Trip Price']= sortedDataBeforeExport[i].price_trip;
                toPush['Toll Price']=sortedDataBeforeExport[i].price_toll;
                toPush['Other Price']= sortedDataBeforeExport[i].price_other;
                toPush['Total Price']= parseInt(sortedDataBeforeExport[i].price_trip)||0 + parseInt(sortedDataBeforeExport[i].price_toll)||0+ parseInt(sortedDataBeforeExport[i].price_other)||0;
                toDownload.push(toPush); 
            }
        };
    };
    
    
    //* parse excel data
    var excelData = [{
        ySteps: -1,
        columns: [],
        data: []
    }];
    var keys = Object.keys(toDownload[0]);
    excelData[0].data[0] = [];
    for (var k in keys){
        excelData[0].data[0].push({
            value: keys[k],
            style:{
                font: {sz: 10, name: 'Arial', bold: true},
                fill: {patternType: "solid", fgColor: {rgb: "C0C0C0"}}, 
                border:{left: {style: 'medium'}, right: {style: 'medium'}, bottom: {style: 'medium'}, top: {style: 'medium'}} 
            }
        })
    }
    var m = 0;
    for (var l in toDownload){
        var i = parseInt(l);
        m = m+1;
        excelData[0].data[m] = [];
        for (var j in toDownload[i]){
            // if return then green color highlight
            if (toDownload[i][j] === 'Return'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "008000"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
                })
            } else if (toDownload[i][j] === 'confirm'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "5CB85C"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
            }) 
            } else if (toDownload[i][j] === 'new'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "777777"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
            }) 
            } else if (toDownload[i][j] === 'delivering'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "F0AD4E"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
            }) 
            } else if (toDownload[i][j] === 'GPS error'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "C90D0D"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
            }) 
            } else if (toDownload[i][j] === 'match'){
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        fill: {patternType: "solid", fgColor: {rgb: "5BC0DE"}}, 
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} }
            }) 
            } else {
                excelData[0].data[m].push({
                    value: toDownload[i][j]?toDownload[i][j].toString():'',
                    style:{
                        font: {sz: 10, name: 'Arial'},
                        border:{left: {style: 'medium'}, right: {style: 'medium'}} 
                    }
                })
            } 
        }
    } 
    console.log(toDownload);
    console.log(excelData[0]);
    this.setState({
        excelData
    })
    
    // const currentRecords = this.reactTable.getResolvedState().sortedData;

    // var data_to_download = []
    // for (var index = 0; index < currentRecords.length; index++) {
    //     let record_to_download = {}
    //     for(var colIndex = 0; colIndex < this.columns.length ; colIndex ++) {
    //         record_to_download[this.columns[colIndex].Header] = currentRecords[index][this.columns[colIndex].accessor]
    //     }
    //     data_to_download.push(record_to_download)

    // }
    // console.log(data_to_download);
    // console.log(toDownload);
    // this.setState({ dataToDownload: toDownload }, () => {
    //     // click the CSVLink component to trigger the CSV download
    //     this.csvLink.link.click()
    // })
  } 


  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  } 

  onUpdate = (val) => {
      console.log(val);
      if (val){
        this.setState({
            selectExport: val
        }, this.download)
    }
  }

  render() {
    console.log(this.props.data);
    console.log(MySnackbarContentWrapper);
    console.log(this.state);
    const filename = this.state.selectExport + '-' +  this.props.startDate + '-' + this.props.endDate + '.csv'
    const distinct = [...new Set(this.state.data.map(x=> x.supplier))];
    return (
        <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.snackbar_open}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant="success"
            message={this.state.alert}
          />
        </Snackbar>

        {this.state.deleteRow?
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"ยืนยันการลบใบงาน?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            คุณแน่ใจว่าต้องการลบใบงานนี้?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              ไม่ใช่
            </Button>
            <Button onClick={ () => {
                    const that = this;
                    axios.delete(`${server.url}/orders/${this.state.deleteRow.row.id}`).then(res => {
                            that.setState({
                                alert: 'successfully deleted',
                                snackbar_open: true,
                                open: false
                            });
                        }).then(()=>{
                            // this.props.history.push('invoicelist');
                            this.setState(state => {
                                const data = state.data.filter((item, j) => this.state.deleteRow.index !== j);
                                console.log(data);
                                return {
                                  data,
                                };
                            });
                        });
                    }
                } color="primary" autoFocus>
              ใช่
            </Button>
          </DialogActions>
        </Dialog>:null} 

        <div>
            {/* require to get list of available suppiler */}
            {/* ['NAKBURIN LIMITED PARTNERSHIP', 'NAMO LOGISTICS Co., Ltd', 'Konsortium Co., Ltd.'] */}
            <DownloadButton emails = {distinct} onUpdate={this.onUpdate} />
            {this.state.excelData?
            <ExcelFile element={<button>Download Data With Styles</button>} hideElement filename={filename}>
                <ExcelSheet dataSet={this.state.excelData} name={this.state.selectExport}/>
            </ExcelFile>:null}
        </div>
        <div>
            <CSVLink
                data={this.state.dataToDownload}
                filename={filename}
                className="hidden"
                ref={(r) => this.csvLink = r}
                target="_blank"/>

        </div>
        <div>
        <DoubleScrollbar>
            <ReactTable
            ref={(r) => {
                this.reactTable = r;
            }}
            data={this.state.data}
            filterable
            defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value}
            columns = {[{
                    Header: `Search results`,
                    columns: this.columns
            }]}
                    defaultSorted={[
                        {
                        id: "timestamp",
                        desc: true
                        }
                    ]}       
                    defaultPageSize={50}
                    className="-striped -highlight"
            />
            {/* <br />
            <Tips />
            <Logo /> */}
        </DoubleScrollbar>
        </div>
    </div>
    );
  }
}

export default LoginStatus;