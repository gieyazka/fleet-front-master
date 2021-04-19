import React, { forwardRef } from "react";
import { useParams } from "react-router-dom";
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
} from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import MaterialTable from "material-table";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
} from "@material-ui/icons";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ReactExport from "react-data-export";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { get } from "react-hook-form";
const ReqTable = () => {
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
  const userRole = localStorage.getItem("role")
  // console.log(userRole);
  const getData = async (endDate, startDate) => {
    if (userRole === 'Special') {
      return await fetch(
        `https://delivery-backend-1.powermap.live/specialrequests?request_date_lte=${startDate}&request_date_gte=${endDate}&status_ne=delete&request_by=${localStorage.getItem("username")}&_sort=request_date:DESC`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          return res;
        });
    } else {
      return await fetch(
        `https://delivery-backend-1.powermap.live/specialrequests?request_date_lte=${startDate}&request_date_gte=${endDate}&status=approved&_sort=request_date:DESC`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          return res;
        });
    }

  };
  const suppilerList = [
    { title: 'Nakburin', value: "Nakburin" },
    { title: 'Siam Nistrans', value: "Siam Nistrans" },
    { title: 'Namo', value: "Namo" },
  ]



  React.useState(async () => {
    await getData(moment().subtract(15, 'days').format('YYYYMMDD'), moment().add(15, 'days').format('YYYYMMDD')).then(async (data) => {
      setReqData(data);
      await dataExcel(data)
    });
  }, []);

  const dataExcel = async (data) => {
    const borders = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    const style = {
      alignment: { horizontal: "center" },
      border: borders,
      fill: { patternType: "solid", fgColor: { rgb: "1D366D" } },
      font: {
        color: { rgb: "ffffff" },
      },
    };
    const styleNoColor = {
      alignment: { horizontal: "center" },
      border: borders,
    };

    let destArr,
      dest,
      destData = [];
    let destLength;
    let maxDestLength = 0;
    /** find max dest length */
    data.map((d) => {
      dest = JSON.parse(d.dest_place.split(","));

      if (dest.length > maxDestLength) {
        maxDestLength = dest.length;
      }
    });
    let column = [
      {
        title: "#",
        style: style,

        width: { wpx: 200 },
      },
      {
        title: "Cost Company",
        style: style,

        width: { wpx: 80 },
      }, //pixels width
      {
        title: "Suppiler",
        width: { wpx: 90 },
        style: style,
      }, //char width
      {
        title: "Invoice Number",
        style: style,
        width: { wch: 30 },
      },
      { title: "Job No", style: style, width: { wch: 35 } },
      { title: "Date Submit", style: style, width: { wch: 10 } }, //char width
      { title: "Origin", style: style, width: { wpx: 80 } },
    ];
    for (let i = 0; i < 5; i++) {
      column.push({
        title: `Des ${i + 1}`,
        style: style,
        width: { wpx: 150 },
      });
    }

    column.push(
      { title: "Product", style: style, width: { wpx: 50 } },
      { title: "Note", style: style, width: { wpx: 90 } },
      { title: "Return", style: style, width: { wpx: 90 } },
      { title: "Overtime", style: style, width: { wpx: 90 } },
      { title: "Department", style: style, width: { wpx: 90 } },
      { title: "No of trip", style: style, width: { wpx: 90 } },
      { title: "Truck Type", style: style, width: { wpx: 90 } },
      { title: "Total Price", style: style, width: { wpx: 90 } },
      {
        title: "Name user request",
        style: style,
        width: { wpx: 150 },
      },
      { title: "Name Manager", style: style, width: { wpx: 150 } },
      {
        title: "manager status",
        style: style,
        width: { wpx: 150 },
      },
      {
        title: "Puchase status",
        style: style,
        width: { wpx: 150 },
      }
    );

    data.map((d, i) => {
      destArr = [
        { value: i, style: styleNoColor },
        { value: d.cost, style: styleNoColor },
        { value: d.suppiler || "", style: styleNoColor },
        { value: 0, style: styleNoColor },
        { value: d.job_no, style: styleNoColor },
        { value: moment(d.date, 'YYYYMMDD').format("DD/MM/YYYY"), style: styleNoColor },
        { value: d.start_place, style: styleNoColor },
      ];
      for (let i = 0; i < 5; i++) {
        destArr.push({
          style: styleNoColor,
          value: JSON.parse(d.dest_place.split(","))[i] || "",
        });
      }

      let managerName = null;
      JSON.parse(d.approve_by)
        .split(",")
        .map((r) => {
          if (managerName != null) {
            managerName += "," + r.substr(0, r.indexOf("@"));
          } else {
            managerName = r.substr(0, r.indexOf("@"));
          }
        });
      destArr.push(
        { value: d.product, style: styleNoColor },

        { value: d.purpose, style: styleNoColor },
        { value: d.return, style: styleNoColor },
        { value: "Yes", style: styleNoColor },
        { value: "department", style: styleNoColor },
        { value: "No of trip", style: styleNoColor },
        { value: d.car_type, style: styleNoColor },
        { value: "Total Price", style: styleNoColor },
        { value: d.request_by, style: styleNoColor },
        { value: managerName, style: styleNoColor },
        { value: d.status, style: styleNoColor },
        { value: d.purchase_status, style: styleNoColor },
      );
      destData.push(destArr);
    });

    const multiDataSet = [
      {
        columns: column,

        data: destData,
      },
    ];

    setExportExcel({ status: true, data: multiDataSet });
  }

  // const excelData = async (data) => {
  //   const borders = {
  //     top: { style: "thin" },
  //     bottom: { style: "thin" },
  //     left: { style: "thin" },
  //     right: { style: "thin" },
  //   };
  //   const style = {
  //     alignment: { horizontal: "center" },
  //     border: borders,
  //     fill: { patternType: "solid", fgColor: { rgb: "1D366D" } },
  //     font: {
  //       color: { rgb: "ffffff" },
  //     },
  //   };
  //   const styleNoColor = {
  //     alignment: { horizontal: "center" },
  //     border: borders,
  //   };

  //   let destArr,
  //     dest,
  //     destData = [];
  //   let destLength;
  //   let maxDestLength = 0;
  //   /** find max dest length */
  //   data.map((d) => {
  //     dest = JSON.parse(d.dest_place.split(","));

  //     if (dest.length > maxDestLength) {
  //       maxDestLength = dest.length;
  //     }
  //   });
  //   let column = [
  //     {
  //       title: "#",
  //       style: style,

  //       width: { wpx: 80 },
  //     },
  //     {
  //       title: "Cost Company",
  //       style: style,

  //       width: { wpx: 80 },
  //     }, //pixels width
  //     {
  //       title: "Suppiler",
  //       width: { wpx: 90 },
  //       style: style,
  //     }, //char width
  //     {
  //       title: "Invoice Number",
  //       style: style,
  //       width: { wch: 30 },
  //     },
  //     { title: "Job No", style: style, width: { wch: 35 } },
  //     { title: "Date Submit", style: style, width: { wch: 10 } }, //char width
  //     { title: "Origin", style: style, width: { wpx: 80 } },
  //   ];
  //   for (let i = 0; i < 5; i++) {
  //     column.push({ title: `Des ${i + 1}`, style: style, width: { wpx: 150 } });
  //   }

  //   column.push(
  //     { title: "Product", style: style, width: { wpx: 90 } },
  //     { title: "Note", style: style, width: { wpx: 90 } },
  //     { title: "Return", style: style, width: { wpx: 90 } },
  //     { title: "Overtime", style: style, width: { wpx: 90 } },
  //     { title: "Department", style: style, width: { wpx: 90 } },
  //     { title: "No of trip", style: style, width: { wpx: 90 } },
  //     { title: "Truck Type", style: style, width: { wpx: 90 } },
  //     { title: "Total Price", style: style, width: { wpx: 90 } },
  //     {
  //       title: "Name user request",
  //       style: style,
  //       width: { wpx: 90 },
  //     },
  //     { title: "Name Manager", style: style, width: { wpx: 90 } },
  //     {
  //       title: "manager Approved",
  //       style: style,
  //       width: { wpx: 90 },
  //     }
  //   );

  //   data.map((d, i) => {
  //     destArr = [
  //       { value: i, style: styleNoColor },
  //       { value: d.cost, style: styleNoColor },
  //       { value: d.suppiler, style: styleNoColor },
  //       { value: 0, style: styleNoColor },
  //       { value: d.job_no, style: styleNoColor },
  //       { value: d.date, style: styleNoColor },
  //       { value: d.start_place, style: styleNoColor },
  //     ];
  //     for (let i = 0; i < maxDestLength; i++) {
  //       destArr.push({
  //         style: styleNoColor,
  //         value: JSON.parse(d.dest_place.split(","))[i] || "",
  //       });
  //     }

  //     let managerName = null;
  //     JSON.parse(d.approve_by)
  //       .split(",")
  //       .map((r) => {
  //         if (managerName != null) {
  //           managerName += "," + r.substr(0, r.indexOf("@"));
  //         } else {
  //           managerName = r.substr(0, r.indexOf("@"));
  //         }
  //       });
  //     destArr.push(
  //       { value: d.product, style: styleNoColor },

  //       { value: d.purpose, style: styleNoColor },
  //       { value: d.return, style: styleNoColor },
  //       { value: "Yes", style: styleNoColor },
  //       { value: "department", style: styleNoColor },
  //       { value: "No of trip", style: styleNoColor },
  //       { value: d.car_type, style: styleNoColor },
  //       { value: "Total Price", style: styleNoColor },
  //       { value: d.request_by, style: styleNoColor },
  //       { value: managerName, style: styleNoColor },
  //       { value: d.status, style: styleNoColor }
  //     );
  //     destData.push(destArr);
  //   });

  //   const multiDataSet = [
  //     {
  //       columns: column,

  //       data: destData,
  //     },
  //   ];

  //   setExportExcel({ status: true, data: multiDataSet });
  //   // setExportExcel({ ...exportExcel, status: true });
  // };
  React.useEffect(() => {
    if (exportExcel.status === true) {
      setExportExcel({ ...exportExcel, status: false });
    }
  }, [exportExcel]);
  const [alert, setAlert] = React.useState({ error: false, success: false })
  const [dateFilter, setDateFilter] = React.useState({ startDate: moment().subtract(15, 'days'), endDate: moment().add(15, 'days') })

  const handleDateChange = async (e, type) => {

    if (type == "startDate") {
      setDateFilter({ ...dateFilter, startDate: e });
      // console.log(moment(e).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD'));
      await getData(moment(e).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD')).then(async res => {
        setReqData(res);
        await dataExcel(res)
      })
    }
    if (type == "endDate") {
      setDateFilter({ ...dateFilter, endDate: e });
      await getData(moment(dateFilter.startDate).format('YYYYMMDD'), e.format('YYYYMMDD')).then(async res => {
        setReqData(res);
        await dataExcel(res)
      })
    }

  };



  const purchaseApprove = async (data) => {
    console.log(data, data._id);
    if (data.suppiler === null) {
      // alert('Please select suppiler')
      setAlert({ ...alert, error: true })
      return
    }

    await fetch(`https://delivery-backend-1.powermap.live/specialrequests/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ suppiler: data.suppiler, purchase_status: 'approved' }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        await getData(moment(dateFilter.startDate).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD')).then(async res => {
          setReqData(res);
          await dataExcel(res)
        })
        setAlert({ success: true, error: false })
      });
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <>

        <div
          style={{
            marginRight: "4vw",
            marginLeft: "4vw",
            marginTop: "4vw",
            marginBottom: "4vw",
            maxWidth: "100%",
          }}
        >
          <Card style={{ marginBottom: 4 }}>
            <CardContent style={{
              display: 'flex',
              justifyContent: 'flex-end'
              // marginLleft: 'auto',
              // marginRight: 'auto'
            }}>
              <DatePicker
                style={{ paddingRight: '24px' }}
                label="Start date"
                value={dateFilter.startDate}
                onChange={e => handleDateChange(e, 'startDate')}
                // value={getValues('requestDate')}

                autoOk
                format="DD/MM/YYYY"
              />
              <DatePicker
                style={{ paddingRight: '24px' }}
                label="End Date"
                value={dateFilter.endDate}
                onChange={e => handleDateChange(e, 'endDate')}
                // value={getValues('requestDate')}

                autoOk
                format="DD/MM/YYYY"
              />
              <Button variant="contained" color="primary" onClick={() => window.open(`${window.location.origin}/form`, 'SPECIAL REQUEST FORM')}>
                REQUEST FORM
</Button>
            </CardContent>
          </Card>
          {alert.error === true ? <div style={{ paddingBottom: '4px' }}><Alert severity="error">
            Please fill suppiler</Alert></div> : null}
          {alert.success === true ? <div style={{ paddingBottom: '4px' }}><Alert severity="success">
            Approve success</Alert></div> : null}
          <MaterialTable
            icons={tableIcons}
            columns={[
              { title: "", field: "", editable: 'never', width: 50 },
              userRole === 'Administrator' || userRole === 'purchaser' ? {
                title: "Approve",
                render: (rowData) => (
                  <Tooltip title="Approve">
                    <Button style={{ fontSize: '12px', width: '80px' }} onClick={() => purchaseApprove(rowData)} variant="contained" color="primary">
                      Approve
</Button>
                    {/* <IconButton aria-label="Approve" color='primary'>
                      <ThumbUpIcon style={{ cursor: 'pointer' }} />
                    </IconButton> */}
                  </Tooltip>

                ), width: 150
              } : { title: "", field: "",editable: 'never',width : 20 }
              ,
              { title: "Job No", field: "job_no", editable: 'never', width: 120 },

              {
                title: "Suppiler", width: 150, field: "suppiler",
                editComponent: props => (
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={suppilerList.map((option) => option.title)}

                    value={props.value}
                    onChange={(e, v) => props.onChange(v)}

                    renderInput={(params) => (
                      <TextField {...params} label="Suppiler" InputLabelProps={{
                        shrink: true,
                      }}
                        onChange={(e, v) => props.onChange(e.target.value)}
                        value={props.value}
                      />
                    )}
                  />
                )
                // editComponent: props => (
                //   <input
                //     type="text"
                //     value={props.value}
                //     onChange={e => props.onChange(e.target.value)}
                //   />
                // )
              },
              { title: "Purchase status", field: "purchase_status", editable: 'never', width: 150 },
              { title: "Manager status", field: "status", editable: 'never', width: 150 },

              { title: "Cost", field: "cost", editable: 'never', width: 100 },
              { title: "Type of car", field: "car_type", editable: 'never', width: 150 },
              { title: "Amount of car", field: "car_amount", editable: 'never', width: 100 },
              { title: "Product", field: "product", editable: 'never', width: 150 },
              {
                title: "Request date",
                render: (rowData) => moment(rowData.request_date, 'YYYYMMDD').format('DD/MM/YYYY'), editable: 'never', editable: 'never', width: 100
              }, { title: "Arrive time", field: "arrive_time", editable: 'never', width: 100 },
              { title: "Start place", field: "start_place", editable: 'never', width: 150 },
              {
                title: "Destination",
                render: (rowData) => JSON.parse(rowData.dest_place) + " ", editable: 'never'
                , width: 200
              },
              { title: "Purpose", field: "purpose", editable: 'never', width: 150 },

              { title: "Request by", field: "request_by", editable: 'never', width: 150 },
              { title: "Approve by", field: "approve_by", editable: 'never', width: 200 },
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
                tooltip: "Export Xlsx ",
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

            editable={userRole === 'issuer' || userRole === 'Special' ? {
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  // setTimeout(() => {
                  console.log(oldData);
                  resolve(fetch(`https://delivery-backend-1.powermap.live/specialrequests/${oldData._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify({ status: 'delete' }),
                  }).then((response) => response.json())
                    .then(async (res) => {
                      await getData(moment(dateFilter.startDate).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD')).then(async res => {
                        setReqData(res);
                        await dataExcel(res)
                      })
                      // setAlert({ success: true, error: false })
                    }))

                })
              ,



            } : userRole === 'Administrator' || userRole === 'purchaser' ? {
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  // setTimeout(() => {
                  console.log(oldData);
                  resolve(fetch(`https://delivery-backend-1.powermap.live/specialrequests/${oldData._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify({ status: 'delete' }),
                  }).then((response) => response.json())
                    .then(async (res) => {
                      await getData(moment(dateFilter.startDate).format('YYYYMMDD'), dateFilter.endDate.format('YYYYMMDD')).then(async res => {
                        setReqData(res);
                        await dataExcel(res)
                      })
                      // setAlert({ success: true, error: false })
                    }))

                })
              ,
              onRowUpdate: (newData, oldData) =>

                new Promise((resolve, reject) => {
                  // setTimeout(() => {
                  console.log(newData, oldData);
                  const dataUpdate = [...reqData];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setReqData([...dataUpdate]);

                  resolve();
                  // }, 1000)
                })
            } : null}

            options={{
              tableLayout: "fixed",
              fixedColumns: {
                left: 5
              },
              

              // exportButton: true,
              // exportCsv: async (columns, data) => {
              //   await excelData(data);
              //   // return columns, data;
              // },
              search: true,

              headerStyle: {
                fontWeight: "bold",
                // textAlign: 'center'

                // minWidth: "100px",
              },
              rowStyle : {
                // textAlign : 'right',
                // backgroundColor: 'yellow'
              }
            }}
            localization={{

              header: {
                actions: 'Edit'
              },
              body: {
                editRow: {
                  deleteText:
                    "Are you sure to delete this request"

                }
              }
            }}
            title="Delivery Request"
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
    </MuiPickersUtilsProvider >
  );
};
export default ReqTable;
