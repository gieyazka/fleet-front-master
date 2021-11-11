import React, { forwardRef } from 'react';
import {
  Backdrop,
  Card,
  Fade,
  Modal,
  CardContent,
  CardAction,
  Tooltip,
  IconButton,
  Button,
  Chip,
  Typography,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';

import moment from 'moment';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
// import AlertA from "./alert";
import Alert from '@material-ui/lab/Alert';
import {
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
} from '@material-ui/icons';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CloseIcon from '@material-ui/icons/Close';
import ReactExport from 'react-data-export';
import _ from 'lodash';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Dialog from './Dialog';
const ReqTable = (props) => {
  // console.log(props);

  const [tableRow, setTableRow] = React.useState({
    open: false,
    rowData: null,
  });
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  const [reqData, setReqData] = React.useState();
  const [exportExcel, setExportExcel] = React.useState(false);

  const [showForm, setShowForm] = React.useState(false);
  const [viewForm, setViewForm] = React.useState(false);
  const [viewData, setViewData] = React.useState(null);
  const userRole = localStorage.getItem('role');

  // console.log(userRole);
  const getData = async (endDate, startDate) => {
    if (userRole === 'Special') {
      return await fetch(
        `https://delivery-backend-1.powermap.live/specialrequests?request_date_lte=${startDate}&request_date_gte=${endDate}&status_ne=delete&request_by=${localStorage.getItem(
          'username'
        )}&_sort=createdAt:DESC`,
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          return res;
        });
    } else {
      return await fetch(
        `https://delivery-backend-1.powermap.live/specialrequests?request_date_lte=${startDate}&request_date_gte=${endDate}&status_ne=delete&_sort=createdAt:DESC`,
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          return res;
        });
    }
  };
  // TO DO Supplier
  const suppilerList = [
    { title: 'Nakburin', value: 'Nakburin' },
    { title: 'Siam Nistrans', value: 'Siam Nistrans' },
    { title: 'Namo', value: 'Namo' },
  ];
  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  React.useEffect(async () => {
    await getData(
      moment().subtract(15, 'days').format('YYYYMMDD'),
      moment().add(15, 'days').format('YYYYMMDD')
    ).then(async (data) => {
      //    console.log(data);
      let mappingData = _.map(data, (item) => {
        // console.log();
        let date = moment(item.request_date, 'YYYYMMDD');
        return {
          ...item,
          request_date: moment(item.request_date, 'YYYYMMDD').format(
            'DD/MM/YYYY'
          ),
        };
      });

      setReqData(mappingData);
      await dataExcel(mappingData);
    });
  }, []);

  const dataExcel = async (data) => {
    const borders = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    const style = {
      alignment: { horizontal: 'center' },
      border: borders,
      fill: { patternType: 'solid', fgColor: { rgb: '1D366D' } },
      font: {
        color: { rgb: 'ffffff' },
      },
    };
    const styleNoColor = {
      alignment: { horizontal: 'center' },
      border: borders,
    };

    let destArr,
      dest,
      destData = [];
    let destLength;
    let maxDestLength = 0;
    /** find max dest length */
    data.map((d) => {
      dest = JSON.parse(d.dest_place.split(','));

      if (dest.length > maxDestLength) {
        maxDestLength = dest.length;
      }
    });
    let column = [
      {
        title: '#',
        style: style,

        width: { wpx: 200 },
      },
      {
        title: 'Cost Company',
        style: style,

        width: { wpx: 80 },
      }, //pixels width
      {
        title: 'Suppiler',
        width: { wpx: 90 },
        style: style,
      }, //char width
      {
        title: 'Invoice Number',
        style: style,
        width: { wch: 30 },
      },
      { title: 'Job No', style: style, width: { wch: 35 } },
      { title: 'Date Submit', style: style, width: { wch: 10 } }, //char width
      { title: 'Request Date', style: style, width: { wch: 10 } }, //char width
      { title: 'Origin', style: style, width: { wpx: 80 } },
    ];
    for (let i = 0; i < 5; i++) {
      column.push({
        title: `Des ${i + 1}`,
        style: style,
        width: { wpx: 150 },
      });
    }

    column.push(
      { title: 'Product', style: style, width: { wpx: 50 } },
      { title: 'Note', style: style, width: { wpx: 90 } },
      { title: 'Return', style: style, width: { wpx: 90 } },
      { title: 'Overtime', style: style, width: { wpx: 90 } },
      { title: 'OT(hours)', style: style, width: { wpx: 90 } },
      { title: 'Department', style: style, width: { wpx: 90 } },
      // { title: "No of trip", style: style, width: { wpx: 90 } },
      { title: 'Truck Type', style: style, width: { wpx: 90 } },
      { title: 'Total Price', style: style, width: { wpx: 90 } },
      {
        title: 'Name user request',
        style: style,
        width: { wpx: 150 },
      },
      { title: 'Name Manager', style: style, width: { wpx: 150 } },
      {
        title: 'manager status',
        style: style,
        width: { wpx: 150 },
      },
      {
        title: 'Puchase status',
        style: style,
        width: { wpx: 150 },
      },
      {
        title: 'Approve by',
        style: style,
        width: { wpx: 150 },
      }
    );

    data.map((d, i) => {
      // console.log(d.request_date);
      destArr = [
        { value: i, style: styleNoColor },
        { value: d.cost, style: styleNoColor },
        { value: d.suppiler || '', style: styleNoColor },
        { value: '', style: styleNoColor },
        { value: d.job_no, style: styleNoColor },
        {
          value: moment(d.date, 'YYYYMMDD').format('DD/MM/YYYY'),
          style: styleNoColor,
        },
        {
          value: d.request_date,
          style: styleNoColor,
        },
        { value: d.start_place, style: styleNoColor },
      ];
      for (let i = 0; i < 5; i++) {
        destArr.push({
          style: styleNoColor,
          value: JSON.parse(d.dest_place.split(','))[i] || '',
        });
      }

      let managerName = null;
      let checkJson = isJson(d.approve_by)
      if (checkJson === false) {
        d.approve_by = JSON.stringify(d.approve_by)
      }

      JSON.parse(d.approve_by)
        .split(',')
        .map((r) => {
          if (managerName != null) {
            return (managerName += ',' + r.substr(0, r.indexOf('@')));
          } else {
            return (managerName = r.substr(0, r.indexOf('@')));
          }
        });

      destArr.push(
        { value: d.product, style: styleNoColor },
        { value: d.purpose, style: styleNoColor },
        { value: d.return, style: styleNoColor },
        { value: d.Overtime, style: styleNoColor },
        { value: d.OT_time || '', style: styleNoColor },
        { value: d.department || '', style: styleNoColor },
        // { value: "No of trip", style: styleNoColor },
        { value: d.car_type, style: styleNoColor },
        { value: '', style: styleNoColor },
        { value: d.request_by, style: styleNoColor },
        { value: managerName, style: styleNoColor },
        { value: d.status, style: styleNoColor },
        { value: d.purchase_status, style: styleNoColor },
        { value: d.approve_manager, style: styleNoColor }
      );
      destData.push(destArr);
      return null;
    });

    const multiDataSet = [
      {
        columns: column,
        data: destData,
      },
    ];

    setExportExcel({ status: true, data: multiDataSet });
  };

  React.useEffect(() => {
    if (exportExcel.status === true) {
      setExportExcel({ ...exportExcel, status: false });
    }
  }, [exportExcel]);
  const [alert, setAlert] = React.useState({
    text: null,
    error: false,
    success: false,
  });
  const [dateFilter, setDateFilter] = React.useState({
    startDate: moment().subtract(15, 'days'),
    endDate: moment().add(15, 'days'),
  });

  const handleDateChange = async (e, type) => {
    if (type === 'startDate') {
      // check if date after end data
      if (
        new moment(e).startOf('day') >
        new moment(dateFilter.endDate).endOf('day')
      ) {
        return setAlert({
          ...alert,
          error: true,
          text: 'Not correct start date',
        });
      }
      setAlert({ ...alert, error: false, text: '' });
      setDateFilter({ ...dateFilter, startDate: e });
      // console.log(moment(e).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD'));
      await getData(
        moment(e).format('YYYYMMDD'),
        dateFilter.endDate.format('YYYYMMDD')
      ).then(async (res) => {
        let mappingData = _.map(res, (item) => {
          // console.log(item);
          return {
            ...item,
            request_date: moment(item.request_date, 'YYYYMMDD').format(
              'DD/MM/YYYY'
            ),
          };
        });

        setReqData(mappingData);
        await dataExcel(mappingData);
      });
    }
    if (type == 'endDate') {
      // check if date before start data
      if (
        new moment(e).endOf('day') <
        new moment(dateFilter.startDate).startOf('day')
      ) {
        return setAlert({
          ...alert,
          error: true,
          text: 'Not correct end date',
        });
      }
      setAlert({ ...alert, error: false, text: '' });
      setDateFilter({ ...dateFilter, endDate: e });
      await getData(
        moment(dateFilter.startDate).format('YYYYMMDD'),
        e.format('YYYYMMDD')
      ).then(async (res) => {
        let mappingData = _.map(res, (item) => {
          // console.log(item);
          return {
            ...item,
            request_date: moment(item.request_date, 'YYYYMMDD').format(
              'DD/MM/YYYY'
            ),
          };
        });

        setReqData(mappingData);
        await dataExcel(mappingData);
      });
    }
  };
  const updateJson = async (id) => {
    await fetch(
      `https://delivery-backend-1.powermap.live/specialrequests/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          approve_by: JSON.stringify('wuthinan.j@aapico.com')
        }),
      }
    )
  }
  const purchaseApprove = async (data) => {
    // console.log(data, data._id);
    if (data.suppiler === null) {
      setAlert({ ...alert, error: true, text: 'Please select suppiler' });
      return;
    }
    setAlert({ ...alert, error: false, text: 'Please select suppiler' });
    await fetch(
      `https://delivery-backend-1.powermap.live/specialrequests/${data._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          cost: data.cost,
          car_type: data.car_type,
          product: data.product,
          suppiler: data.suppiler,
          request_date: moment(data.request_date, 'DD/MM/YYYY').format(
            'YYYYMMDD'
          ),
          arrive_time: data.arrive_time,
          purpose: data.purpose,
          Overtime: data.Overtime,
          OT_time: data.OT_time,
          purchase_status: 'approved',
        }),
      }
    )
      .then((response) => response.json())
      .then(async (res) => {
        await getData(
          moment(dateFilter.startDate).format('YYYYMMDD'),
          dateFilter.endDate.format('YYYYMMDD')
        ).then(async (res) => {
          let mappingData = _.map(res, (item) => {
            console.log(item);
            return {
              ...item,
              request_date: moment(item.request_date, 'YYYYMMDD').format(
                'DD/MM/YYYY'
              ),
            };
          });

          setReqData(mappingData);
          await dataExcel(mappingData);
        });
        setAlert({ success: true, error: false, text: 'Update success' });
      });
  };

  // React.useEffect(() => {
  //   getData(dateFilter.endDate.format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD')).then(async res => {
  //     setReqData(res);
  //   })
  // }, [showForm])

  if (showForm)
    return (
      <Dialog
        show={showForm}
        type={'create'}
        handleCloseForm={() => {
          props.history.go();
          setShowForm(false);
        }}
      />
    );
  if (viewForm)
    return (
      <Dialog
        show={viewForm}
        type={'view'}
        handleCloseForm={() => setViewForm(false)}
        data={viewData}
      />
    );
  // console.log(exportExcel.data);
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <>
        {/* <button onClick={() => updateJson("61721e7a49af4a6615b6151a")}>update</button> */}
        <div
          style={{
            marginRight: '4vw',
            marginLeft: '4vw',
            marginTop: '4vw',
            marginBottom: '4vw',
            maxWidth: '100%',
          }}
        >
          <Card style={{ marginBottom: 4 }}>
            <CardContent
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                // marginLeft: 'auto',
                // marginRight: 'auto'
              }}
            >
              <Grid container justifyContent={'flex-start'}>
                <Button
                  style={{ float: 'left' }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowForm(true);
                    // window.open(`${window.location.origin}/form`, 'SPECIAL REQUEST FORM')
                  }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  New Request
                </Button>
              </Grid>
              <DatePicker
                style={{ paddingRight: '24px' }}
                label="Start date"
                value={dateFilter.startDate}
                onChange={(e) => handleDateChange(e, 'startDate')}
                // value={getValues('requestDate')}

                autoOk
                format="DD/MM/YYYY"
              />
              <DatePicker
                style={{ paddingRight: '24px' }}
                label="End Date"
                value={dateFilter.endDate}
                onChange={(e) => handleDateChange(e, 'endDate')}
                // value={getValues('requestDate')}
                autoOk
                format="DD/MM/YYYY"
              />
            </CardContent>
          </Card>
          {alert.error === true ? (
            <div style={{ paddingBottom: '4px' }}>
              <Alert severity="error">{alert.text}</Alert>
            </div>
          ) : null}
          {alert.success === true ? (
            <div style={{ paddingBottom: '4px' }}>
              <Alert severity="success">{alert.text}</Alert>
            </div>
          ) : null}
          <MaterialTable
            style={{
              paddingLeft: 20,
              paddingRight: 20,
            }}
            icons={tableIcons}
            columns={[
              { title: '', field: '', editable: 'never', width: 50 },
              userRole === 'Administrator' || userRole === 'purchaser'
                ? {
                  title: 'Approve',
                  render: (rowData) => {
                    return (
                      <Tooltip title="Approve">
                        <Button
                          style={{ fontSize: '12px', width: '80px' }}
                          onClick={() => purchaseApprove(rowData)}
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={
                            rowData.purchase_status === 'waiting' &&
                              rowData.status === 'approved'
                              ? false
                              : true
                          }
                        >
                          Approve
                        </Button>
                        {/* <IconButton aria-label="Approve" color='primary'>
                        <ThumbUpIcon style={{ cursor: 'pointer' }} />
                        </IconButton> */}
                      </Tooltip>
                    );
                  },
                  width: 100,
                }
                : { title: '', field: '', width: 20 },
              {
                title: 'Request by',
                field: 'request_by',
                editable: 'never',
                width: 100,
              },
              {
                title: 'Purchase status',
                field: 'purchase_status',
                editable: 'never',
                width: 110,
                render: (rowData) => {
                  // console.log(rowData);
                  switch (rowData.purchase_status) {
                    case 'waiting':
                      return (
                        <Chip
                          size="small"
                          icon={
                            <HourglassEmptyIcon style={{ color: '#FFFFFF' }} />
                          }
                          style={{
                            backgroundColor: '#F0AD4E',
                            color: '#FFFFFF',
                          }}
                          label={rowData.purchase_status}
                        />
                      );
                    case 'approved':
                      return (
                        <Chip
                          size="small"
                          icon={<DoneAllIcon style={{ color: '#FFFFFF' }} />}
                          style={{
                            backgroundColor: '#5CB85C',
                            color: '#FFFFFF',
                          }}
                          label={rowData.purchase_status}
                        />
                      );
                    case 'rejected':
                      return (
                        <Chip
                          size="small"
                          icon={<CloseIcon style={{ color: '#FFFFFF' }} />}
                          style={{
                            backgroundColor: '#C90D0D',
                            color: '#FFFFFF',
                          }}
                          label={rowData.purchase_status}
                        />
                      );
                    default:
                      return null;
                  }
                },
              },
              {
                title: 'Job No',
                field: 'job_no',
                editable: 'never',
                width: 120,
                render: (rowData) => {
                  return (
                    <Button
                      aria-label="view"
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      size="small"
                      onClick={() => {
                        setViewForm(true);
                        setViewData(rowData);
                      }}
                    >
                      {rowData.job_no}
                    </Button>
                  );
                },
              },
              {
                title: 'Manager status',
                editable: 'never',
                field: 'status',
                width: 150,
                render: (rowData) => {
                  // console.log(rowData);
                  switch (rowData.status) {
                    case 'waiting':
                      return (
                        <Chip
                          size="small"
                          icon={
                            <HourglassEmptyIcon style={{ color: '#FFFFFF' }} />
                          }
                          style={{
                            backgroundColor: '#F0AD4E',
                            color: '#FFFFFF',
                          }}
                          label={rowData.status}
                        />
                      );
                    case 'approved':
                      return (
                        <Chip
                          size="small"
                          icon={<DoneAllIcon style={{ color: '#FFFFFF' }} />}
                          style={{
                            backgroundColor: '#5CB85C',
                            color: '#FFFFFF',
                          }}
                          label={rowData.status}
                        />
                      );
                    case 'rejected':
                      return (
                        <Chip
                          size="small"
                          icon={<CloseIcon style={{ color: '#FFFFFF' }} />}
                          style={{
                            backgroundColor: '#C90D0D',
                            color: '#FFFFFF',
                          }}
                          label={rowData.status}
                        />
                      );
                    default:
                      return null;
                  }
                },
              },
              {
                title: 'suppiler',
                width: 150,
                field: 'suppiler',
                editComponent: (props) => (
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={suppilerList.map((option) => option.title)}
                    value={props.value}
                    onChange={(e, v) => props.onChange(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Suppiler"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e, v) => props.onChange(e.target.value)}
                        value={props.value}
                      />
                    )}
                  />
                ),
                // editComponent: props => (
                //   <input
                //     type="text"
                //     value={props.value}
                //     onChange={e => props.onChange(e.target.value)}
                //   />
                // )
              },
              { title: 'Cost', field: 'cost', width: 100 },
              { title: 'Type of car', field: 'car_type', width: 150 },
              { title: 'Product', field: 'product', width: 150 },
              {
                title: 'Request date',
                editComponent: (props) => {
                  // console.log(props);
                  return (
                    <DatePicker
                      label="Date"
                      // onChange={handleDateChange}

                      value={moment(props.value, 'DD/MM/YYYY')}
                      // value={props.value === 'Invalid date' ? console.log(props, props.value instanceof moment, moment(props.value, 'DD/MM/YYYY') instanceof moment) : moment(props.value, 'DD/MM/YYYY')}
                      onChange={(e, v) => {
                        // console.log(e, v);
                        props.onChange(e);
                      }}
                      autoOk
                      // disablePast
                      fullWidth={true}
                      format="DD/MM/YYYY"
                    />
                  );
                },
                field: 'request_date',
                width: 100,
              },

              { title: 'Arrive time', field: 'arrive_time', width: 100 },
              { title: 'Start place', field: 'start_place', width: 150 },
              {
                title: 'Destination',
                render: (rowData) => JSON.parse(rowData.dest_place) + ' ',
                editable: 'never',
                width: 200,
              },
              { title: 'OT', field: 'Overtime', width: 100 },
              { title: 'OT(Hours)', field: 'OT_time', width: 100 },
              { title: 'Purpose', field: 'purpose', width: 150 },
              {
                title: 'Approve by',
                editable: 'never',
                field: 'approve_manager',
                width: 200,
              },
            ]}
            data={reqData}
            actions={[
              {
                icon: () => (
                  <ExcelFile
                    element={<SaveAlt style={{ marginTop: 6 }} />}
                    filename="Delivery Request"
                  >
                    <ExcelSheet
                      dataSet={exportExcel.data}
                      name="Delivery Request"
                    ></ExcelSheet>
                  </ExcelFile>
                ),
                tooltip: 'Export Xlsx ',
                isFreeAction: true,
              },
              // {
              //   icon: () => (
              //     <ThumbUpIcon />
              //   ),
              //   tooltip: "Approve",
              //   onClick: (event, rowData) => {
              //     console.log({ rowData: rowData, open: true });
              //   },
              // },
            ]}
            editable={
              userRole === 'issuer' || userRole === 'Special'
                ? {
                  isDeletable: (rowData) =>
                    !(
                      rowData.purchase_status === 'approved' &&
                      rowData.status === 'approved'
                    ), // only name(a) rows would be editable
                  onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                      // setTimeout(() => {
                      // console.log(oldData);
                      resolve(
                        fetch(
                          `https://delivery-backend-1.powermap.live/specialrequests/${oldData._id}`,
                          {
                            method: 'PUT',
                            headers: {
                              'Content-Type':
                                'application/json;charset=UTF-8',
                            },
                            body: JSON.stringify({ status: 'delete' }),
                          }
                        )
                          .then((response) => response.json())
                          .then(async (res) => {
                            await getData(
                              moment(dateFilter.startDate).format('YYYYMMDD'),
                              dateFilter.endDate.format('YYYYMMDD')
                            ).then(async (res) => {
                              let mappingData = _.map(res, (item) => {
                                console.log(item);
                                return {
                                  ...item,
                                  request_date: moment(
                                    item.request_date,
                                    'YYYYMMDD'
                                  ).format('DD/MM/YYYY'),
                                };
                              });

                              setReqData(mappingData);
                              await dataExcel(mappingData);
                            });
                            // setAlert({ success: true, error: false })
                          })
                      );
                    }),
                }
                : userRole === 'Administrator' || userRole === 'purchaser'
                  ? {
                    isEditable: (rowData) =>
                      userRole === 'purchaser' ||
                      (rowData.purchase_status === 'waiting' &&
                        rowData.status === 'approved'), // only name(a) rows would be editable
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        // setTimeout(() => {
                        // console.log(oldData);
                        resolve(
                          fetch(
                            `https://delivery-backend-1.powermap.live/specialrequests/${oldData._id}`,
                            {
                              method: 'PUT',
                              headers: {
                                'Content-Type':
                                  'application/json;charset=UTF-8',
                              },
                              body: JSON.stringify({ status: 'delete' }),
                            }
                          )
                            .then((response) => response.json())
                            .then(async (res) => {
                              await getData(
                                moment(dateFilter.startDate).format('YYYYMMDD'),
                                dateFilter.endDate.format('YYYYMMDD')
                              ).then(async (res) => {
                                let mappingData = _.map(res, (item) => {
                                  console.log(item);
                                  return {
                                    ...item,
                                    request_date: moment(
                                      item.request_date,
                                      'YYYYMMDD'
                                    ).format('DD/MM/YYYY'),
                                  };
                                });

                                setReqData(mappingData);
                                await dataExcel(mappingData);
                              });
                              // setAlert({ success: true, error: false })
                            })
                        );
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        // setTimeout(() => {

                        newData.request_date = moment(
                          newData.request_date,
                          'DD/MM/YYYY'
                        ).format('DD/MM/YYYY');
                        // console.log(newData, oldData);
                        const dataUpdate = [...reqData];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        // console.log(newData);

                        setReqData([...dataUpdate]);

                        resolve();
                        // }, 1000)
                      }),
                  }
                  : null
            }
            options={{
              tableLayout: 'flex',
              //   fixedColumns: {
              //     left: 6
              //   },

              padding: 'dense',

              // exportButton: true,
              // exportCsv: async (columns, data) => {
              //   await excelData(data);
              //   // return columns, data;
              // },
              search: true,

              headerStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Bai Jamjuree',

                // minWidth: "100px",
              },
              cellStyle: {
                fontFamily: 'Bai Jamjuree',
                padding: 5,
              },
              rowStyle: {
                // textAlign : 'right',
                // backgroundColor: 'yellow'
              },
            }}
            localization={{
              header: {
                actions: 'Edit',
              },
              body: {
                editRow: {
                  deleteText: (
                    <div
                      style={{
                        paddingLeft: '100px',
                        fontFamily: 'Bai Jamjuree',
                      }}
                    >
                      คุณแน่ใจหรือไม่ว่าจะลบคำขอนี้ ?
                    </div>
                  ),
                },
              },
            }}
            title={
              <Typography variant="h6" style={{ fontFamily: 'Bai Jamjuree' }}>
                Special Delivery Request
              </Typography>
            }
          />
          {/* {exportExcel.status == true && (
          // <ExcelFile element={<button>Download Data</button>} filename="Delivery Request">
          <ExcelFile hideElement={true} filename="Delivery Request">
            <ExcelSheet
              dataSet={exportExcel.data}
              name="Delivery Request"
            ></ExcelSheet>
          </ExcelFile>
        )} */}
        </div>
      </>
    </MuiPickersUtilsProvider>
  );
};
export default ReqTable;
