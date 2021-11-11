import React from 'react';
import Form from '@rjsf/material-ui';
import { Paper, Grid, Button, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import aapicoLogo from '../../assets/images/aapico_logo.png';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
});

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}) => {
  const classes = useStyles();

  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container={true} spacing={2} className={classes.root}>
        {properties.map((element, index) => {
          console.log(element);
          let colSize = 4;
          if (
            element.name.includes('start') ||
            element.name.includes('dest') ||
            element.name.includes('return') ||
            element.name.includes('Overtime') ||
            element.name.includes('OT_time') ||
            element.name.includes('createdAt') ||
            element.name.includes('car_type')
          ) {
            colSize = 4;
          }
          if (
            element.name.includes('job_no') ||
            element.name.includes('cost')
          ) {
            colSize = 2;
          }

          if (
            element.name.includes('product') ||
            element.name.includes('request_date') ||
            element.name.includes('arrive_time') ||
            element.name.includes('purpose')
          ) {
            colSize = 4;
          }

          return (
            <Grid
              item={true}
              xs={colSize}
              key={index}
              style={{ marginBottom: '0px' }}
            >
              {console.log(element.content)}
              {React.cloneElement(
                element.content,

                { readonly: true }
                // {style : {{ color : 'black'} }}
              )}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const schema = {
  type: 'object',
  required: ['createAt', 'JobNo'],
  properties: {
    createdAt: {
      type: 'string',
      title: 'Created Date',
    },
    job_no: {
      type: 'string',
      title: 'Job No.',
    },
    cost: {
      type: 'string',
      title: 'Cost',
    },
    car_type: {
      type: 'string',
      title: 'Vehicle Type',
    },
    product: {
      type: 'string',
      title: 'Products',
    },

    request_date: {
      type: 'string',
      title: 'Required Date',
    },
    arrive_time: {
      type: 'string',
      title: 'Needed Time',
    },
    start_place: {
      type: 'string',
      title: 'Origin',
    },
    start_contact: {
      type: 'string',
      title: 'Contact',
    },
    start_tel: {
      type: 'string',
      title: 'Tel.',
    },
    dest_place: {
      type: 'string',
      title: 'Destination',
    },
    dest_contact: {
      type: 'string',
      title: 'Contact',
    },
    dest_tel: {
      type: 'string',
      title: 'Tel.',
    },
    return: {
      type: 'string',
      title: 'Return',
    },

    Overtime: {
      type: 'string',
      title: 'OT',
    },
    'OT_time,': {
      type: 'string',
      title: 'OT Hours',
    },

    purpose: {
      type: 'string',
      title: 'Purpose',
    },
    request_by: {
      type: 'string',
      title: 'Request By',
    },
    approve_manager: {
      type: 'string',
      title: 'Approved By',
    },
  },
};

const ViewDataForm = React.forwardRef(({ props }, ref) => {
  // console.log(props.data);
  props.data.createdAt = new moment(props.data.createdAt).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  const newData = {
    ...props.data,
    dest_place: JSON.parse(props.data.dest_place) + ' ',
    dest_contact: JSON.parse(props.data.dest_contact) + ' ',
    dest_tel: JSON.parse(props.data.dest_tel) + ' ',
  };
  return (
    <Grid container justify="center">
      <Paper
        style={{
          width: '80%',
          padding: 20,
          paddingBottom: 40,
          marginTop: 20,
        }}
      >
        <div style={{ padding: 40 }} ref={ref}>
          <div style={{ margin: 'auto', width: 'fit-content' }}>
            <img src={aapicoLogo} style={{ width: 96 }}></img>
          </div>
          <Form
            schema={schema}
            formData={newData}
            uiSchema={{
              'ui:ObjectFieldTemplate': ObjectFieldTemplate,
            }}
          >
            <React.Fragment />
          </Form>

          <Divider
            variant="middle"
            style={{
              margin: '40px 0px 20px 0px',
              borderTop: '4px dotted rgba(0, 0, 0, 0.98)',
            }}
          />
          <Typography style={{ float: 'right', marginRight: 10 }}>
            <i> For driver only</i>
          </Typography>

          <Form
            schema={schema}
            formData={newData}
            uiSchema={{
              'ui:ObjectFieldTemplate': ObjectFieldTemplate,
            }}
          >
            <React.Fragment />
          </Form>
        </div>
      </Paper>
    </Grid>
  );
});

const ViewForm = (props) => {
  const componentRef = React.useRef();

  return (
    <div>
      <br />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: 'calc(100vw - 64px)',
        }}
      >
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="primary">
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </div>

      <ViewDataForm props={props} ref={componentRef} />
    </div>
  );
};

export default ViewForm;
