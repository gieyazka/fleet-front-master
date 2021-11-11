import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import FiberNewIcon from '@material-ui/icons/FiberNew';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import server from '../../config';
import axios from 'axios';
// import { promises } from 'fs';
import ListSelect from './listSelect';
import Table from './table';
import moment from 'moment';

var options = { year: '2-digit', month: '2-digit', day: '2-digit' };

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'center',
    marginBottom: '10px',
    marginTop: '10px',
    width: '80%'
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  searchBox:{
      margin: '10px'
  }
});

// load available data from server
const status = [
    {"label": 'new',
    "id": 'status'},
    {"label": 'GPS_error',
    "id": 'status'},
    {"label": 'match',
    "id": 'status'},
    {"label": 'confirm',
    "id": 'status'},
    {"label": 'void',
    "id": 'status'},
    {"label": 'delivering',
    "id": 'status'}].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
    id: suggestion.id
}));

class PaperSheet extends Component  {
    state = {
        status: '',
        supplier: '',
        start_date: new moment().add(0, 'hours').toDate().toISOString().slice(0,10),
        end_date: new moment().add(0, 'hours').toDate().toISOString().slice(0,10),
        plate_no: '',
        destination: '',
        job_no:'',
        suppliers :[],
        plate_nos :[],
        destinations :[],
        data : [],
        isClear: false,
        loading: true
    };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /** Component will mount */
  componentWillMount = async () => {
    // load supplier two conditions if companyID exist
    
    var suppliers;
    if (localStorage.getItem('companyID')==='undefined'  || localStorage.getItem('companyID') === "null"){
        suppliers = axios.get(`${server.url}/suppliers?${"id=" + localStorage.getItem('supplierID')}`).then(res => res.data.map(result => { 
            return {label: result.name, id:"supplier"}}));
        
    } else {
        suppliers = axios.get(`${server.url}/companies?id=${localStorage.getItem('companyID')}`).then( res => res.data[0].supplier.map(result => {
            console.log(result);
            return {label: result.name, id:"supplier"}}));
    }
    //  for poi and vehicle
    const appList = [];
    const supplier = []; 
    var company_name =null;
    var pois = [];
    var vehicles  = [];
    
    //  tow conditions as above
    if (localStorage.getItem('companyID')==='undefined' || localStorage.getItem('companyID') === "null"){
        await axios.get(`${server.url}/suppliers?${"id=" + localStorage.getItem('supplierID')}`).then(async res => res.data.map(async result => {
            supplier.push(result.name);
            appList.push(result.appid)
        }));
        
        console.log(suppliers);
        pois = axios.get(`${server.url}/pois?_sort=name:DESC&_limit=1000&appid=${appList.join('&appid=')}`).then(res => res.data.map(result => { return {label: result.name, id:"poi"}}))
        vehicles = axios.get(`${server.url}/vehicles?_sort=plate_no:DESC&_limit=1000&appid=${appList.join('&appid=')}`).then(res => res.data.map(result => { return {label: result.plate_no, id:"vehicle"}}));
     
    } else {
        await axios.get(`${server.url}/companies?id=${localStorage.getItem('companyID')}`).then(async res => {
            res.data[0].supplier.map(async result => {
                supplier.push(result.name);
                appList.push(result.appid); 
            })
            company_name = res.data[0].abbr;
        });
        pois = axios.get(`${server.url}/pois?company_name_contains=${company_name}&_sort=name:DESC&_limit=1000&appid=${appList.join('&appid=')}`).then(res => res.data.map(result => { return {label: result.name, id:"poi"}}))
        vehicles = axios.get(`${server.url}/vehicles?company_name_contains=${company_name}&_sort=plate_no:DESC&_limit=1000&appid=${appList.join('&appid=')}`).then(res => res.data.map(result => { return {label: result.plate_no, id:"vehicle"}}));
        
    }
     
     Promise.all([suppliers]).then(result => {
        this.setState({
            suppliers: result[0],
        })
     }).then(()=>{
        axios.get(`${server.url}/orders?created_date_gt=${new moment().add(0, 'hours').toDate().toISOString().slice(0,10)}${localStorage.getItem('companyID')==='undefined' || localStorage.getItem('companyID')==='null'?"&supplier="+supplier.join('&supplier='):"&company_id="+localStorage.getItem('companyID')}&_sort=created_date:DESC`).then(res=>{
            console.log(res.data);
            this.setState({
                data: res.data,
                loading: false
            })
        });  
    });

    Promise.all([pois, vehicles]).then(result => {
        console.log(result);
        this.setState({
            destinations: Object.values(result[0].reduce((acc,cur)=>Object.assign(acc ,{[cur.label]:cur}),{})),
            plate_nos: result[1]
        })
     });

  }
  
  onUpdate = (val) => {
      this.setState({
          isClear: false
      });
      console.log(val);
      switch (val[0].id){
        case 'status':
            let statusState = val[0].value===''?'':val.map(res => res.value);
            this.setState({
                status: statusState
            })
            break;
        case 'vehicle':
            let vehState = val[0].value===''?'':val.map(res => res.value);
            this.setState({
                plate_no: vehState
            })
            break;
        case 'poi':
            let poiState = val[0].value===''?'':val.map(res => res.value);
            this.setState({
                destination: poiState
            })
            break;
        case 'supplier':
            let supState = val[0].value===''?'':val.map(res => res.value);
            this.setState({
                supplier: supState
            })
            break
        default:
            return null;
      }

  };

