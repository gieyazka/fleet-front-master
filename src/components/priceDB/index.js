import React from 'react';
import MaterialTable from 'material-table';
import { Card, TextField } from "@material-ui/core";
import server from '../../config';
import axios from 'axios';

export default class RemoteData extends React.Component {
  render() {
    return (
      <Card
        style={{
          margin: "30px"
        }} >
        <MaterialTable
          title="Pricing Database"
          columns={[
            { title: 'Company', field: 'Company' },
            { title: 'Supplier', field: 'Supplier' },
            {
              title: 'Description', field: 'Transportation Description',
              cellStyle: {
                width: 300
              },
              editComponent: props => (
                <TextField
                  value={props.value}
                  fullWidth={true}
                  onChange={e => props.onChange(e.target.value)}
                />
              )
            },
            { title: 'Item Code', field: 'Item code' },
            { title: 'Price', field: 'Price' }
          ]}
          options={{
            search: true,
            paging: true,
            pageSize: 20,
            pageSizeOptions: [5, 10, 20, 50],
            exportAllData: true,
            exportButton: true

          }}
          localization={{
            body: {
              editRow: { deleteText: "คุณแน่ใจไหม ?" },
              toolbar: { searchPlaceholder: "Search Description" }
            }
          }}
          data={query =>
            new Promise((resolve, reject) => {
              let url = server.url + '/deliveryfees?'
              url += '_limit=' + query.pageSize
              url += '&_start=' + (query.page) * query.pageSize
              url += '&company_id=' + localStorage.getItem('companyID')
              url += query.search ? '&Transportation Description_contains=' + query.search : ""
              fetch(url, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('id_token')}`
                },
              })
                .then(response => {
                  console.log(query);
                  var length = response.headers.get('content-range');
                  response.json().then(result => {
                    resolve({
                      data: result,
                      page: query.page,
                      totalCount: length,
                    })
                  });
                })
            })
          }
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log(newData);
                  // post to server here
                  axios.post(server.url + '/deliveryfees', newData, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('id_token')}`
                    },
                  }).then(function (response) {
                    console.log(response)
                  });
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log('row update');
                  axios.put(server.url + `/deliveryfees/${oldData.id}`, newData, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('id_token')}`
                    },
                  }).then(function (response) {
                    console.log(response)
                  });
                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log('row delete');
                  axios.delete(server.url + `/deliveryfees/${oldData.id}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('id_token')}`
                    },
                  }).then(function (response) {
                    console.log(response)
                  });
                  resolve();
                }, 1000);
              })
          }}
        /></Card>
    )
  }
}