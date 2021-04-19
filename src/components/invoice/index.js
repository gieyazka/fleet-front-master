import React from "react"; 
import classNames from 'classnames';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { Paper, Grid, Button, TextField, 
  LinearProgress, Checkbox, FormGroup ,Switch, FormControlLabel,
  IconButton  } from "@material-ui/core";

import VehicleSelect from './vehicleSelect';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import server from '../../config';
import ConfirmDialog from './confirmDialog';
import axios from 'axios';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import moment from 'moment';

import {AddInvoiceAP} from '../../containers/index';

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

const styles = theme => ({
  container: {
    textAlign: "flex-start", 
    margin: 'auto',
    marginBottom: 20, 
    padding: 20,
    width: window.innerWidth <= 1024? '95%': '60%',
    height: '100%'
  },
  paper: {
    padding: theme.spacing.unit*2,
    textAlign: "flext-start",
    alignContent: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    height: '100%',
    // marginBottom: theme.spacing.unit,
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
  },
  boxButton: {
    alignContent: "flex-start", 
    border: 'solid',
    padding: 10,
    borderWidth: 0.25,
    borderColor: 'grey',
    boxSizing: "border-box"
  },
  textField:{

  },
  textField_number:{
    height: '100%',
    width: 150,
    marginRight: 10,
    marginTop: 10
  },
  formControl: {
    margin: 2,
    borderWidth: 1,
    borderStyle: 'groove',
    borderRadius: 5,
    padding: 10
  }
});

