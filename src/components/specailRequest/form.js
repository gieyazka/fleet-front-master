import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControlLabel,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  Button,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import DestSelect from './destSelect.js';
import Alert from './alert';
import { useForm, useFieldArray } from 'react-hook-form';
import aapicoLogo from '../../assets/images/aapico_logo.png';
import MomentUtils from '@date-io/moment';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import CircularProgress from '@material-ui/core/CircularProgress';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const SweetAlert = withReactContent(Swal);

// console.log(props);
const CallSweetAlert = () => {
  // are you sure???
  SweetAlert.fire({
    title: 'Success',
    text: 'คำขอได้รับการบันทึกอย่างประสบความสำเร็จ',
    icon: 'success',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.value) {
      console.log('save successfully');
    }
  });
};

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: 'auto',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function FacebookCircularProgress(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}

const Form = () => {
  const [destState, setDestState] = React.useState([{}]);
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    getValues,
    reset,
    watch,
    control,
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'dest',
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [destData, setDestData] = React.useState([]);
  // const [startData, setstartData] = React.useState([]);
  const [selectedDate, handleDateChange] = React.useState({
    reqDate: null,
    arriveTime: null,
    date: new moment(),
  });
  const [destError, setDestError] = React.useState(false);
  const changeDest = (index, d) => {
    destData[index] = d.value;
    let items = destData;
  };

  const handleReqDest = (e, type) => {
    if (type == 'reqDate') {
      handleDateChange({ ...selectedDate, reqDate: e });
      setValue('requestDate', e);
    }
    if (type == 'date') {
      handleDateChange({ ...selectedDate, date: e });
      setValue('date', e);
    }
    if (type == 'arriveTime') {
      handleDateChange({ ...selectedDate, arriveTime: e });
      setValue('arriveTime', e);
    }
  };
  const onSubmit = async (data, e) => {
    console.log(data);
    setLoading(true);
    delete data.costOther;
    let destPlace = [];
    let destTel = [];
    let destContact = [];
    for (const d of data.destination) {
      console.log(d);
      destPlace.push(d.place);
      destContact.push(d.contact);
      destTel.push(d.tel);
    }
    let maxJobNo;
    await getMaxJob().then((res) => {
      if (res[0]) {
        let num = parseInt(res[0].job_no) + 1;

        maxJobNo = pad(num, 4);
      } else {
        maxJobNo = pad(1, 4);
      }
    });
    // console.log(maxJobNo);

    const body = {
      department: localStorage.getItem('department'),
      date: moment(data.date, 'DD-MM-YYYY').format('YYYYMMDD'),
      job_no: maxJobNo,
      cost: data.cost,
      suppiler: null,
      car_type: data.carType,
      product: data.product,
      Overtime: data.OT,
      OT_time: data.timeOT || null,
      // car_amount: data.amountCar,
      request_date: moment(data.requestDate, 'YYYY-MM-DD').format('YYYYMMDD'),
      arrive_time: moment(data.arriveTime).format('HH:mm'),
      purpose: data.purpose,
      start_place: data.startPlace,
      start_contact: data.startContact,
      start_tel: data.startTel,
      dest_place: JSON.stringify(destPlace),
      dest_contact: JSON.stringify(destContact),
      dest_tel: JSON.stringify(destTel),
      return: data.return,
      request_by: data.requestBy,
      approve_by: JSON.stringify(data.approvedBy),
      // arrange_by: data.arrangedBy,
      // arrange_date: moment(data.dateArranged, "YYYY-MM-DD").format("YYYYMMDD"),
    };
    data.destPlace = destPlace;
    const oldData = data;
    // return null;
    // return;
    await fetch('https://delivery-backend-1.powermap.live/specialrequests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then(async (res) => {
        // console.log(data);
        // console.log(res);
        setLoading(false);
        await sendEmail(data, res.id);
        // alert('Send Success');
        CallSweetAlert();
        e.target.reset();
        // window.close();
      });
  };
  const [otherCost, setOtherCost] = React.useState(true);
  // const [otherSuppiler, setOtherSuppiler] = React.useState(true);
  const [cost, setCost] = React.useState([
    {
      company: 'AH',
      email: [
        'isara.s@aapico.com',
        'sirichai.b@aapico.com',
        'tiwa.b@aapico.com',
      ],
    },

    {
      company: 'AHP',
      email: [
        'isara.s@aapico.com',
        'sirichai.b@aapico.com',
        'tiwa.b@aapico.com',
      ],
    },
    { company: 'AHA', email: ['wuthinan.j@aapico.com'] }, // liu.l@aapico.com; //Pornchai.p@aapico.com
    { company: 'AHD', email: ['Narin.T@aapico.com'] },
    { company: 'EA', email: ['shivanand.a@aapico.com'] },
    { company: 'AL', email: ['prasert.i@aapico.com'] },
    { company: 'AS', email: ['Narit.g@asico.co.th'] },
    { company: 'Other', email: null },
    {
      company: 'AITS',
      email: ['soknath.m@aapico.com', 'thanapat.k@aapico.com'],
    },
  ]);
  const addFormData = (v) => {
    let data = [...destState];
    // for (let i = 0; i <= v; i++) {
    data.push({});

    // }
    setDestState(data);
  };
  const removeFormData = () => {
    // console.log('asdsadd');
    let data = [...destState];
    data.pop();
    setDestState(data);
  };
  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  const [maxJobNo, setMax] = React.useState(0);
  const getMaxJob = async () => {
    return await fetch(
      `https://delivery-backend-1.powermap.live/specialrequests?&_sort=job_no:DESC&_limit=1`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then(async (res) => {
        if (res[0]) {
          setMax(res[0].job_no);
        } else {
          setMax('0000');
        }
        return res;
      });
  };
  React.useMemo(async () => {
    await getMaxJob();
  }, []);

  const sendEmail = async (data, id) => {
    // console.log(data);

    let managerEmail = data.approvedBy.split(',');
    // console.log(managerEmail);
    for (const email of managerEmail) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
      const path = window.location.origin;
      var urlencoded = new URLSearchParams();
      urlencoded.append('form', 'Delivery@aapico.com');
      urlencoded.append('formdetail', 'Delivery System -- Special Request'); // TODO change
      // urlencoded.append('to', 'soknath.m@aapico.com'); // TODO
      // urlencoded.append('to', 'pokkate.e@aapico.com'); // TODO
      urlencoded.append('to', email);
      urlencoded.append('cc', '');
      urlencoded.append('bcc ', '');
      urlencoded.append('subject', `Special Request Job No.  ${data.jobNo}`); // TODO change
      urlencoded.append(
        'body',
        `<html>
          <link
          href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet">
        <body >
        <table align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="style='border-collapse: collapse;">
        <tr>
            <td style="
                       background : #1D366D   ;
                       padding : 40px;
                       font-size : 3em ;
                       text-align :center ;
                       color : #FFF
                       ">
                <p style="font-family : Bai Jamjuree ;margin: 0;">Delivery System </p>
            </td>
        </tr>
        <tr style='text-align : center ;  '>
            <td style="
                       background : #FFF   ;
                       padding : 20px;
                       text-align :center ;
                       color : #121212
                       ">
                <p style="font-family: Arial ;margin: 0 0 16 0;font-size : 2em;">ข้อมูลการส่งของ</p>
              <table align="center" border="1" cellpadding="0" cellspacing="0" width="400" style='font-family : Bai Jamjuree ;font-size : 16px ;'>
              <tr>
              <td style='padding : 4px 0px ; text-align :center ;'>Request By </td>
                <td style='padding : 4px 0px ; text-align :center ;'>${
                  data.requestBy
                } </td>
            </tr>
              <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Job No. </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.jobNo
                    } </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Date to use car </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${moment(
                      data.requestDate,
                      'YYYYMMDD'
                    ).format('DD-MM-YYYY')}  </td>
                </tr>
 
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Start Place </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.startPlace
                    } </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Destination </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.destPlace
                    } </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>purpose </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.purpose
                    } </td>
                </tr>
          </table>
          <br>
          <table align='center' width="100%" border="0" cellspacing="0" cellpadding="0" >
          <tr style='margin-top : 8px ;'>
            <td >
              <table align='center' border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td span='2' align="center" style="border-radius: 8px;" bgcolor="">
              <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${path}/status/${id}/reject/${email}" style="height:40px;v-text-anchor:middle;width:100px;" arcsize="10%" strokecolor="#E53E3E" fillcolor="#E53E3E">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;">Reject</center>
      </v:roundrect>
      <![endif]-->
      <a href="${path}/status/${id}/reject/${email}"  target="_blank"
      style="background-color:#E53E3E;border:1px solid #E53E3E;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:100px;-webkit-text-size-adjust:none;mso-hide:all;">Reject</a>

        <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${path}/status/${id}/approve/${email}" style="height:40px;v-text-anchor:middle;width:100px;" arcsize="10%" strokecolor="#1D366D" fillcolor="#1D366D">
      <w:anchorlock/>
      <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;">Approve</center>
      </v:roundrect>
      <![endif]--><a href="${path}/status/${id}/approve/${email}" target="_blank"
      style="background-color:#1D366D;border:1px solid #1D366D;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:100px;-webkit-text-size-adjust:none;mso-hide:all;">Approve</a>

       </td>
              </td>
            </table>
            </td>
          </tr>
        </table>
          </td>
          </tr>

        <tr>
            <td  style="
                       background : #1D366D   ;
                       padding : 20px;
                       text-align :center ;
                       color : #FFF
                       ">
                <p style="margin: 0;"> Copyright &copy; AAIPICO HITECH 2021</p>
            </td>
        </tr>
      </table>

  </body>

  </html>`
      );

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow',
      };

      await fetch('https://ess.aapico.com/email', requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
    }
  };
  const handleCostChange = (e) => {
    console.log(e);
    setValue('cost', e.target.value);
    console.log(e.target.value);
    let email = cost.filter((r) => r.company == e.target.value);
    console.log(email);
    setValue('approvedBy', email[0].email);
    if (getValues('cost') == 'Other') {
      setOtherCost(false);
    } else {
      setOtherCost(true);
    }
  };
  const [timeOT, setTimeOT] = useState(false);
  const handleOt = (value) => {
    setValue('OT', value);
    console.log(getValues('OT'));
    if (getValues('OT') == 'No') {
      setTimeOT(false);
      setValue('timeOT', null);
    } else {
      setTimeOT(true);
    }
  };

  // const handleSuppilerChange = (e) => {
  //   console.log(e);
  //   setValue("suppiler", e.target.value);
  //   if (getValues("suppiler") == "Other") {
  //     setOtherSuppiler(false);
  //   } else {
  //     setOtherSuppiler(true);
  //   }
  // };
  // console.log(cost);
  React.useEffect(() => {
    register('cost', { required: 'Please select  cost' }); // custom register Antd input
    // register("suppiler", { required: "Please select suppiler" });
    register('carType', { required: 'Please select type of car' });
    register('return', { required: 'Please select return' });
    register('date', { required: 'Please select date' });
    register('arriveTime', { required: 'Please select time' });
    register('requestDate', { required: 'Please select date' });
    register('requestBy', { required: 'Please fill date' });
    register('OT', { required: 'Please fill OT' });
    // register("placeStart", { required: "Please select start place" });

    // setValue("requestDate", new moment());
    setValue('requestBy', localStorage.getItem('username'));
    setValue('date', new moment());
    setValue('return', 'No');
    setValue('OT', 'No');
    // register("dest", { required: "Please select destination" });
    // register("approvedBy", { required: "Please select approver" });
  }, [register]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <React.Fragment>
        <div>
          <Card
            style={{
              marginBottom: 24,
              marginTop: 24,
              marginLeft: '8vw',
              marginRight: '8vw',
            }}
          >
            <CardContent style={{ marginLeft: 24, marginRight: 24 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid justify="space-evenly" container spacing={2}>
                  <Grid justify="center" item container>
                    <img style={{ width: 96 }} src={aapicoLogo} />{' '}
                    <h2>TRANSPORTATION REQUISITION FORM</h2>
                  </Grid>
                  {/* <Grid xs={12} sm={4} container justify="flex-start" item>
                  <TextField
                    inputRef={register({ required: true })}
                    name="from"
                    fullWidth={true}
                    id="standard-required"
                    label="From ."
                  />
                  {errors.from && (
                    <Alert
                      severity="error"
                      message="Please fill form"
                      width="80%"
                    />
                  )}
                </Grid> */}
                  <Grid xs={6} sm={6} item>
                    <DatePicker
                      label="Date"
                      value={selectedDate.date}
                      // onChange={handleDateChange}
                      // value={getValues('requestDate')}
                      onChange={(e) => handleReqDest(e, 'date')}
                      autoOk
                      disablePast
                      disabled
                      fullWidth={true}
                      format="DD/MM/YYYY"
                    />

                    {/* <TextField
                      fullWidth={true}
                      inputRef={register({ required: true })}
                      name="date"
                      id="date"
                      label="Date ."
                      type="date"
                      defaultValue={new moment().format("YYYY-MM-DD")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}
                  </Grid>
                  <Grid xs={6} sm={6} item>
                    <TextField
                      // inputProps={{
                      //   readOnly: true,
                      // }}
                      inputRef={register({ required: true })}
                      name="jobNo"
                      fullWidth={true}
                      label="Job No."
                      value={pad(parseInt(maxJobNo) + 1, 4)}
                      // defaultValue="1111111111"
                    />
                    {errors.jobNo && (
                      <Alert
                        severity="error"
                        message="Please fill Jobno"
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={12}
                      style={{ display: 'inline-block' }}
                    >
                      <p>
                        <b>Cost : </b>
                      </p>
                      <div style={{ marginLeft: '2.5vw' }}>
                        <RadioGroup
                          style={{ display: 'inline' }}
                          aria-label="Cost"
                          name="cost"
                          // value={value}
                          onChange={handleCostChange}
                        >
                          {cost.map((d) => (
                            // <span key={d.company}>
                            //   {d.company == "Other" ? <br /> : null}
                            <FormControlLabel
                              key={d.company}
                              value={d.company}
                              control={<Radio color="primary" />}
                              label={d.company}
                            />
                            // </span>
                          ))}
                        </RadioGroup>
                        <TextField
                          inputRef={register({ required: !otherCost })}
                          inputProps={{
                            disabled: otherCost,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="costOther"
                          label="Other"
                        />
                      </div>
                      {errors.cost && (
                        <Alert
                          severity="error"
                          message={errors.cost.message}
                          width="80%"
                        />
                      )}
                      {errors.costOther && (
                        <Alert
                          severity="error"
                          message="Please fill other cost"
                          width="80%"
                        />
                      )}
                    </Grid>

                    {/* <Grid item xs={12} md={12}>
                    <p> Suppiler :</p>
                    <div style={{ marginLeft: "2.5vw" }}>
                      <RadioGroup
                        style={{ display: "inline" }}
                        aria-label="Suppiler"
                        name="suppiler"
                        // value={value}
                        onChange={handleSuppilerChange}
                      >
                        <FormControlLabel
                          value="Nakburin"
                          control={<Radio color="primary" />}
                          label="Nakburin"
                        />
                        <FormControlLabel
                          value="Siam Nistrans"
                          control={<Radio color="primary" />}
                          label="Siam Nistrans"
                        />
                        <FormControlLabel
                          value="Namo"
                          control={<Radio color="primary" />}
                          label="Namo"
                        />
                        <FormControlLabel
                          value="Other"
                          control={<Radio color="primary" />}
                          label="Other"
                        />
                      </RadioGroup>
                      <TextField
                        inputRef={register({ required: !otherSuppiler })}
                        inputProps={{
                          disabled: otherSuppiler,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name="suppilerOther"
                        label="Other"
                      />
                    </div>
                    {errors.suppiler && (
                      <Alert
                        severity="error"
                        message={errors.suppiler.message}
                        width="80%"
                      />
                    )}
                    {errors.suppilerOther && (
                      <Alert
                        severity="error"
                        message="Plese fill other suppiler"
                        width="80%"
                      />
                    )}
                  </Grid> */}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div style={{ marginTop: 8 }}>
                      Please arrange the transportation as the following below :{' '}
                    </div>
                    <div style={{ marginLeft: '2.5vw', marginTop: '12px' }}>
                      <RadioGroup
                        style={{ display: 'inline-block' }}
                        aria-label="carType"
                        name="carType"
                        // value={value}
                        onChange={(e) => setValue('carType', e.target.value)}
                      >
                        {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      > */}
                        <FormControlLabel
                          value="Pick Up"
                          control={<Radio color="primary" />}
                          label="Pick Up (Not over 1 ton)"
                        />
                        <FormControlLabel
                          value="6 Wheels (ตู้)"
                          control={<Radio color="primary" />}
                          label="6 Wheels"
                        />
                        {/* </div> */}
                        {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      > */}
                        <FormControlLabel
                          value="10 Wheels (ตู้)"
                          control={<Radio color="primary" />}
                          label="10 Wheels (ตู้)"
                        />
                        <FormControlLabel
                          value="10 Wheels (เปลือย)"
                          control={<Radio color="primary" />}
                          label="10 Wheels (เปลือย)"
                        />
                        {/* </div> */}
                        {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      > */}
                        <FormControlLabel
                          value="18 Wheels (ตู้)"
                          control={<Radio color="primary" />}
                          label="18 Wheels (ตู้)"
                        />
                        <FormControlLabel
                          value="18 Wheels (เปลือย)"
                          control={<Radio color="primary" />}
                          label="18 Wheels (เปลือย)"
                        />
                        {/* </div> */}
                      </RadioGroup>
                    </div>
                    {errors.carType && (
                      <Alert
                        severity="error"
                        message={errors.carType.message}
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      inputRef={register({ required: true })}
                      // required
                      name="product"
                      fullWidth={true}
                      label="Product"
                    />
                    {errors.product && (
                      <Alert
                        severity="error"
                        message="Please fill product"
                        width="80%"
                      />
                    )}
                  </Grid>
                  {/* <Grid xs={12} sm={6} item>
                    <TextField
                      inputRef={register({ required: true })}
                      // required
                      name="amountCar"
                      fullWidth={true}
                      type="number"
                      label="Need Quantity Car Truck (จำนวนรถที่ต้องการใช้)"
                    />
                    {errors.amountCar && (
                      <Alert
                        severity="error"
                        message="Please fill Quantity Car Truck"
                        width="80%"
                      />
                    )}
                  </Grid> */}

                  <Grid xs={12} sm={6} item>
                    <DatePicker
                      label="Requirement Date to use (วันที่ต้องการใช้รถ)"
                      value={selectedDate.reqDate}
                      // onChange={handleDateChange}
                      // value={getValues('requestDate')}
                      onChange={(e) => handleReqDest(e, 'reqDate')}
                      autoOk
                      disablePast
                      fullWidth={true}
                      format="DD/MM/YYYY"
                    />

                    {/* <TextField
                      inputRef={register({ required: true })}
                      // required
                      name="requestDate"
                      fullWidth={true}
                      label="Requirement Date to use (วันที่ต้องการใช้รถ)"
                      type="date"

                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}
                    {errors.requestDate && (
                      <Alert
                        severity="error"
                        message="Please fill date"
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    {/* <TextField
                      inputRef={register({ required: true })}
                      type="time"
                      inputProps={{
                        onKeyDown: (event) => {
                          event.preventDefault();
                        },
                      }}
                      // ampm={false}
                      name="arriveTime"
                      fullWidth={true}
                      label="Need arrival time (เวลาขึ้นงาน)"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}
                    <TimePicker
                      fullWidth={true}
                      autoOk
                      todayLabel="now"
                      label="Need arrival time (เวลาขึ้นงาน)"
                      value={selectedDate.arriveTime}
                      minutesStep={5}
                      onChange={(e) => handleReqDest(e, 'arriveTime')}
                    />
                    {errors.arriveTime && (
                      <Alert
                        severity="error"
                        message="Please fill time"
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      inputRef={register({ required: true })}
                      name="purpose"
                      fullWidth={true}
                      label="Purpose to Request"
                    />
                    {errors.purpose && (
                      <Alert
                        severity="error"
                        message="Please fill purpose"
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <DestSelect
                      index={0}
                      // changeDest={changeStart}
                      label={`Start Place`}
                      inputRef={register({ required: true })}
                      name={`startPlace`}
                    />
                    {/* <TextField
                    inputRef={register({ required: true })}
                    name="startPlace"
                    fullWidth={true}
                    label="The Place to Start"
                  /> */}
                    {errors.startPlace && (
                      <Alert
                        severity="error"
                        message={errors.startPlace.message}
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <TextField
                      inputRef={register({ required: true })}
                      name="startContact"
                      fullWidth={true}
                      label="Contact Name"
                    />
                    {errors.startContact && (
                      <Alert severity="error" message="Please fill contact" />
                    )}
                  </Grid>
                  <Grid xs={12} sm={4} item style={{ position: 'relative' }}>
                    <TextField
                      inputRef={register({ required: true })}
                      name="startTel"
                      label="Tel"
                      fullWidth={true}
                    />

                    {errors.startTel && (
                      <Alert
                        severity="error"
                        message="Please fill tel"
                        width="80%"
                      />
                    )}
                  </Grid>
                  {destState.map((res, index) => (
                    <>
                      <Grid xs={12} sm={4} item>
                        {/* <TextField
                        inputRef={register({ required: true })}
                        name={`destination[${index}].place`}
                        fullWidth={true}
                        label={`Destination ${index + 1}`}
                      /> */}
                        <DestSelect
                          // changeDest={changeDest}
                          index={index}
                          label={`Destination ${index + 1}`}
                          inputRef={register({ required: true })}
                          name={`destination[${index}].place`}
                        />
                      </Grid>
                      <Grid xs={12} sm={4} item>
                        <TextField
                          inputRef={register({ required: true })}
                          name={`destination[${index}].contact`}
                          fullWidth={true}
                          label="Contact Name"
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        sm={4}
                        item
                        style={{ position: 'relative' }}
                      >
                        <TextField
                          style={{ width: '80%' }}
                          inputRef={register({ required: true })}
                          name={`destination[${index}].tel`}
                          label="Tel"
                        />

                        {index === 0 ? (
                          <Button
                            style={{
                              position: 'absolute',
                              right: 4,
                              marginTop: 8,
                            }}
                            color="primary"
                            variant="outlined"
                            disabled={destState.length === 5 ? true : false}
                            onClick={() => addFormData()}
                          >
                            เพิ่ม
                          </Button>
                        ) : index === destState.length - 1 ? (
                          <Button
                            style={{
                              position: 'absolute',
                              right: 4,
                              marginTop: 8,
                            }}
                            color="secondary"
                            variant="outlined"
                            onClick={() => removeFormData()}
                          >
                            ลบ
                          </Button>
                        ) : null}
                      </Grid>
                    </>
                  ))}
                  {errors.destination && (
                    <Alert
                      severity="error"
                      message="Please fill contact or tel"
                      width="100%"
                    />
                  )}
                  {destError === true && (
                    <Alert
                      severity="error"
                      message="Please select destination"
                      width="100%"
                    />
                  )}
                  <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                    <p> Return :</p>
                    <div style={{ marginLeft: '2.5vw' }}>
                      <RadioGroup
                        style={{ display: 'block', marginTop: '6px' }}
                        aria-label="Return"
                        name="return"
                        onChange={(e) => setValue('return', e.target.value)}
                        defaultValue="No"
                        // value={value}
                      >
                        <FormControlLabel
                          value="Yes"
                          control={<Radio color="primary" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </div>
                  </Grid>
                  {errors.return && (
                    <Alert
                      severity="error"
                      message={errors.return.message}
                      width="100%"
                    />
                  )}
                  <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                    <p> OT :</p>
                    <div style={{ marginLeft: '2.5vw' }}>
                      <RadioGroup
                        style={{ display: 'block', marginTop: '6px' }}
                        aria-label="OT"
                        name="OT"
                        onChange={(e) => handleOt(e.target.value)}
                        defaultValue="No"
                        // value={value}
                      >
                        <FormControlLabel
                          value="Yes"
                          control={<Radio color="primary" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                        <TextField
                          inputRef={register({ required: timeOT })}
                          inputProps={{
                            disabled: !timeOT,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="timeOT"
                          label="Hours"
                        />
                      </RadioGroup>
                    </div>
                  </Grid>
                  {errors.timeOT && (
                    <Alert
                      severity="error"
                      message="Please fill hours"
                      width="100%"
                    />
                  )}
                  <Grid xs={12} sm={6} item>
                    <TextField
                      // inputRef={register({ required: true })}
                      // required
                      name="requestBy"
                      fullWidth={true}
                      label="Request By"
                      defaultValue={localStorage.getItem('username')}
                    />
                    {errors.requestBy && (
                      <Alert
                        severity="error"
                        message="Please fill request by"
                        width="80%"
                      />
                    )}
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      inputRef={register({ required: true })}
                      // required
                      name="approvedBy"
                      fullWidth={true}
                      label="Approved By"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        readOnly: otherCost,
                      }}
                    />

                    {errors.approvedBy && (
                      <Alert
                        severity="error"
                        message="Please select Approver"
                        width="80%"
                      />
                    )}
                  </Grid>
                  {/* <Grid xs={12} sm={6} item>
                  <TextField
                    inputRef={register({ required: true })}
                    // required
                    name="arrangedBy"
                    fullWidth={true}
                    label="Arranged By"
                  />
                  {errors.arrangedBy && (
                    <Alert
                      severity="error"
                      message="Please fill Arranged By"
                      width="80%"
                    />
                  )}
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    inputRef={register({ required: true })}
                    // required
                    name="dateArranged"
                    fullWidth={true}
                    type="date"
                    label="Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.dateArranged && (
                    <Alert
                      severity="error"
                      message="Please fill date"
                      width="80%"
                    />
                  )}
                </Grid> */}
                  <Grid item sm={12} container justify="center">
                    {!loading ? (
                      <Button
                        onClick={(e) => console.log(watch())}
                        color="primary"
                        type="submit"
                        variant="outlined"
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        startIcon={<FacebookCircularProgress />}
                        variant="outlined"
                        color="primary"
                      >
                        Submit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </div>
      </React.Fragment>
    </MuiPickersUtilsProvider>
  );
};

export default Form;