  /** Submit query to server*/
  handleSubmit () {
    // create query word
    const q_job = this.state.job_no?`job_no=${this.state.job_no}`:'';
    var q_start_date = '';
    var q_end_date = '';
    // if (this.state.start_date === this.state.end_date){
    //     q_start_date = `created_date_gte=${moment(this.state.start_date).startOf('day')}`;
    //     q_end_date = '';
    // } else {
    q_start_date = `created_date_gte=${moment(this.state.start_date).startOf('day')}`;
    q_end_date = `created_date_lte=${moment(this.state.end_date).endOf('day')}`;
    // }
    const q_status = this.state.status?(
        this.state.status.map(result => `status=${result}&`)
    ).join(''):'';
    const q_supplier = this.state.supplier?(
        this.state.supplier.map(result => `supplier=${result}&`)
    ).join(''):'';
    const q_plate_no = this.state.plate_no?(
        this.state.plate_no.map(result => `plate_no=${result}&`)
    ).join(''):'';
    const q_destination = this.state.destination?(
        this.state.destination.map(result => `destination_containss=${result}&`)
    ).join(''):'';

    const fix_query = localStorage.getItem('companyID')==='undefined' || localStorage.getItem('companyID')==='null'?"&supplier="+this.state.suppliers[0].label:"company_id="+localStorage.getItem('companyID');
    /** Included compnay ID from user */
    const all_query = q_destination + q_plate_no + q_status + q_supplier + q_job + '&' + q_start_date + '&' + q_end_date + '&' + fix_query + '&_limit=1000000'; 

    console.log(all_query);
    this.setState({
        loading: true
    })
    axios.get(`${server.url}/orders?${all_query}&_sort=created_date:DESC`).then(res => {
        console.log(res);
        this.setState({
            data: res.data,
            loading: false
        })
    })
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
    console.log(this.state);
    // if (this.state.loading) {
    //     return (
    //       <div>
    //         <LinearProgress />
    //         <br />
    //         <LinearProgress color="secondary" />
    //       </div>
    //     )
    // } 
    return (
        <Grid container style={{justifyContent: 'center'}}>
            {/* serach panel */}
        <Paper className={classes.root} elevation={1}>
            <Typography variant="h5" component="h3">
            Orders search
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
                <Grid container style={{justifyContent: 'center'}}>
                    <Grid item xs={2} className={classes.searchBox} >
                            <TextField
                            id="standard-number"
                            label="Job No."
                            value={this.state.job_no}
                            onChange={this.handleChange('job_no')}
                            type="text"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid xs={4} className={classes.searchBox} item>
                        <TextField
                            id="date"
                            label="Start Date"
                            type="date"
                            // defaultValue={new Date().toISOString().slice(0,10)}
                            value = {this.state.start_date}
                            className={classes.textField}
                            onChange={this.handleChange('start_date')}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid xs={4} className={classes.searchBox} item>
                        <TextField
                            id="date"
                            label="End Date"
                            type="date"
                            // defaultValue={new Date().toISOString().slice(0,10)}
                            className={classes.textField}
                            value = {this.state.end_date}
                            onChange={this.handleChange('end_date')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container style={{justifyContent: 'center'}}>
                    <Grid item xs = {2}>
                        <ListSelect inputs={status} placeholder={'select status'}
                            onUpdate={this.onUpdate} clear={this.state.isClear}/>
                    </Grid>
                    <Grid item xs = {3}>
                        <ListSelect inputs={this.state.suppliers} placeholder={'select suppliers'}
                            onUpdate={this.onUpdate} clear={this.state.isClear}/>
                    </Grid>
                    <Grid item xs = {3}>
                        <ListSelect inputs={this.state.plate_nos} placeholder={'select vehicles'}
                            onUpdate={this.onUpdate} clear={this.state.isClear}/>
                    </Grid>
                    <Grid item xs = {4}>
                        <ListSelect inputs={this.state.destinations} placeholder={'select destinations'} 
                            onUpdate={this.onUpdate} clear={this.state.isClear}/>
                    </Grid>
                </Grid>
            </form>
            <Button variant="contained" color="primary" className={classes.button} onClick={()=> this.handleSubmit()}>
                Search
                {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                <SearchIcon className={classes.rightIcon} />
            </Button>
            <Button variant="contained" color="default" className={classes.button} onClick = {()=>{
                this.setState({
                    status: '',
                    supplier: '',
                    start_date: new moment().add(0, 'hours').toDate().toISOString().slice(0,10),
                    end_date: new moment().add(0, 'hours').toDate().toISOString().slice(0,10),
                    plate_no: '',
                    destination: '',
                    job_no:'',
                    isClear:true
                })
            }}>
                Clear Filter
                <DeleteIcon className={classes.rightIcon} />
            </Button>
            
            {localStorage.getItem('role') === 'supplier' || localStorage.getItem('role') === 'purchaser'? 
            null:<Button variant="contained" color="primary" className={classes.button} onClick={()=> 
                this.props.history.push('addinvoice')}>
                New Order
                {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                <FiberNewIcon className={classes.rightIcon} />
            </Button>
            }
        </Paper>
        
        {/* table result */}
        <Paper className={classes.root} elevation={1} >
            {(!this.state.loading)?
                    <Table data = {this.state.data} history={this.props.history} startDate = {this.state.start_date} endDate = {this.state.end_date}/>
            :<LinearProgress color="secondary" />}
        </Paper>
        </Grid>
    );
    }
};

export default withStyles(styles)(PaperSheet);