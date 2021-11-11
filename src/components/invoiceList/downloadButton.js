import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import blue from '@material-ui/core/colors/blue';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class SimpleDialog extends React.Component {

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };



  render() {
    console.log(this.props);
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Select Supplier</DialogTitle>
        <div>
          <List>
            {this.props.emails.map(email => (
              <ListItem button onClick={() => this.handleListItemClick(email)} key={email}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItem>
            ))}
            </List>
        </div>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

class SimpleDialogDemo extends React.Component {
  state = {
    open: false,
    selectedValue: null,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.props.onUpdate(value);
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    
    return (
      <React.Fragment>
        {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Open simple dialog
        </Button>
         */}
        <Button variant="contained" color="primary" style={{marginBottom: 15}} onClick={this.handleClickOpen}>
                Export (csv)
            <DownloadIcon style={{marginLeft: 10}} />
        </Button>
        <SimpleDialogWrapped
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
          emails={this.props.emails}
        />
      </React.Fragment>
    );
  }
}

export default SimpleDialogDemo;