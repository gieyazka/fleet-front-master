import React from 'react';
import { useParams } from 'react-router-dom';
import { Backdrop, Card, CardContent, CardAction } from '@material-ui/core';
import Alert from './alert';
import moment from 'moment';

const Status = () => {
  let { id, status, email } = useParams();
  const sendEmail = async (data, id) => {
    // console.log(data);

    // console.log(managerEmail);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const path = window.location.origin;
    var urlencoded = new URLSearchParams();
    urlencoded.append('form', 'Delivery@aapico.com');
    urlencoded.append('formdetail', 'Delivery System');
    urlencoded.append(
      'to',
      email === 'soknath.m@aapico.com' || email === 'thanapat.k@aapico.com'
        ? email
        : 'prapasiri.a@asico.co.th' //'prapasiri.a@aapico.com'
    ); // TODO change this to purchase email
    // urlencoded.append('to', 'prapasiri.a@aapico.com');
    urlencoded.append('cc', data.approve_by.replaceAll('"', '')); // TODO should we inform manager???  data.approvedBy
    urlencoded.append('bcc ', '');
    urlencoded.append(
      'subject',
      `Special Request Job No.  ${data.job_no} have been approved by ${email}`
    ); // TODO should we inform manager???
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
                  data.request_by
                } </td>
            </tr>
              <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Job No. </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.job_no
                    } </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Date to use car </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${moment(
                      data.request_date,
                      'YYYYMMDD'
                    ).format('DD-MM-YYYY')}  </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'> Car </td>
                    <td style='padding : 4px 0px ;  text-align :center ;'>${
                      data.car_type
                    }
                    </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Start Place </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${
                      data.start_place
                    } </td>
                </tr>
                 <tr>
                  <td style='padding : 4px 0px ; text-align :center ;'>Destination </td>
                    <td style='padding : 4px 0px ; text-align :center ;'>${JSON.parse(
                      data.dest_place
                    )}
       </td>
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
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${path}/request" style="height:40px;v-text-anchor:middle;width:100px;" arcsize="10%" strokecolor="#1D366D" fillcolor="#1D366D">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;">VIEW DATA</center>
                  </v:roundrect>
                  <![endif]--><a href="${path}/request" target="_blank"
                  style="background-color:#1D366D;border:1px solid #1D366D;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:100px;-webkit-text-size-adjust:none;mso-hide:all;">VIEW DATA</a>

      
      
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
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  const [reqData, setReqData] = React.useState();
  const getData = async () => {
    return await fetch(
      `https://delivery-backend-1.powermap.live/specialrequests?_id=${id}`,
      {
        method: 'GET',
      }
    )
      .then(response => response.json())
      .then(async res => {
        setReqData(res[0]);
        return res[0];
      });
  };
  React.useEffect(async () => {
    await getData().then(async res => {
      console.log(res);

      if (res.status === 'waiting') {
        await updateStatus(id, status, email).then(async r => {
          if (status === 'approve') {
            await sendEmail(res, res.id);
          }
        });
      }
    });
  }, []);
  const updateStatus = async (id, status, email) => {
    await fetch(
      `https://delivery-backend-1.powermap.live/specialrequests/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          approve_manager: email,
          status:
            status === 'approve'
              ? 'approved'
              : status === 'reject'
              ? 'rejected'
              : 'waiting',
        }),
      }
    )
      .then(response => response.json())
      .then(async res => {});
  };

  if (reqData && reqData.status === 'waiting') {
    return (
      <>
        {/* <Backdrop open={true}> */}
        <Card style={{ marginTop: 24, marginLeft: '8vw', marginRight: '8vw' }}>
          <CardContent>
            <Alert severity="info" message={`${status} success`} width="95%" />

            {/* <h2>{status} success</h2> */}
          </CardContent>
        </Card>
        {/* </Backdrop> */}
      </>
    );
  } else {
    return (
      // <Backdrop open={true}>
      <Card style={{ marginTop: 24, marginLeft: '8vw', marginRight: '8vw' }}>
        <CardContent>
          <Alert
            severity="error"
            message={`   This request is already ${reqData && reqData.status}`}
            width="95%"
          />
          {/* <h2></h2> */}
        </CardContent>
      </Card>
      // </Backdrop>
    );
  }
};
export default Status;
