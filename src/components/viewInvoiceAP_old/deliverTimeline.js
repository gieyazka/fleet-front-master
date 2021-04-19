import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Typography } from '@material-ui/core';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '90%',
    fontSize: 12,
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

// function getSteps() {
//   return ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad', 'Create an ad group', 'Create an ad'];
// }

class HorizontalLabelPositionBelowStepper extends React.Component {

  render() {
    console.log(this.props);
    const { classes } = this.props;
    const steps = [this.props.origin, ...this.props.destination];
    const time_in = [this.props.origin_geo_in, ...this.props.dest_geo_in];
    const time_out = [this.props.origin_geo_out, ...this.props.dest_geo_out];
    const return_in = this.props.return_in;
    const return_out = this.props.return_out;
    const will_return = this.props.will_return;
    const times = this.props.times.split('\n');

    return (
      <div className={classes.root}>
        <Stepper alternativeLabel style={{padding: 0, paddingTop: 10}}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel >
                  <Typography style={{fontSize: '10px'}} >
                    {label}<br />
                    {index !== 0?'Deliveries:'+ times[index-1] + ' times':''}<br />
                    {time_in[index] !== "0"?new moment(time_in[index]).add(0, 'hours').toDate().toLocaleString():'-'} <br />
                    {time_out[index] !== "0"?new moment(time_out[index]).add(0, 'hours').toDate().toLocaleString():'-'} <br /> 
                    {index === 0? will_return? return_in !== "0" ?new moment(return_in).add(0, 'hours').toDate().toLocaleString():'-':'':''}  <br />
                    {index === 0? will_return? return_out !== "0" ?new moment(return_out).add(0, 'hours').toDate().toLocaleString():'-':'':''}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
    </div>
    );
  }
}

HorizontalLabelPositionBelowStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);