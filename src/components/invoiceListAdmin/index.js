import React, { Component } from "react";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import server from "../../config";
import axios from "axios";
import { promises } from "fs";
import ListSelect from "./listSelect";
import Table from "./table";
import moment from "moment";

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: "center",
    marginBottom: "10px",
    marginTop: "10px",
    width: "80%",
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
  searchBox: {
    margin: "10px",
  },
});

// load available data from server
const status = [
  { label: "new", id: "status" },
  { label: "GPS_error", id: "status" },
  { label: "match", id: "status" },
  { label: "confirm", id: "status" },
  { label: "void", id: "status" },
  { label: "delivering", id: "status" },
].map((suggestion) => ({
  value: suggestion.label,
  label: suggestion.label,
  id: suggestion.id,
}));

class PaperSheet extends Component {
  state = {
    status: "",
    supplier: "",
    start_date: new moment()
      .add(0, "hours")
      .toDate()
      .toISOString()
      .slice(0, 10),
    end_date: new moment()
      .add(0, "hours")
      .toDate()
      .toISOString()
      .slice(0, 10),
    plate_no: "",
    destination: "",
    job_no: "",
    suppliers: [],
    plate_nos: [],
    destinations: [],
    companies: [],
    data: [],
    isClear: false,
    loading: true,
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  /** Component will mount */
  componentWillMount = async () => {
    // load supplier
    const suppliers = axios.get(`${server.url}/suppliers`).then((res) =>
      res.data.map((result) => {
        return { label: result.name, id: "supplier" };
      })
    );
    //  for poi and vehicle
    const appList = [];
    const supplier = [];
    await axios.get(`${server.url}/suppliers`).then(async (res) =>
      res.data.map(async (result) => {
        console.log(result);
        supplier.push(result.name);
        appList.push(result.appid);
      })
    );
    console.log(supplier);
    const pois = axios
      .get(
        `${server.url}/pois?_sort=name:DESC&_limit=1000&appid=${appList.join(
          "&appid="
        )}`
      )
      .then((res) =>
        res.data.map((result) => {
          return { label: result.name, id: "poi" };
        })
      );
    const vehicles = axios
      .get(
        `${
          server.url
        }/vehicles?_sort=plate_no:DESC&_limit=1000&appid=${appList.join(
          "&appid="
        )}`
      )
      .then((res) =>
        res.data.map((result) => {
          return { label: result.plate_no, id: "vehicle" };
        })
      );
    const companies = axios
      .get(`${server.url}/companies?_sort=plate_no:DESC&_limit=1000`)
      .then((res) =>
        res.data.map((result) => {
          return { label: result.name, id: "company" };
        })
      );

    Promise.all([suppliers, pois, vehicles, companies]).then((result) => {
      this.setState({
        suppliers: result[0],
        destinations: Object.values(
          result[1].reduce(
            (acc, cur) => Object.assign(acc, { [cur.label]: cur }),
            {}
          )
        ),
        plate_nos: result[2],
        companies: result[3],
      });
    });
    //  .then(()=>{
    axios
      .get(
        `${server.url}/orders?created_date_gt=${new moment()
          .add(0, "hours")
          .toDate()
          .toISOString()
          .slice(0, 10)}&_sort=created_date:DESC`
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          data: res.data,
          loading: false,
        });
      });
    //  })
  };

  onUpdate = (val) => {
    this.setState({
      isClear: false,
    });
    console.log(val);
    switch (val[0].id) {
      case "status":
        let statusState =
          val[0].value === "" ? "" : val.map((res) => res.value);
        this.setState({
          status: statusState,
        });
        break;
      case "vehicle":
        let vehState = val[0].value === "" ? "" : val.map((res) => res.value);
        this.setState({
          plate_no: vehState,
        });
        break;
      case "poi":
        let poiState = val[0].value === "" ? "" : val.map((res) => res.value);
        this.setState({
          destination: poiState,
        });
        break;
      case "supplier":
        let supState = val[0].value === "" ? "" : val.map((res) => res.value);
        this.setState({
          supplier: supState,
        });
        break;
      case "company":
        let comState = val[0].value === "" ? "" : val.map((res) => res.value);
        this.setState({
          company: comState,
        });
        break;
      default:
        return null;
    }
  };

  /** Submit query to server*/
  handleSubmit() {
    // create query word
    const q_job = this.state.job_no ? `job_no=${this.state.job_no}` : "";
    var q_start_date = "";
    var q_end_date = "";
    // if (this.state.start_date === this.state.end_date){
    //     q_start_date = `created_date_gte=${moment(this.state.start_date).startOf('day')}`;
    //     q_end_date = '';
    // } else {
    q_start_date = `created_date_gte=${moment(this.state.start_date).startOf(
      "day"
    )}`;
    q_end_date = `created_date_lte=${moment(this.state.end_date).endOf("day")}`;
    // }
    const q_status = this.state.status
      ? this.state.status.map((result) => `status=${result}&`).join("")
      : "";
    const q_supplier = this.state.supplier
      ? this.state.supplier.map((result) => `supplier=${result}&`).join("")
      : "";
    const q_plate_no = this.state.plate_no
      ? this.state.plate_no.map((result) => `plate_no=${result}&`).join("")
      : "";
    const q_destination = this.state.destination
      ? this.state.destination
          .map((result) => `destination_containss=${result}&`)
          .join("")
      : "";
    const q_company = this.state.company
      ? this.state.company.map((result) => `company_name=${result}&`).join("")
      : "";

    /** Included compnay ID from user */
    const all_query =
      q_destination +
      q_plate_no +
      q_status +
      q_supplier +
      q_job +
      "&" +
      q_start_date +
      "&" +
      q_end_date +
      "&" +
      q_company +
      "&_limit=1000000";

    console.log(all_query);
    this.setState({
      loading: true,
    });
    axios
      .get(`${server.url}/orders?${all_query}&_sort=created_date:DESC`)
      .then((res) => {
        console.log(res);
        this.setState({
          data: res.data,
          loading: false,
        });
      });
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
    console.log(this.state);
    console.log(230, this.state.companies);
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
      <Grid container style={{ justifyContent: "center" }}>
        {/* serach panel */}
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            Orders search
          </Typography>
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container style={{ justifyContent: "center" }}>
              <Grid item xs={3}>
                <ListSelect
                  inputs={this.state.companies}
                  placeholder={"select Company"}
                  onUpdate={this.onUpdate}
                  clear={this.state.isClear}
                />
              </Grid>
              <Grid item xs={1} className={classes.searchBox}>
                <TextField
                  id="standard-number"
                  label="Job No."
                  value={this.state.job_no}
                  onChange={this.handleChange("job_no")}
                  type="text"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid xs={3} className={classes.searchBox} item>
                <TextField
                  id="date"
                  label="Start Date"
                  type="date"
                  // defaultValue={new Date().toISOString().slice(0,10)}
                  value={this.state.start_date}
                  className={classes.textField}
                  onChange={this.handleChange("start_date")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid xs={3} className={classes.searchBox} item>
                <TextField
                  id="date"
                  label="End Date"
                  type="date"
                  // defaultValue={new Date().toISOString().slice(0,10)}
                  className={classes.textField}
                  onChange={this.handleChange("end_date")}
                  value={this.state.end_date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container style={{ justifyContent: "center" }}>
              <Grid item xs={2}>
                <ListSelect
                  inputs={status}
                  placeholder={"select status"}
                  onUpdate={this.onUpdate}
                  clear={this.state.isClear}
                />
              </Grid>
              <Grid item xs={3}>
                <ListSelect
                  inputs={this.state.suppliers}
                  placeholder={"select suppliers"}
                  onUpdate={this.onUpdate}
                  clear={this.state.isClear}
                />
              </Grid>
              <Grid item xs={3}>
                <ListSelect
                  inputs={this.state.plate_nos}
                  placeholder={"select vehicles"}
                  onUpdate={this.onUpdate}
                  clear={this.state.isClear}
                />
              </Grid>
              <Grid item xs={4}>
                <ListSelect
                  inputs={this.state.destinations}
                  placeholder={"select destinations"}
                  onUpdate={this.onUpdate}
                  clear={this.state.isClear}
                />
              </Grid>
            </Grid>
          </form>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.handleSubmit()}
          >
            Search
            {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
            <SearchIcon className={classes.rightIcon} />
          </Button>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={() => {
              this.setState({
                status: "",
                supplier: "",
                start_date: new moment()
                  .add(0, "hours")
                  .toDate()
                  .toISOString()
                  .slice(0, 10),
                end_date: new moment()
                  .add(0, "hours")
                  .toDate()
                  .toISOString()
                  .slice(0, 10),
                plate_no: "",
                destination: "",
                job_no: "",
                isClear: true,
              });
            }}
          >
            Clear Filter
            <DeleteIcon className={classes.rightIcon} />
          </Button>
        </Paper>

        {/* table result */}
        <Paper className={classes.root} elevation={1}>
          {!this.state.loading ? (
            <Table
              data={this.state.data}
              history={this.props.history}
              startDate={this.state.start_date}
              endDate={this.state.end_date}
            />
          ) : (
            <LinearProgress color="secondary" />
          )}
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(PaperSheet);
