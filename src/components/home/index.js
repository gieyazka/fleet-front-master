import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import server from '../../config';

import truck from '../../assets/images/truck.png';
import driver from '../../assets/images/driver.png';
import login from '../../assets/images/login.png';
import poi from '../../assets/images/poi.png';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
    backgroundSize: '70%',
    backgroundColor: 'grey',
    margin: 'auto',
    width: '100%'
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

class CardView extends Component {
    constructor(props){
        super(props)
        /** Get all company first to make this auto */
        this.state = {
            suppliers : [],
            loading: false
        }
    }

    /** Call api to get company number & name and data inside */
    componentWillMount () {
        // console.log(localStorage.getItem('res'));
        var self = this;
        this.setState({
            loading: true
        })
        if (localStorage.getItem('supplierID') !== 'undefined' && localStorage.getItem('supplierID') !== "null"){
            // console.log(localStorage.getItem('supplierID'));
            axios.get(`${server.url}/suppliers?${localStorage.getItem('supplierID')!== 'undefined'?"id="+localStorage.getItem('supplierID'):''}`).then(res => {
                return res.data.map(data => {
                    return Promise.all([data, axios.get(`${server.url}/vehicles/count?appid=${data.appid}`), axios.get(`${server.url}/pois/count?appid=${data.appid}`), 
                    axios.get(`${server.url}/drivers/count?appid=${data.appid}`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&driving=true`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&login_status=true`)]).then(result => {
                        return {
                            "Total Vehicles" : result[1].data,
                            "Total POIs" : result[2].data,
                            "Total Drivers" : result[3].data,
                            "Total Login/Drivings" : `${result[5].data}/${result[4].data}`,
                            "supplier": result[0].abbr
                        }
                    })
                })
            }).then((resp)=>{
                resp.map(res => res.then(response => {
                    self.setState({
                        suppliers : [...self.state.suppliers, response],
                        loading: false
                    })
                }));
            });
        } else if (localStorage.getItem('companyID') !== 'undefined' && localStorage.getItem('companyID') !== "null") {
            axios.get(`${server.url}/companies?id=${localStorage.getItem('companyID')}`).then(res => {
                return res.data[0].supplier.map(async data => {
                    const vehicle_list = [];
                    await axios.get(`${server.url}/vehicles?company_name_contains=${res.data[0].abbr}`)
                    .then(async res => {
                        await res.data.map(data => {
                            vehicle_list.push(data.plate_no)
                        })
                    })
                    return Promise.all([data, axios.get(`${server.url}/vehicles/count?appid=${data.appid}&company_name_contains=${res.data[0].abbr}`), 
                    axios.get(`${server.url}/pois/count?appid=${data.appid}&company_name_contains=${res.data[0].abbr}`), 
                    axios.get(`${server.url}/drivers/count?appid=${data.appid}`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&driving=true`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&login_status=true`)
                    ]).then(result => {
                        // filtered vehicle list here
                        if (res.data[0].abbr === 'SNC'){
                            return {
                                "Total Vehicles" : result[1].data,
                                "Total POIs" : result[2].data
                            }
                        } else {
                            return {
                                "Total Vehicles" : result[1].data,
                                "Total POIs" : result[2].data,
                                "Total Drivers" : result[3].data,
                                "Total Login/Drivings" : `${result[5].data}/${result[4].data}`,
                                "supplier": result[0].abbr
                            }
                        }
                    })
                })
            }).then((resp)=>{
                resp.map(res => res.then(response => {
                    self.setState({
                        suppliers : [...self.state.suppliers, response],
                        loading: false
                    })
                }));
            });
        } else {
            // TODO: vehicle use company name, driver count can add by name & remove syncData function, pois can be filter by name while driving should be removed 
            axios.get(`${server.url}/suppliers`).then(res => {
                return res.data.map(data => {
                    return Promise.all([data, axios.get(`${server.url}/vehicles/count?appid=${data.appid}`), axios.get(`${server.url}/pois/count?appid=${data.appid}`), 
                    axios.get(`${server.url}/drivers/count?appid=${data.appid}`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&driving=true`),
                    axios.get(`${server.dlt}/driverids/count?application_name=${data.gpsgate_name}&login_status=true`)]).then(result => {
                        return {
                            "Total Vehicles" : result[1].data,
                            "Total POIs" : result[2].data,
                            "Total Drivers" : result[3].data,
                            "Total Login/Drivings" : `${result[5].data}/${result[4].data}`,
                            "supplier": result[0].abbr
                        }
                    })
                })
            }).then((resp)=>{
                resp.map(res => res.then(response => {
                    self.setState({
                        suppliers : [...self.state.suppliers, response],
                        loading: false
                    })
                }));
            }); 
        }


    }

    /** call vehicles to get list of specific vehicle */
    componentDidMount () {

    }
    getThumbnail = (a) => {
        switch (a){
            case 'Total Login/Drivings':
                return login
            case 'Total POIs':
                return poi
            case 'Total Vehicles':
                return truck
            case 'Total Drivers':
                return driver
            default:
                return null;
        }
    }

    createCard = (supplier, classes) => {
        let cards = []
        //Inner loop to create children
        for (let key in supplier) {
            if (key !== 'supplier'){
                cards.push(
                    <Grid item key={key} sm={6} md={3} lg={3}>
                        <Card className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image={this.getThumbnail(key)} // eslint-disable-line max-len
                            title="Image title"
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h1" component="h2" align='center'>
                                {supplier[key]}
                            </Typography>
                            <Typography align='center'>
                                {key}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {key === 'Total Vehicles'?
                                <Button size="small" color="primary" onClick={()=>this.props.history.push('map')}>
                                View
                                </Button>:null}
                            {key === 'Total Login/Drivings'?
                                <Button size="small" color="primary" onClick={()=>
                                {
                                    window.open(`https://dlt.powermap.live/login/${supplier['supplier']}`, "_blank")
                                }}>
                                View
                                </Button>:null
                            }
                        </CardActions>
                        </Card>
                    </Grid>
                )
            }
          }
        return cards;
    }
    
    render () {
    const { classes } = this.props;
    const { suppliers } = this.state;
    // console.log(this.state);

    if (this.state.loading) {
        return (
          <div>
            <LinearProgress />
            <br />
            <LinearProgress color="secondary" />
          </div>
        )
    }

    return (
        <React.Fragment>
        <CssBaseline />
        <main>
            {/* Hero unit */}
            <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
                <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                    <Grid item>
                    {/* no for administrator & purchasing */}
                    {localStorage.getItem('role') !== 'Administrator' && localStorage.getItem('role') !== 'supplier' && localStorage.getItem('role') !== 'purchaser'?
                        <Button variant="contained" color="primary" onClick={()=>this.props.history.push('addinvoice')}>
                            Create order
                        </Button>
                    :null}
                    </Grid>
                    <Grid item>
                    <Button variant="outlined" color="primary" onClick={()=>{
                        if (localStorage.getItem('role') === 'Administrator' ){
                            this.props.history.push('invoicelistadmin')
                        } else {
                            this.props.history.push('invoicelist')
                        }
                    }}>
                        View Order List
                    </Button>
                    </Grid>
                </Grid>
                </div>
            </div>
            </div>
            
            {suppliers.map(supplier => (
                <React.Fragment key={supplier.supplier}>
                    <AppBar position="static" color="default">
                        <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ margin: 'auto' }}>
                            {supplier.supplier}
                        </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                    <Grid container spacing={40} style={{justifyContent: "center"}}>
                        {this.createCard(supplier, classes)}
                    </Grid>
                    </div>
                </React.Fragment>
            ))}

        </main>
        </React.Fragment>
    );
    }
}

CardView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardView);
