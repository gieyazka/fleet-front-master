import React from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import server from '../../config';
import VehiclePanel from './vehiclePanel';
import LinearProgress from '@material-ui/core/LinearProgress';
import VehicleSearch from './vehicleSearch';
import { iconTruck } from './Icon';
import Chip from '@material-ui/core/Chip';
import RotatedMarker from 'react-leaflet-rotatedmarker'


const { Map, TileLayer, Marker, Popup, LayerGroup, LayersControl } = require('react-leaflet');


const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      width: '100%',
      overflowY: 'scroll',
      backgroundColor: 'grey'
    },
});

const DEFAULT_VIEWPORT = {
  center: [13.820744, 100.630938],
  zoom: 10,
}
  
class MapView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: 13.820744,
      lng: 100.630938,
      zoom: 10,
      sessionId: '',
      data: [],
      filterData : [],
      height: window.innerHeight - 64 - 50,
      viewport: DEFAULT_VIEWPORT,
      val: [],
      company_name: null,
      vehicle_list: []
    }

    this.updateWindowHeight = this.updateWindowHeight.bind(this);
  }

  /** Call real-time location api using rest APIs of Gpsgate */
  componentDidMount () {
    
    /** Get window height */
    this.updateWindowHeight();
    this.getData();
    window.addEventListener('resize', this.updateWindowHeight);
    /** get login token and store in state*/
    /* interval call */
    this.interval = setInterval( () => this.getData() , 15000);
    /** get company_name */
    if(localStorage.getItem('companyID')){
      axios.get(`${server.url}/companies/${localStorage.getItem('companyID')}`)
      .then(res => this.setState({company_name: res.data.abbr}))
      .catch(err => console.log(err))
      .finally(()=> {
        axios.get(`${server.url}/vehicles?company_name_contains=${this.state.company_name}`)
        .then(async res => {
          let list = [];
          await res.data.map(data => {
            list.push(data.plate_no)
          })
          this.setState({vehicle_list: list});
      })
    })
  }};

  getData = () => {
    const self = this;
    if (!this.state.sessionId){
      axios.get(`${server.url}/vehicles/proxylogin`).then(res => {
        self.setState({
          sessionId: res.data.token
        })
      }).then(()=>{
        const dataState = [];
        axios.post(`${server.url}/vehicles/proxy`, {
          token : self.state.sessionId,
          companyId: localStorage.getItem('companyID'),
          supplierId: localStorage.getItem('supplierID'),
        }).then(async result => {
            return result;
          })
          .then( async result => {
            await result.data.map(async dat => {
              if (this.state.company_name) {
                var filtered = dat.filter((value) => {
                  return this.state.vehicle_list.includes(value.name)
                });
                await dataState.push(...filtered);
              } else {
                await dataState.push(...dat);
              }
            });
            return dataState
          })
          .then (result => self.setState({
            data: result
          }))
      })
    } else {
      const dataState = [];
      // TODO: dataState should be filtered 
      axios.post(`${server.url}/vehicles/proxy`, {
        token : this.state.sessionId,
        companyId: localStorage.getItem('companyID'),
        supplierId: localStorage.getItem('supplierID'),
      }).then(async result => {
          return result;
        })
        .then( async result => {
          await result.data.map(async dat => {
            if (this.state.company_name) {
              var filtered = dat.filter((value) => {
                return this.state.vehicle_list.includes(value.name)
              });
              await dataState.push(...filtered);
            } else {
              await dataState.push(...dat);
            }
          });
          return dataState
        })
        .then (result => self.setState({
          data: result
        }))
    }
    this.onUpdateFilter()
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowHeight);
    clearInterval(this.interval);
  }

  updateWindowHeight() {
    this.setState({ height: window.innerHeight - 64 - 50 });
  }

  onUpdate = (val) => {
    console.log(val)
      const selected = val.map(data => data.value);
      const newData = this.state.data.filter(dat => {
        return selected.includes(dat.name)
      })
      this.setState({
        filterData: newData,
        val: val
      })
  };

  onUpdateFilter = () => {
      const selected = this.state.val.map(data => data.value);
      const newData = this.state.data.filter(dat => {
        return selected.includes(dat.name)
      })
      console.log(newData)
      this.setState({
        filterData: newData,
      })
  };

  renderMarker(){
    let cards = []
    if (this.state.filterData.length !== 0){
      this.state.filterData.map((data, index) => (
        cards.push(
          <RotatedMarker key ={index} position={[data.trackPoint.position.latitude, data.trackPoint.position.longitude ]} icon={iconTruck} rotationAngle={data.trackPoint.velocity.heading} rotationOrigin={'center'} >
            <Popup>
              <div>
                {data.name} {'(' + data.trackPoint.velocity.groundSpeed.toFixed(2) + ' Km/h)'} <br/> {new Date(data.deviceActivity).toLocaleString('en-US')}.
              </div>
             </Popup>
          </RotatedMarker>
        )
      ))
    } else {
      this.state.data.map((data, index) => (
        cards.push(
          <RotatedMarker key ={index} position={[data.trackPoint.position.latitude, data.trackPoint.position.longitude ]}icon={iconTruck} rotationAngle={data.trackPoint.velocity.heading} rotationOrigin={'center'} >
            <Popup>
              <div>
                {data.name} { '(' + data.trackPoint.velocity.groundSpeed.toFixed(2) + ' Km/h)'}  <br/> {new Date(data.deviceActivity).toLocaleString('en-US')}.
              </div>
            </Popup>
          </RotatedMarker>
        )
      ))
    }
    return cards;
  }

  onViewportChanged = (viewport) => {
    this.setState({ viewport })
  }

  detail = (trackPoint) => {
    console.log(trackPoint)
    return <div>
      <Chip label= {`Speed: ` +  trackPoint.velocity.groundSpeed.toFixed(2) + 'KM/H'} style= {{
        backgroundColor: '#F0AD4E',
        color: 'white'
      }}/><Chip label= {`Connected: ` +  (trackPoint.valid?'✔️':'❌')} style= {{
        backgroundColor: '#5BC0DE',
        color: 'white'
      }}/>
      {trackPoint.velocity.groundSpeed.toFixed(2) < 5 ?
      <Chip label= {`Parking`} style= {{
        backgroundColor: '#C90D0D',
        color: 'white'
      }}/>:null}
      </div>
  }
  // suggestions for search

  render() {
    console.log(this.state);
    const { classes } = this.props;
    const { data, filterData } = this.state;
    
    const suggestions = this.state.data
    .map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
    }));

    // console.log(filterData);
    const position = [this.state.lat, this.state.lng];
    return (
            <Grid style={{height: '100%'}} container>
            <Grid item xs={8} style={{height: '100%'}} >
                <Map center={position} zoom={this.state.zoom}
                  onViewportChanged={this.onViewportChanged}
                  viewport={this.state.viewport}>
                <LayersControl position="topright">
                  <LayersControl.BaseLayer name="Powermap">
                    <TileLayer
                    attribution='&copy; <a href="https://powermap.in.th">Powermap</a>'
                      url='http://search.map.powermap.in.th/api/v2/map/vtile/thailand_th/{z}/{x}/{y}.png?access_token=b378c575291af30a29f59919fd7e7e4c012d45c4'
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer checked name="Satellite">
                    <TileLayer
                      url='http://mt0.google.com/vt/lyrs=y&hl=th&x={x}&y={y}&z={z}'
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>
                    <LayerGroup>
                      {this.renderMarker()}
                    </LayerGroup>
                </Map>

            </Grid>
            <Grid item xs={4} style={{height: '100%'}}>
              <VehicleSearch suggestions= {suggestions} onUpdate={this.onUpdate}/>
              <Paper className={classes.paper} style = {{height: this.state.height}}>
              {data.length !== 0?
                filterData.length !== 0?filterData.map((dat, index) => (
                  <VehiclePanel key={index} title={`${dat.name}`} heading={new Date(dat.deviceActivity).toLocaleString('en-US')} 
                    detail={this.detail(dat.trackPoint)} onClick={() => this.setState({
                      viewport: {...this.state.viewport, center: [dat.trackPoint.position.latitude, dat.trackPoint.position.longitude], zoom: 17}
                    })}/> 
                )):data.map((dat, index) => (
                  <VehiclePanel key={index} title={`${dat.name}`} heading={new Date(dat.deviceActivity).toLocaleString('en-US')} 
                    detail={this.detail(dat.trackPoint)} onClick={() => this.setState({
                      viewport: {...this.state.viewport, center: [dat.trackPoint.position.latitude, dat.trackPoint.position.longitude], zoom: 17}
                    })}/> 
                )):<LinearProgress />}
              </Paper>
              
              {/* <Paper className={classes.search}>
              </Paper> */}
            </Grid>
            </Grid>

    );
  }
}

export default withStyles(styles)(MapView);