import React from "react"; 
import classNames from 'classnames';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { Paper, Grid, Button, TextField, 
  LinearProgress, Checkbox ,Switch, FormControlLabel,
  IconButton  } from "@material-ui/core";

import VehicleSelect from './vehicleSelect';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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

/** Addition field for AP */
const styles = theme => ({
  container: {
    textAlign: "flex-start", 
    margin: 'auto',
    marginBottom: 20, 
    padding: 20,
    width: window.innerWidth <= 1024? '95%': '21cm',
    height: '100%',
    fontSize: 12
  },
  paper: {
    padding: theme.spacing.unit*2,
    textAlign: "flext-start",
    alignContent: "center",
    // color: theme.palette.text.secondary,
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
    fontSize: 8
  },
  button:{
    padding: 5
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
      note: '',
      job_no: '',
      invoice_no: '',
      supplier:'',
      delivered_date: '',
      submitData: {},

      loading: true,
      multiline: '',
      company_logo:'',
      company_name:'',
      suppliers:'',
      pois:[],
      vehicles:[],
      products:[],
      inputLinkClicked: [1],
      showDialog: false,
      process: 'later',

      products_ap: '',
      pro_quantity_ap: '',
      invoices_out_ap: '',
      invoices_in_ap: '',
      times : [1],

      price_trip: '',
      price_toll: '',
      price_other: '',

      order_type: null,

      orders_no: '',
      long_pick_up: false,
      products_in_ap: '',
      pro_in_quantity_ap: '',

    };
  }

  handleChange = name => event => {
    if (name === 'onOverNight'){
      this.setState({ delivered_date: new moment().add(1, 'days').toDate().toISOString().slice(0,10)});
    }
    this.setState({ [name]: event.target.checked });
  };

  handleChangeName = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeTime = name => event => {
    console.log(event.target.value);
    console.log(name);
    console.log(this.state.inputLinkClicked.length);
    var val = parseInt(event.target.value);
    this.setState(state => {
      console.log(name);
      const times = state.times.map((time, index) => {
        console.log(index);
        if (index === name){
          console.log(index);
          time = val;
        }          
        return time
      });
      console.log(times);
      return {
        times
      };
    });
    console.log(this.state.times);
  }

  handleSubmit () {
    /** Parse data to submit */
    if (!this.state.vehicle){
      // alert('Plate_no is missing')
      this.setState({
          alert: 'Plate_no is missing',
          snackbar_open: true
      });
    } 
    // else if (this.state.products_ap === ''){
    //   // alert('Product is missing')
    //   this.setState({
    //     alert: 'Product is missing',
    //     snackbar_open: true
    //   });
    // } 
    else if (!this.state.origin){
      // alert('Please specfic origin of delivery')
      this.setState({
        alert: 'Please specfic origin of delivery',
        snackbar_open: true
      });
    } else if (this.state.destination.length === 0  || this.state.destination.includes(null)){
      // alert('Please specfic destination of delivery')
      this.setState({
        alert: 'Please specfic destination of delivery',
        snackbar_open: true
      });
    } else if (this.state.destination.includes(this.state.origin)){
      // alert('origin and destination cannot be same');
      this.setState({
        alert: 'Origin and destination cannot be same',
        snackbar_open: true
      });
    } else {
        const {
        job_no, invoice_no, supplier, vehicle:plate_no, origin, destination, onReturn:will_return, onOverNight: over_night, 
        onOvertime: over_time, seal_no, car_type, note, price,issuer_name:issuer, delivered_date, company_logo, company_name, 
        trip_no, process, products_ap, pro_quantity_ap, price_ap, toll_price_ap, 
        invoices_in_ap, invoices_out_ap, times,
        price_trip, price_toll, price_other, order_type, 
        orders_no, long_pick_up, products_in_ap, pro_in_quantity_ap
      } = this.state;
      // initial empty array for dest_geo_in & out
      const dest_geo_in = Array(destination.length).fill(0).join("|");
      const dest_geo_out = dest_geo_in;
      
      if (invoices_out_ap === '') {
        // alert('Invoice number is missing')
        this.setState({
            alert: 'Invoices is missing',
            snackbar_open: true
        });
        return;
      };
      
      let data = {
        job_no,invoice_no, supplier, plate_no, origin, destination: destination.join("|"), 
        will_return, over_night, over_time, seal_no, car_type, note, 
        price, issuer, created_date: new moment().add(0, 'hours').toDate(), updated_date: new moment().add(0, 'hours').toDate(),
        delivered_date, status: "new", company_id: localStorage.getItem('companyID'), company_logo, company_name,
        dest_geo_in, dest_geo_out, trip_no, process,
        products_ap, pro_quantity_ap, price_ap, toll_price_ap,
        invoices_in_ap, invoices_out_ap, 
        times: times.join('\n'), price_trip, price_toll, price_other, order_type, 
        orders_no, long_pick_up, products_in_ap, pro_in_quantity_ap

      };
      console.log(data);
      /** require modal pop up first before submit  */
      this.setState({
        showDialog: true,
        submitData: data
      })
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
          return axios.get(`${server.url}/vehicles?appid=${sup.appid}&_sort=plate_no:ASC&_limit=1000`, { //TODO add abbr state
          });
        });
        const promises_pois = this.state.suppliers.map((sup, ind) => {
          return axios.get(`${server.url}/pois?appid=${sup.appid}&_sort=name:ASC&_limit=1000&company_name=${this.state.company_abbr}`, {
          });
        });
        const promises_products = axios.get(`${server.url}/products?_sort=CUSTOMER_ITEM_CODE_SALE:ASC&_limit=10000`);

        await Promise.all([Promise.all([promises_vehicles, promises_pois, promises_products]).then(result => {
          console.log(result)
          return result;
        })])
        .then(async result => {
          console.log(result);
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
          
          await this.setState({
            products: [...this.state.products, ...result[0][2].data]
          })
          
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
      times: [...this.state.times, 1], // 1 just a dummy variable
      destination: [...this.state.destination, null] // 1 just a dummy variable
    })
  }

  handleDeleteInput(index) {
    // /** if destination state length equal to number of inputs box */
    // if (this.state.destination.length === this.state.inputLinkClicked.length){
    //   this.setState({
    //     destination: this.state.destination.filter((_, i) => i !== 0 ) // remove last item
    //   })
    // };

    // this.setState({
    //   inputLinkClicked: this.state.inputLinkClicked.filter((_, i) => i !== 0), // remove last item
    //   times: this.state.times.filter((_, i) => i !== 0) // remove last item
    // });

    console.log(index);
    
    this.setState({
      inputLinkClicked: this.state.inputLinkClicked.filter((_, i) => i !== index), // remove last item
      times: this.state.times.filter((_, i) => i !== index), // remove last item
      destination: this.state.destination.filter((_, i) => i !== index) // remove last item
    });
    
  }
  

  handleDeletePackage() {
    /** if destination state length equal to number of inputs box */
    if (this.state.products_ap.length !== 0){
      
      // if quautity length == this.state.products_ap
      if (this.state.pro_quantity_ap.split('\n').length === this.state.products_ap.split('\n').length){
        this.setState({
          products_ap: this.state.products_ap.split('\n').filter((_, i) => i !==  this.state.products_ap.split('\n').length - 1).join('\n'), // remove last item
          pro_quantity_ap: this.state.pro_quantity_ap.split('\n').filter((_, i) => i !==  this.state.pro_quantity_ap.split('\n').length - 1).join('\n'),
        })
      } else {
        this.setState({
          products_ap: this.state.products_ap.split('\n').filter((_, i) => i !==  this.state.products_ap.split('\n').length - 1).join('\n'), // remove last item
        })
      }
    };
  }
  
  handleDeleteInPackage() {
    /** if destination state length equal to number of inputs box */
    if (this.state.products_in_ap.length !== 0){
      
      // if quautity length == this.state.products_ap
      if (this.state.pro_in_quantity_ap.split('\n').length === this.state.products_in_ap.split('\n').length){
        this.setState({
          products_in_ap: this.state.products_in_ap.split('\n').filter((_, i) => i !==  this.state.products_in_ap.split('\n').length - 1).join('\n'), // remove last item
          pro_in_quantity_ap: this.state.pro_in_quantity_ap.split('\n').filter((_, i) => i !==  this.state.pro_in_quantity_ap.split('\n').length - 1).join('\n'),
          })
      } else {
        this.setState({
          products_in_ap: this.state.products_in_ap.split('\n').filter((_, i) => i !==  this.state.products_in_ap.split('\n').length - 1).join('\n'), // remove last item
        })
      }
    };
  }


  onUpdateProps = (val) => {
    this.setState({
      showDialog: val
    })
  }

  onUpdate = (val) => {
    const self = this;
    console.log(val);
    if (val[0].product) {
      if (this.state.products_ap !== ''){
        this.setState({
          products_ap: this.state.products_ap + '\n' + val[0].value
        })
      } else {
        this.setState({
          products_ap: val[0].value
        }) 
      }
    }

    if (val[0].origin){
      this.setState({
        origin: val[0].value
      })
    };

    if (val[0].destination){

      console.log(val[0].value);
      if (val[0].value === 'FAURECIA ARGENTINA S.A.' || val[0].value === 'Adient South Africa Proprietary Limited' ){
        this.setState({
          order_type: 'abroad'
        })
      } else {
        this.setState({
          order_type: 'local'
        })
      };

      console.log(val[2]); 
      this.setState(state => {
        const destination = state.destination.map((dest, index) => {
          if (index === val[2]){
            dest = val[0].value 
          }          
          console.log(dest);         
          return dest
        });
        return {
          destination,
        };
      });
    };
    if (val[0].vehicle){
      // change available poi also
      const newPois = this.state.pois.filter(poi => poi.appid === val[0].appid)
      this.setState({
        vehicle: val[0].value,
        car_type: val[0].type,
        pois: newPois
      })

      /** Get supplier name */
      axios.get(`${server.url}/suppliers?appid=${val[0].appid}`).then((res)=>{
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
  
  onUpdate_pro_in = (val) => {
    console.log(val);
    if (val[0].product){
      if (this.state.products_in_ap !== ''){
        this.setState({
          products_in_ap: this.state.products_in_ap + '\n' + val[0].value
        })
      } else {
        this.setState({
          products_in_ap: val[0].value
        }) 
      }
    }
  };
 
  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar_open: false });
  };

  render () {
    console.log(this.state.destination);
    const {company_logo, company_name, issuer_name} = this.state;

    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <div>
          <LinearProgress />
          <br />
          <LinearProgress color="secondary" />
        </div>
      )
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
    
    const product_list = this.state.products.filter(function(obj) {
      if (obj.CUSTOMER_ITEM_CODE_SALE !== '(blank)'){
        return obj;
      } else {
        return null;
      }
    }).map(suggestion => ({
      value: suggestion.CUSTOMER_ITEM_CODE_SALE,
      label: suggestion.CUSTOMER_ITEM_CODE_SALE,
      product: true
    }));

  let uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
  const product_suggestions = uniqueArray(product_list);
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
          <Grid container >
            <Grid item xs={8} className={classes.box} style = {{textAlign: 'center'}}>                 
              <img src={company_logo} alt='no logo found' width='75px' style = {{float: 'left'}}/>
                  <b>{company_name}</b>
            </Grid>
            <Grid item xs={4}  className={classes.box}>
                  Job no. | ใบงานที่: {this.state.job_no}
            </Grid>
            <Grid item xs={4}  className={classes.box}>
                  Transporter | ขนส่ง: {this.state.supplier}
            </Grid>
            <Grid item xs={4}  className={classes.box}>
                  Date | วันที่: { new Date().toLocaleString()}
            </Grid>
            
            <Grid item xs={4} className={classes.box}>
                  No. of trip |
                  เที่ยวที่: {this.state.trip_no}
            </Grid>

            <Grid item xs={8} className={classes.box} >
                  <Grid container >
                      <Grid item xs = {2} >
                          Car Plate* |
                          ทะเบียนรถ:
                      </Grid>
                      <Grid item xs={4}>
                          <VehicleSelect 
                            suggestions = {vehicle_suggestions} 
                            vehicle={true} 
                            onUpdate={this.onUpdate}
                            origin={this.state.origin?this.state.origin:''}
                            destination = {this.state.destination?this.state.destination:[]}
                          />
                      </Grid>
                      <Grid item xs = {1} />
                      <Grid item xs = {3} >
                          Code No. :
                      </Grid>
                  </Grid>
            </Grid>

            <Grid item xs={4} className={classes.box} container>
              <Grid item xs={12}>Type of car | ชนิดรถขนส่ง: {this.state.car_type}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                    control={
                      <Checkbox 
                      checked={this.state.long_pick_up}
                      onChange={this.handleChange('long_pick_up')}
                      value="long_pick_up" 
                      />
                    }
                    label="5 m long"
                  />
              </Grid>
            </Grid>
            
            
            <Grid item xs={5} className={classes.box}>                 
              <Grid container >
                  <Grid item xs = {3} >  
                    Origin |          
                    จุดเริ่มต้น*
                  </Grid>
                  <Grid item xs={9}>
                    <VehicleSelect suggestions = {poi_ori_suggestions}  
                          plate_no = {this.state.vehicle} onUpdate={this.onUpdate} 
                          origin={this.state.origin?this.state.origin:''}
                          destination = {this.state.destination?this.state.destination:[]}
                        />
                  </Grid>
                  <Grid container style= {{margin: '6px'}} >
                    <Grid item xs={6} >Time in | เวลาเข้า: </Grid>
                    <Grid item xs={6} >Time out | เวลาออก: </Grid>
                  </Grid>
              </Grid> 
            </Grid>
            <Grid item xs={7}  className={classes.box}>         
            {
              this.state.inputLinkClicked.map((data, index)=>(
                <Grid container key={index}>
                    {index === 0 ?
                      <Grid item xs = {2} >Destination | ปลายทาง*</Grid>: 
                    <Grid item xs = {2} ></Grid> }
                    <Grid item xs={8} container>
                      <Grid item xs={9}>
                        <VehicleSelect key={index} suggestions = {poi_des_suggestions} plate_no={this.state.vehicle} onUpdate={this.onUpdate} 
                            origin={this.state.origin?this.state.origin:''}
                            defaultValue={{
                              "value": this.state.destination[index],
                              "label": this.state.destination[index],
                              "destination": true
                            }}
                            destination = {this.state.destination?this.state.destination:[]}
                            index= {index}
                            />
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2} >    
                        <TextField
                          id="text"
                          label="times"
                          type="number"
                          variant='outlined'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            style: {
                              fontSize: 10,
                              padding: 10,
                              paddingLeft: 5
                            }
                          }}
                          value = {this.state.times[index]}
                          onChange={this.handleChangeTime(index)}      
                          multilined 
                          rowsMax={1}
                        />
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={2}>
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
                      <Grid container style= {{margin: '6px'}} >
                        <Grid item xs={6} >Time in | เวลาเข้า:   </Grid>
                        <Grid item xs={6} >Time out | เวลาออก:   </Grid>
                      </Grid> : 
                      <Grid container style= {{margin: '6px'}} >
                        <Grid item xs={6} >TIme in | เวลาเข้า:  </Grid>
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
                defaultValue= {new moment().add(1, 'days').toDate().toISOString().slice(0,10)}
                fullWidth
                onChange={this.handleChangeName}
                className={classes.textField}
                InputProps={{
                  style: {
                    fontSize: 12
                  }
                }}  
                InputLabelProps={{
                  shrink: true,
                  style: {
                    zIndex: 0
                  }
                }}
                name= 'delivered_date'
              />):null}
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={7} className={classes.box}>
                <Grid item xs={12} style={{textAlign: 'center', backgroundColor: '#2ecc71', height: 48}}>{"Description of out-bound:    "}
                    <FormControlLabel
                      control={
                        <Checkbox value="part" />
                      }
                      label="Part"
                    />
                    <FormControlLabel
                    control={
                      <Checkbox value="document" />
                    }
                    label="Document"
                  />
                </Grid>
              
                <Grid container item xs={12}   style = {{marginTop: 10}}>
                  <Grid item xs ={4} >
                    <TextField
                          id="text"
                          label="Item code"
                          type="text"
                          variant='outlined'
                          fullWidth
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              zIndex: 0
                            }
                          }}
                          InputProps={{
                            style: {
                              fontSize: 10,
                              padding: 10
                            }
                          }}
                          value={this.state.products_ap}
                          name = 'products_ap'
                          onChange={this.handleChangeName}
                          multiline
                          rowsMax={40}
                          disabled
                      />
                      <Grid>
                        <VehicleSelect 
                          suggestions = {product_suggestions} 
                          product={true} 
                          plate_no = {this.state.vehicle} 
                          onUpdate={this.onUpdate}
                          origin={this.state.origin?this.state.origin:''}
                          destination = {this.state.destination?this.state.destination:[]}
                        />
                      </Grid>
                  </Grid>
                  <Grid item xs={2} >
                    <TextField
                            id="text"
                            type="text"
                            label="Qu."
                            variant='outlined'
                            fullWidth
                            className={classes.textField}
                            
                            InputLabelProps={{
                              shrink: true,
                              style:{
                                zIndex: 0
                              }
                            }}
                            InputProps={{
                              style: {
                                fontSize: 10,
                                padding: 10
                              }
                            }}
                            name = 'pro_quantity_ap'          
                            value = {this.state.pro_quantity_ap}        
                            onChange={this.handleChangeName}
                            multiline
                            rowsMax={40}
                        />
                        <IconButton variant="contained" color="secondary" className={classes.button} style={{float: 'right'}} onClick={()=>this.handleDeletePackage()} >
                              <DeleteIcon />
                            </IconButton>
                  </Grid>
                  
                  <Grid item xs={3} >
                    <TextField
                            id="text"
                            type="text"
                            label="Orders"
                            variant='outlined'
                            fullWidth
                            className={classes.textField}
                            
                            InputLabelProps={{
                              shrink: true,
                              style:{
                                zIndex: 0
                              }
                            }}
                            InputProps={{
                              style: {
                                fontSize: 10,
                                padding: 10
                              }
                            }}
                            name = 'orders_no'          
                            value = {this.state.orders_no}        
                            onChange={this.handleChangeName}
                            multiline
                            rowsMax={40}
                        />
                  </Grid>
                  <Grid item xs={3} >
                    <TextField
                        id="text"
                        label="Invoices"
                        type="text"
                        variant='outlined'
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            zIndex: 0
                          }
                        }}
                        InputProps={{
                          style: {
                            fontSize: 10,
                            padding: 10
                          }
                        }}
                        name = 'invoices_out_ap'                  
                        onChange={this.handleChangeName}
                        multiline
                        rowsMax={40}
                      />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5} container className={classes.box}>
                <Grid item xs={12} style={{textAlign: 'center', backgroundColor: '#2ecc71'}}>{'Description of in-bound:  '}
                  <FormControlLabel
                        control={
                          <Checkbox value="part" />
                        }
                        label="Part"
                      />
                      <FormControlLabel
                      control={
                        <Checkbox value="document" />
                      }
                      label="Document"
                    />
                </Grid>
              
                <Grid container item xs={12} className={classes.box} >
                <Grid item xs={5} >
                    <TextField
                          id="text"
                          label="Item code"
                          type="text"
                          variant='outlined'
                          fullWidth
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                            style: {
                              zIndex: 0
                            }
                          }}
                          InputProps={{
                            style: {
                              fontSize: 10,
                              padding: 10
                            }
                          }}
                          value={this.state.products_in_ap}
                          name = 'products_in_ap'
                          onChange={this.handleChangeName}
                          multiline
                          rowsMax={20}
                          disabled
                      />
                      <Grid>
                        <VehicleSelect 
                          suggestions = {product_suggestions} 
                          product={true} 
                          plate_no = {this.state.vehicle} 
                          onUpdate={this.onUpdate_pro_in}
                          origin={this.state.origin?this.state.origin:''}
                          destination = {this.state.destination?this.state.destination:[]}
                        />
                      </Grid>
                </Grid>
                <Grid item xs={2}>
                <TextField
                    id="text"
                    label="Qu."
                    type="text"
                    variant='outlined'
                    fullWidth
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        zIndex: 0
                      }
                    }}
                    InputProps={{
                      style: {
                        fontSize: 10,
                        padding: 10
                      }
                    }}
                    name = 'pro_in_quantity_ap'                  
                    onChange={this.handleChangeName}
                    multiline
                    rowsMax={20}
                />
                <IconButton variant="contained" color="secondary" className={classes.button} style={{float: 'right'}} onClick={()=>this.handleDeleteInPackage()} >
                      <DeleteIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={5} ><TextField
                        id="text"
                        label="Invoices"
                        type="text"
                        variant='outlined'
                        fullWidth
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            zIndex: 0
                          }
                        }}
                        InputProps={{
                          style: {
                            fontSize: 10,
                            padding: 10
                          }
                        }}
                        name = 'invoices_in_ap'                  
                        onChange={this.handleChangeName}
                        multiline
                        rowsMax={20}
                    />
                </Grid>
              </Grid>
              <Grid item xs={12} container className={classes.box}> 
                <Grid item xs={4} >
                  <TextField
                      variant='outlined'
                      label=" Trip (฿)"
                      type="number"
                      InputLabelProps={{
                          shrink: true,
                          style: {
                            zIndex: 0
                          }
                      }}
                      className={classes.input}
                      inputProps={{
                        'aria-label': 'Description',
                        style: {
                          fontSize: 10,
                          padding: 10
                        }
                      }}
                    name = 'price_trip'            
                    value = {this.state.price_trip}      
                    onChange={this.handleChangeName}
                    fullWidth
                  />
                </Grid>              
                <Grid item xs={4} >
                  <TextField          
                      variant='outlined'
                      label="Toll (฿)"
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          zIndex: 0
                        }
                      }}
                      type="number"
                      className={classes.input}
                      inputProps={{
                        'aria-label': 'Description',
                        style: {
                          fontSize: 10,
                          padding: 10
                        }
                      }}
                    name = 'price_toll'            
                    value = {this.state.price_toll}      
                    onChange={this.handleChangeName}
                    fullWidth
                  />
                </Grid>              
                <Grid item xs={4} >
                  <TextField
                      variant='outlined'
                      label="Other (฿)"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          zIndex: 0
                        }
                      }}
                      className={classes.input}
                      inputProps={{
                        'aria-label': 'Description',
                        style: {
                          fontSize: 10,
                          padding: 10
                        }
                      }}
                    name = 'price_other'            
                    value = {this.state.price_other}      
                    onChange={this.handleChangeName}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container> 
                <Grid item xs={6} className={classes.box}>
                  <Grid item xs={7} >Sender Name/ WH: </Grid>
                  <Grid item xs={5} >Date / Time: </Grid>
                </Grid>
                <Grid item xs={6} className={classes.box}>
                  <Grid item xs={7} >Name of Receiver: </Grid>
                  <Grid item xs={5} >Date / Time:  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={6} className={classes.box}>Report by: </Grid>
              <Grid item xs={6} className={classes.box}>Date / Time: </Grid>

              <Grid item xs={4} className={classes.box}>
                    Driver Name |
                    คนขับรถ: 
              </Grid>
              <Grid item xs={4} className={classes.box}>
                    Issuer's name |   
                    ผู้สั่งงาน: {issuer_name}
              </Grid>
              <Grid item xs={4} className={classes.box}>
                    Approved by |   
                    อนุมัติโดย:
              </Grid>
              <Grid item xs={4} className={classes.box}>
                    Date / Time:
              </Grid>
              <Grid item xs={4} className={classes.box}>
                    Date / Time:
              </Grid>
              <Grid item xs={4} className={classes.box}>
                    Date / Time:
              </Grid>
            </Grid>
          </Grid>
          </Grid>
            
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
