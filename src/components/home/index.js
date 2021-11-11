import React, { Component } from 'react';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import truck from '../../assets/images/truck.png';

const styles = (theme) => ({
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
    width: '100%',
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
  constructor(props) {
    super(props);
    /** Get all company first to make this auto */
    this.state = {
      suppliers: [],
      loading: false,
    };
  }

  /** Call api to get company number & name and data inside */
  componentWillMount() {
    console.log(localStorage.getItem('res'));
    var self = this;
    this.setState({
      loading: true,
    });
    if (
      localStorage.getItem('supplierID') !== 'undefined' &&
      localStorage.getItem('supplierID') !== 'null'
    ) {
      // console.log(localStorage.getItem('supplierID'));
      axios
        .get(
          `${server.url}/suppliers?${
            localStorage.getItem('supplierID') !== 'undefined'
              ? 'id=' + localStorage.getItem('supplierID')
              : ''
          }`
        )
        .then((res) => {
          console.log(res.data);
          this.setState({
            loading: false,
            suppliers: res.data,
          });
        });
    } else if (
      localStorage.getItem('companyID') !== 'undefined' &&
      localStorage.getItem('companyID') !== 'null'
    ) {
      axios
        .get(`${server.url}/companies?id=${localStorage.getItem('companyID')}`)
        .then((res) => {
          console.log(res.data);
          this.setState({
            loading: false,
            suppliers: res.data[0].supplier,
          });
        });
    } else {
      // TODO: vehicle use company name, driver count can add by name & remove syncData function, pois can be filter by name while driving should be removed
      axios.get(`${server.url}/suppliers`).then((res) => {
        console.log(res.data);
        this.setState({
          loading: false,
          suppliers: res.data,
        });
      });
    }
  }

  createCard = (suppliers, classes) => {
    let cards = [];
    console.log(suppliers);
    //Inner loop to create children
    suppliers.map((supplier, index) => {
      cards.push(
        <Grid item key={index} sm={6} md={3} lg={3}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={truck} // eslint-disable-line max-len
              title="Image title"
            />
            <CardContent className={classes.cardContent}>
              <Typography align="center" variant="h6">
                {supplier.gpsgate_name.toUpperCase()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={() => window.open(supplier.gps_server)}
                disabled={!supplier.gps_server ? true : false}
              >
                View Location
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
    return cards;
  };

  render() {
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
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    {/* no for administrator & purchasing */}
                    {localStorage.getItem('role') !== 'Administrator' &&
                    localStorage.getItem('role') !== 'supplier' &&
                    localStorage.getItem('role') !== 'purchaser' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.props.history.push('addinvoice')}
                      >
                        Create order
                      </Button>
                    ) : null}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (localStorage.getItem('role') === 'Administrator') {
                          this.props.history.push('invoicelistadmin');
                        } else {
                          this.props.history.push('invoicelist');
                        }
                      }}
                    >
                      View Order List
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>

          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={2} style={{ justifyContent: 'center' }}>
              {this.createCard(suppliers, classes)}
            </Grid>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

CardView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardView);
