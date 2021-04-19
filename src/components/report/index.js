import React from "react";
import { Logo, Tips } from "../../utils/util";
import matchSorter from 'match-sorter'
import moment from 'moment';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import server from '../../config';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import Button from '@material-ui/core/Button';

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
});

class Report extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: props.location.state.data,
      tableData : []
    };
  }

  componentDidMount () {
      // load data base on props
      
    const q_start_date = `date_gte=${moment(this.state.data.created_date).add(0, 'hours').startOf('day').add(-1, 'hours')}`;
    console.log(this.state.data.created_date);
    console.log(q_start_date);
    const q_end_date = this.state.data.delivered_date?`date_lte=${moment(this.state.data.delivered_date).add(0, 'hours').endOf('day').add(1, 'hours')}`:`date_lte=${moment(this.state.data.created_date).add(0, 'hours').endOf('day').add(1, 'hours')}`;
    const q_vehicle = `plate=${this.state.data.plate_no}`

    const all_query = q_vehicle + '&' + q_start_date + '&' + q_end_date;

    axios.get(`${server.url}/eventins?${all_query}`).then(res => {
        console.log(res);
        this.setState({
            tableData: res.data
        })
    })
  }


  columns= [
    {
        Header: 'Event deails', 
        columns: [
            {
                Header: 'Date/Time',
                accessor: 'date',
                Cell: row => (
                    <span> {new moment(row.value).add(-7, 'hours').toDate().toLocaleDateString()}
                    {' '}
                    {new moment(row.value).add(-7, 'hours').toDate().toLocaleTimeString()}
                    </span>
                )
            },
            {
                Header: 'Geofencing Status',
                accessor: 'status',
                Cell: row => (
                    <span> {row.value?'In':'Out'}
                    </span>
                )
            },
            {
                Header: 'Site',
                accessor: 'site',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["site"] }),
                filterAll: true
            }, {
                Header: 'Driver',
                accessor: 'driver_name',
            }, 
        ]},     
    {
        Header: 'Status', 
        columns: [
            {
                Header: 'Use as Origin',
                accessor: 'origin_use',
                Cell: row => (
                    <span>
                        {
                            (row.value?(
                                '✔️'
                            ):null)
                        }
                        {console.log(row.row)}
                    </span>
                ),
                width: 100,
                filterable: false,
            },
            {
                Header: 'Use as Destination',
                accessor: 'dest_use',
                Cell: row => (
                    <span>
                        {
                            (row.value?(
                                '✔️'
                            ):null)
                        }
                    </span>
                ),
                width: 100,
                filterable: false,
            },
            {
                Header: 'Use as Return',
                accessor: 'return_use',
                Cell: row => (
                    <span>
                        {
                            (row.value?(
                                '✔️'
                            ):null)
                        }
                    </span>
                ),
                width: 100,
                filterable: false,
            }
        ]
    }];

    render() {    
        const { classes, history } = this.props;
        const {data} = this.state.data;
        return (
            <Grid container style={{justifyContent: 'center'}}>
            <Paper className={classes.root} elevation={1} >
                <Button onClick={ () => {
                        history.goBack();
                        }
                    } color="primary" autoFocus>
                Go Back
                </Button>
                <ReactTable
                ref={(r) => {
                    this.reactTable = r;
                }}
                data={this.state.tableData}
                filterable
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value}
                columns = {this.columns}
                defaultSorted={[
                    {
                    id: "date",
                    asc: true
                    }
                ]}       
                defaultPageSize={50}
                className="-striped -highlight"
                getTrProps={(state,rowInfo, column) => {
                    console.log(rowInfo)
                    if (rowInfo){
                        if (rowInfo.original.order_id === this.state.data._id){
                            return {
                                style: {
                                    background: '#BEBEBE'
                                }
                            }
                        } else {
                            return {}
                        }
                    } else {
                        return {}
                    }

                }}
                />
                <br />
                <Tips />
                <Logo />
            </Paper>
            </Grid>
        );
    }
}

export default withStyles(styles)(Report);