import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const styles = theme => ({
  root: {
    width: '90%',
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
    const steps = this.props.origin? [this.props.origin, ...this.props.destination]:[];

    return (
      <div className={classes.root}>
        <Stepper alternativeLabel>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
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