class  CSSGrid extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      
      alert:'',
      onReturn: false,
      onOvertime: false,
      onOverNight: false,
      pallet: true,
      rack: false,
      dies: false,   
      box: false, 
      product_note: '',
      seal_no: '',
      vehicle:'',
      origin: '',
      destination: [null],
      issuer_name:'',
      origin_geo_in:"0",
      origin_geo_out:"0",
      dest_geo_in: '',
      dest_geo_out: '',
      car_type: '',
      price: '',
      note: '',
      job_no: '',
      invoice_no: '',
      supplier:'',
      delivered_date: '',
      submitData: {},
      num_pallet: '',
      num_die: '',
      num_rack: '',
      num_box: '',
      department: 'PC',
      delivery_type: 'normal',
      department_note: '',

      loading: true,
      multiline: '',
      company_logo:'',
      company_name:'',
      suppliers:'',
      pois:[],
      vehicles:[],
      inputLinkClicked: [1],
      showDialog: false,
      trip_no: '',
      process: 'later',
      order_type: 'local'
    };
  }

  handleChange = name => event => {
    if (name === 'onOverNight'){
      this.setState({ delivered_date: new moment().add(1, 'days').toDate().toISOString().slice(0,10)});
    }
    this.setState({ [name]: event.target.checked }, this.getDeliverCost);
  };

  handleChangeName = event => {
    if (event.target.name === 'delivered_date'){
      if (new moment(event.target.value) < new moment()){
          this.setState({
            alert: 'ไม่สามารถตั้งค่าก่อนวันที่สร้างใบส่งของ',
            snackbar_open: true,
            delivered_date: new moment().add(1, 'days').toDate().toISOString().slice(0,10)
        });
      } else {    
        if (!moment(event.target.value).isValid()){
          this.setState({
            alert: 'วันที่ส่งผลิตภัณฑ์ไม่ถูกต้อง',
            snackbar_open: true,
            delivered_date: this.state.delivered_date
          });
        } else {
          this.setState({ delivered_date: event.target.value });
        }
      }
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  handleSubmit () {
    let products = [];
    if (this.state.pallet){
      products.push('Pallet')
    } 
    if (this.state.rack){
      products.push('Rack')
    } 
    if (this.state.dies){
      products.push('Dies')
    } 
    if (this.state.box){
      products.push('Box')
    }  
    if (this.state.product_note){
      products.push(...this.state.product_note.split(','))
    }

    /** Parse data to submit */
    if (!this.state.vehicle){
      // alert('Plate_no is missing')
      this.setState({
          alert: 'ไม่ได้กรอก Plate Number',
          snackbar_open: true
      });
    } else if (products.length === 0){
      // alert('Product is missing')
      this.setState({
        alert: 'ไม่ได้กรอกสินค้า',
        snackbar_open: true
      });
    } else if (this.state.invoice_no === '') {
      // alert('Invoice number is missing')
      this.setState({
          alert: 'ไม่ได้กรอก Invoice Number',
          snackbar_open: true
      });
    } else if (!this.state.origin){
      // alert('Please specfic origin of delivery')
      this.setState({
        alert: 'ไม่ได้กรอก origin of delivery',
        snackbar_open: true
      });
    } else if (this.state.destination.length === 0 || this.state.destination.includes(null)){
      // alert('Please specfic destination of delivery')
      this.setState({
        alert: 'ไม่ได้กรอก destination of delivery',
        snackbar_open: true
      });
    } else if (this.state.destination.includes(this.state.origin)){
      // alert('origin and destination cannot be same');
      this.setState({
        alert: 'Origin and destination ต้องไม่เหมือนกัน',
        snackbar_open: true
      });
    } else {
        const {
        job_no, invoice_no, supplier, vehicle:plate_no, origin, destination, onReturn:will_return, onOverNight: over_night, 
        onOvertime: over_time, seal_no, car_type, note, price,issuer_name:issuer, delivered_date, company_logo, company_name,
        department, department_note, delivery_type, num_box, num_die, num_pallet, num_rack, trip_no, process, order_type
      } = this.state;
      // initial empty array for dest_geo_in & out
      const dest_geo_in = Array(destination.length).fill(0).join("|");
      const dest_geo_out = dest_geo_in;
      let data = {
        job_no,invoice_no, supplier, plate_no, origin, destination: destination.join("|"), 
        will_return, over_night, over_time, seal_no, car_type, note, 
        price, issuer, created_date:new moment().add(0, 'hours').toDate(), updated_date: new moment().add(0, 'hours').toDate(),
        products: products.join("|"), delivered_date, status: 'new', company_id: localStorage.getItem('companyID'),
        company_logo, company_name, department: `${department}${department_note !== ''?':'+ department_note:''}`, delivery_type,
        num_box, num_die, num_pallet, num_rack, dest_geo_in, dest_geo_out, trip_no, process, order_type
      };
      // console.log(data)
      /** require modal pop up first before submit  */
      this.setState({
        showDialog: true,
        submitData: data
      })
      // axios.post(`${server.url}/orders`, data).then(res => {
      //   console.log(res);
      //   alert('Data post successfully');
      // })
    }
  }
  /**
   * Load required variable to show inside form 
   * 1. Company Name & Logo
   * 2. Invoice Number (sequence number)
   * 3. Available Vehicle Lists
   * 4. Available POIs
   * 
   */
  componentWillMount () {
    let self = this;
    const company = axios.get(`${server.url}/companies/${localStorage.getItem('companyID')}`);
    
    this.setState({
      issuer_name: localStorage.getItem('username')
    })

    /** Prepare logo, comany's name */
    Promise.all([company]).then(function(values) {
      self.setState({
        loading: false,
        company_logo: values[0].data.logo,
        company_name: values[0].data.name,
        company_abbr: values[0].data.abbr,
        suppliers: values[0].data.supplier
      })
    }).catch(function(err) {
      console.log(err.message); // some coding error in handling happened
      self.setState({
        loading: false  
      })
    })
    /** Get list of vehicles and poi base on suppliers */
    .then(
      async ()=>{
        const promises_vehicles = this.state.suppliers.map((sup, ind) => {
          return axios.get(`${server.url}/vehicles?appid=${sup.appid}&company_name_contains=${this.state.company_abbr}&_sort=plate_no:ASC&_limit=1000`, {
          });
        });
        const promises_pois = this.state.suppliers.map((sup, ind) => {
          return axios.get(`${server.url}/pois?appid=${sup.appid}&_sort=name:ASC&_limit=1000&company_name=${this.state.company_abbr}`, {
          });
        });

        await Promise.all([Promise.all([promises_vehicles, promises_pois]).then(result => {
          // console.log(result)
          return result;
        })])
        .then(async result => {
          // console.log(result);
          await result[0][0].map(async data =>
            data.then(async result=>
              // console.log(result.data)
              await this.setState({
                vehicles: [...this.state.vehicles, ...result.data]
              })
            )
          );

          await result[0][1].map(async data =>
            data.then(async result=>
              // console.log(result.data)
              await this.setState({
                pois: [...this.state.pois, ...result.data]
              })
            )
          );
        });
    })
    /** Get latest job no */
    .then(()=>{
      axios.get(`${server.url}/orders?_sort=job_no:DESC&_limit=1&company_id=${localStorage.getItem('companyID')}`).then((res)=>{
        if (res.data.length !== 0){
          self.setState({
            job_no:  this.pad(parseInt(res.data[0].job_no) + 1, 5) 
          })
        } else {
          self.setState({
            job_no: '00001'
          })
        }
      })
    })
  }

  pad (num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }

  handleAddInput() {
    this.setState({
      inputLinkClicked: [...this.state.inputLinkClicked, 1], // 1 just a dummy variable
      destination: [...this.state.destination, null] // 1 just a dummy variable
    })
    console.log(this.state);
  }

  handleDeleteInput(index) {
    // /** if destination state length equal to number of inputs box */
    // if (this.state.destination.length === this.state.inputLinkClicked.length){
    //   this.setState({
    //     destination: this.state.destination.filter((_, i) => i !== 0 ) // remove last item
    //   })
    // };

    // this.setState({
    //   inputLinkClicked: this.state.inputLinkClicked.filter((_, i) => i !== 0) // remove last item
    // });

    // console.log(index);
    
    this.setState({
      inputLinkClicked: this.state.inputLinkClicked.filter((_, i) => i !== index), // remove last item
      destination: this.state.destination.filter((_, i) => i !== index) // remove last item
    });
    
  }

  onUpdateProps = (val) => {
    this.setState({
      showDialog: val
    })
  }
  
  pad_array = (arr,len,fill) => {
    return arr.concat(Array(len).fill(fill)).slice(0,len);
  }

  onUpdate = (val,index) => {
    const self = this;
    // console.log(val);
    // console.log(index);
    if (val[0].origin){
      this.setState({
        origin: val[0].value
      }, this.getDeliverCost)
    };
    if (val[0].destination){
      // if updated old value     
      console.log(this.state); 
      // create transporation description
      this.setState(state => {
        const destination = state.destination.map((dest, index) => {
          if (index === val[2]){
            dest = val[0].value 
          }          
          return dest
        });
        
        return {
          destination,
        };
      }, this.getDeliverCost);
    };
    if (val[0].vehicle){
      // change available poi also
      const newPois = this.state.pois.filter(poi => poi.appid === val[0].appid)
      // console.log(newPois);
      this.setState({
        vehicle: val[0].value,
        car_type: val[0].type,
        pois: newPois
      }, this.getDeliverCost);

      /** Get supplier name */
      axios.get(`${server.url}/suppliers?appid=${val[0].appid}`).then((res)=>{
        // console.log(res);
        self.setState({
          supplier: res.data[0].name
        })
      })
       /** Get trip no */
      axios.get(`${server.url}/orders/count?plate_no=${val[0].value}&created_date_gt=${new Date().toISOString().slice(0,10)}&company_id=${localStorage.getItem('companyID')}`).then(res => {
        this.setState({
          trip_no: res.data + 1
        })
      })
    }
  };
 
  getDeliverCost = () => {
    const self = this;
    /** Get Delivery pricing */
    let {destination, origin, supplier, company_name, onOvertime, onReturn, car_type} = this.state;
    console.log(company_name, origin, destination, supplier);
    let transport = `${company_name}-${supplier}-${car_type.toUpperCase().replace("-"," ")}-${origin}-${this.pad_array(destination.filter((obj) => obj ),7,"").join("-")}-${onReturn?"Return-":"-"}${onOvertime?"Overtime":""}`
    console.log(transport);
    axios.get(`${server.url}/deliveryfees?Transportation Description=${transport}`).then(function (response) {
      // handle success
      console.log(response);
      if (response.data.length !== 0){
        self.setState({
          price: response.data[0].Price
        })
      } else {
        self.setState({
          price: ''
        })
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar_open: false });
  };

  render () {
    // console.log(this.state.vehicles);
    const {company_logo, company_name, issuer_name} = this.state;
    console.log(this.state);
    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <div>
          <LinearProgress />
          <br />
          <LinearProgress color="secondary" />
        </div>
      )
    } else {
      if (this.state.company_abbr === 'APB'){
        return(
          <AddInvoiceAP history = {this.props.history}/>
        )
      }
    }

    const vehicle_suggestions = this.state.vehicles.map(suggestion => ({
      value: suggestion.plate_no,
      label: suggestion.plate_no,
      type: suggestion.vehicle_type,
      appid: suggestion.appid,
      vehicle: true
    }));

    const poi_ori_list = this.state.pois.map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
      origin: true
    }));

    const poi_des_list = this.state.pois.map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
      destination: true
    }));

    
    let uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
    const poi_ori_suggestions = uniqueArray(poi_ori_list);
    const poi_des_suggestions = uniqueArray(poi_des_list);

    return (
      <div style = {{paddingTop: '20px'}}>
      
        {/* snackbar */}
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.snackbar_open}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant="error"
            message={this.state.alert}
          />
        </Snackbar>

        <ConfirmDialog open = {this.state.showDialog} onUpdateState={this.onUpdateProps} data={this.state.submitData} history={this.props.history} />
        <Paper className={classes.container} >
          <Grid container>
            <Grid item xs={8} className={classes.box} style = {{textAlign: 'center'}}>
                  <img src={company_logo} alt='no logo found' width='75px' style = {{float: 'left'}}/>
                  <b>{company_name}</b>
            </Grid>
            <Grid item xs={4}  className={classes.box}>
                  Job no. | ใบงานที่: {this.state.job_no}
            </Grid>
            <Grid item xs={8}  className={classes.box}>
                  Transporter | ขนส่ง: {this.state.supplier}
            </Grid>
            <Grid item xs={4}  className={classes.box}>
                  Date | วันที่: { new Date().toLocaleString()}
            </Grid>
            <Grid item xs={4} className={classes.box}>
                  <TextField
                      id="outlined-email-input"
                      label="Invoice No. | ใบส่งของ เลขที่."
                      onChange={this.handleChangeName}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                        name: 'invoice_no'
                      }}
                      type="text"
                      name="invoice_no"
                      margin="normal"
                      variant="outlined"
                      fullWidth
                  />
            </Grid>
            <Grid item xs={4} className={classes.box} >
                  <Grid container >
                      <Grid item xs = {4} >
                          Car Plate* |
                          ทะเบียนรถ:
                      </Grid>
                      <Grid item xs={8}>
                          <VehicleSelect 
                            suggestions = {vehicle_suggestions} 
                            vehicle={true} 
                            onUpdate={this.onUpdate}
                            origin={this.state.origin?this.state.origin:''}
                            destination = {this.state.destination?this.state.destination:[]}
                          />
                      </Grid>
                  </Grid>
            </Grid>
            <Grid item xs={4} className={classes.box}>
                  No. of trip |
                  เที่ยวที่: {this.state.trip_no}
            </Grid>
            <Grid item xs={4} className={classes.box}>                 
              <Grid container >
                  <Grid item xs = {4} >            
                    Origin | จุดเริ่มต้น*
                  </Grid>
                  <Grid item xs={8}>
                    <VehicleSelect suggestions = {poi_ori_suggestions}  plate_no = {this.state.vehicle} onUpdate={this.onUpdate} 
                            origin={this.state.origin?this.state.origin:''}
                            destination = {this.state.destination?this.state.destination:[]}
                            />
                  </Grid>
                  <Grid container style= {{marginTop: '12px'}} >
                    <Grid item xs={6} >Time in | เวลาเข้า: </Grid>
                    <Grid item xs={6} >Time out | เวลาออก:   </Grid>
                  </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}  className={classes.box}>         
            {
              this.state.inputLinkClicked.map((data, index)=>(
                <Grid container key={index}>
                    {index === 0 ?
                      <Grid item xs = {4} >Destination | ปลายทาง*</Grid>: 
                    <Grid item xs = {4} ></Grid> }
                    <Grid item xs={5}>
                              <VehicleSelect key={index} suggestions = {poi_des_suggestions} plate_no={this.state.vehicle} onUpdate={this.onUpdate} 
                                origin={this.state.origin?this.state.origin:''}
                                destination = {this.state.destination?this.state.destination:[]}
                                defaultValue={{
                                  "value": this.state.destination[index],
                                  "label": this.state.destination[index],
                                  "destination": true
                                }}
                                index = {index}
                            />   
                    </Grid>
                    
                    <Grid item xs={3}>
                    {index === 0 && this.state.inputLinkClicked.length < 7 ? // limit added destination up to 7
                        <IconButton variant="contained" color="secondary" className={classes.button} style={{float: 'right'}} onClick={()=>this.handleAddInput()} >
                          <AddIcon />
                        </IconButton>
                        :null
                    }
                    {index !== 0 ?
                          (this.state.inputLinkClicked.length>1)?(
                          <IconButton variant="contained" color="secondary" className={classes.button} style={{float: 'right'}} onClick={()=>this.handleDeleteInput(index)} >
                            <DeleteIcon />
                          </IconButton>)
                          :null
                        :null
                    }
                    </Grid>
                    { index === 0 ?
                      <Grid container >
                        <Grid item xs={6} >Time in | เวลาเข้า:   </Grid>
                        <Grid item xs={6} >Time out | เวลาออก:   </Grid>
                      </Grid> : 
                      <Grid container style= {{marginTop: '12px'}} >
                        <Grid item xs={6} >Time in | เวลาเข้า:  </Grid>
                        <Grid item xs={6} >Time out | เวลาออก:  </Grid>
                      </Grid> 
                    }
                </Grid>
              ))
            }
            </Grid>
            
            <Grid item xs={4} className={classes.box}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.onReturn}
                    onChange={this.handleChange('onReturn')}
                    value={this.state.onReturn}
                  />
                }
                label={this.state.onReturn?'Return* | รับกลับ':'No return | ไม่รับกลับ'}
              />
            </Grid>
            <Grid item xs={4} className={classes.box}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.onOvertime}
                    onChange={this.handleChange('onOvertime')}
                    value={this.state.onOvertime}
                  />
                }
                label={this.state.onOvertime?'Overtime* | ล่วงเวลา':'No overtime | ไม่ล่วงเวลา'}
              />
            </Grid>
            <Grid item xs={4} className={classes.box}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.onOverNight}
                    onChange={this.handleChange('onOverNight')}
                    value={this.state.onOverNight}
                  />
                }
                label={this.state.onOverNight?'Over Night | ค้างคืน*':'No over night | ไม่ค้างคืน'}
              />
              {this.state.onOverNight?(
              <TextField
                id="date"
                label="Delivered date"
                type="date"
                // defaultValue=  {new moment().add(1, 'days').toDate().toISOString().slice(0,10)}
                value=  {this.state.delivered_date}
                fullWidth
                onChange={this.handleChangeName}
                className={classNames.tel}
                name= 'delivered_date'
                InputLabelProps={{
                  shrink: true,
                }}
              />):null}
            </Grid>
            <Grid item xs={6} className={classes.box}>Product* | ผลิตภัณฑ์:
              <FormGroup style={{ flexDirection: 'row'}}>
                <FormControlLabel
                  control={
                    <Checkbox checked={this.state.pallet} onChange={this.handleChange('pallet')} value="pallet" />
                  }
                  label="Pallet"
                />
                {this.state.pallet?<TextField
                  id="num_pallet"
                  label="จำนวนของ"
                  type="text"
                  defaultValue= {this.state.num_pallet}
                  onChange={this.handleChangeName}
                  className={classes.textField_number}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      zIndex: 0
                    }
                  }}
                  name= 'num_pallet'
                  variant= 'outlined'
                />:null}
                <FormControlLabel
                  control={
                    <Checkbox checked={this.state.rack} onChange={this.handleChange('rack')} value="rack" />
                  }
                  label="Rack"
                />
                {this.state.rack?<TextField
                  id="num_rack"
                  label="จำนวนของ"
                  type="text"
                  defaultValue= {this.state.num_rack}
                  onChange={this.handleChangeName}
                  className={classes.textField_number}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name= 'num_rack'
                  variant= 'outlined'
                />:null}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.dies} onChange={this.handleChange('dies')} value="dies"
                    />
                  }
                  label="Dies"
                />
                {this.state.dies?<TextField
                  id="num_die"
                  label="จำนวนของ"
                  type="text"
                  defaultValue= {this.state.num_die}
                  onChange={this.handleChangeName}
                  className={classes.textField_number}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name= 'num_die'
                  variant= 'outlined'
                />:null}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.box} onChange={this.handleChange('box')} value="box"
                    />
                  }
                  label="Box"
                />
                {this.state.box?<TextField
                  id="num_box"
                  label="จำนวนของ"
                  type="text"
                  defaultValue= {this.state.num_box}
                  onChange={this.handleChangeName}
                  className={classes.textField_number}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name= 'num_box'
                  variant= 'outlined'
                />:null}
              </FormGroup>
              
              <TextField
                      id="outlined-product-note-input"
                      label="อื่นๆ: "
                      className={classes.textField}
                      value={this.state.product_note}
                      onChange={this.handleChangeName}
                      inputProps={{
                        name: 'product_note'}}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name= 'product_note'
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      multiline
                      rowsMax="10"
                  />
            </Grid>
            <Grid item xs={6} container className={classes.box}>
                  Seal Number: <br/>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="เลขสายรัด"
                    multiline
                    rowsMax="10"
                    value={this.state.seal_no}
                    onChange={this.handleChangeName}
                    inputProps={{
                      name: 'seal_no'}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={classes.textField}
                    margin="normal"
                    helperText="Maximum of 100 character"
                    variant="outlined"
                    fullWidth
                  />
                  <br />
                  
                  {this.state.company_name === 'Able Sanoh industries (1996) co. ltd'?(
                  <FormControl component="fieldset" className={classes.formControl} variant='outlined'>
                    <FormLabel component="legend">
                      <Typography > Department* | แผนก: </Typography>  
                    </FormLabel>
                    <RadioGroup
                      aria-label="department"
                      name="department"
                      className={classes.group}
                      value={this.state.department}
                      onChange={this.handleChangeName}
                      row
                    >
                      <FormControlLabel value="PC" control={<Radio />} label="PC" />
                      <FormControlLabel value="Warehouse" control={<Radio />} label="Warehouse" />
                      <FormControlLabel value="Others" control={<Radio />} label="Others" />
                      {this.state.department === 'Others'?(
                        <TextField
                          id="outlined-multiline-flexible"
                          label="others"
                          multiline
                          rowsMax="10"
                          value={this.state.department_note}
                          onChange={this.handleChangeName}
                          inputProps={{
                            name: 'department_note'}}
                          name="department_note"
                          className={classes.textField}
                          margin="normal"
                          helperText="Maximum of 50 character"
                          variant="outlined"
                          fullWidth
                      />
                      ):null}
                    </RadioGroup>
                  </FormControl>
                  ):null}
                  {this.state.company_name === 'Able Sanoh industries (1996) co. ltd'?(
                    <FormControl component="fieldset" className={classes.formControl}>
                      <FormLabel component="legend">
                        <Typography >Delivery Type* | รูปแบบการขนส่ง: </Typography>  
                      </FormLabel>
                      <RadioGroup
                        aria-label="department"
                        name="delivery_type"
                        className={classes.group}
                        value={this.state.delivery_type}
                        onChange={this.handleChangeName}
                        row
                      >
                        <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                        <FormControlLabel value="special" control={<Radio />} label="Special" />
                      </RadioGroup>
                    </FormControl>
                  ):null}

            </Grid>
            <Grid item xs={6} className={classes.box}>Type of car | ชนิดรถขนส่ง: {this.state.car_type}</Grid>
            <Grid item xs={6} className={classes.box}>
              <TextField
                  id="outlined-multiline-flexible"
                  label="Price | ราคา"
                  value={this.state.price}
                  // onChange={this.handleChangeName}
                  disabled
                  inputProps={{
                    name: 'price'
                  }}
                  type= 'number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="price"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  fullWidth
              />
            </Grid>
            <Grid item xs={12} className={classes.box}> 
              <TextField
                id="outlined-multiline-flexible"
                label="อื่นๆ"
                multiline
                rowsMax="10"
                value={this.state.note}
                onChange={this.handleChangeName}
                inputProps={{
                  name: 'note'}}
                InputLabelProps={{
                  shrink: true,
                }}
                className={classes.textField}
                margin="normal"
                helperText="Maximum of 100 character"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} className={classes.box}>
                  Driver Name |
                  คนขับรถ: 
            </Grid>
            <Grid item xs={6} className={classes.box}>
                  Issuer's name |   
                  ผู้สั่งงาน:  <br/> {issuer_name}
            </Grid>
          </Grid>
          {/* <Grid item xs={12} className={classes.boxButton}> */}
          
            {/* for backend to immediate process or not */}
            {/* <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">
                <Typography > Process Now?*: </Typography>  
              </FormLabel>
              <RadioGroup
                aria-label="department"
                name="process"
                className={classes.group}
                value={this.state.process}
                onChange={this.handleChangeName}
                row
              >
                <FormControlLabel value="now" control={<Radio />} label="Now" />
                <FormControlLabel value="later" control={<Radio />} label="Later" />
              </RadioGroup>
            </FormControl> */}
            {/* <Button variant="contained" color="primary" style={{margin: 10, float: 'right'}} onClick={()=> this.handleSubmit()}>
              Save 
            </Button> */}
            {/* <Button variant="contained" color="primary" style={{margin: 10}} >
              Cancel
            </Button> */}
          {/* </Grid> */}
        </Paper>
        <Grid container style={{justifyContent: 'center'}}>
          <Paper style={{width: '100%', margin: 10, textAlign: 'center', display: 'contents'}}>
            <Button variant="contained" color="primary" style={{margin: 10}} onClick={()=> this.props.history.push('invoicelist')}>
                Cancel 
            </Button>
            <Button variant="contained" color="primary" style={{margin: 10}} onClick={()=> this.handleSubmit()}>
                Save 
            </Button>
          </Paper>
        </Grid>
      </div>
    );
  }
}

CSSGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CSSGrid);
