/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ListSelect from "./listSelect";
import { useForm } from "react-hook-form";

export default function ComboBox(props) {
  // console.log(props);

  const [destPlace, setDestPlace] = React.useState();
  const getData = async () => {
    return await fetch(`https://delivery-backend-1.powermap.live/orides`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (res) => {
        return res;
      });
  };
  React.useMemo(async () => {
    await getData().then(async (res) => {
      setDestPlace(res);
    });
  }, []);
  // const onUpdate = (v) => {
  //   props.changeDest(props.index, v);
  // };
  // console.log(destPlace);
  return (
    <>
      {/* {destPlace && (
        <ListSelect
          inputs={destPlace}
          placeholder={props.label}
          onUpdate={onUpdate}
          inputRef={props.inputRef}
          name={props.name}
          // clear={this.state.isClear}
        />
      )} */}

      <Autocomplete
      id="combo-box-demo"
      options={destPlace}
      getOptionLabel={(option) => option.name}
      fullWidth={true}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={props.inputRef}
          name={props.name}
          label={props.label}
        />
      )}
    />
    </>
  );
}
