import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Slider } from "@mui/material";

import { GlobalContext } from "./context/GlobalContext";

export default function IconMenu(props) {
  const {
    bulbIdList,
    GraphQLHandler,
    activeMap,
    markers,
    setCurrentBulbId,
    value,
    setValue,
    setButtonPopup,
    currentLampId,
    currentBrightness,
    setCurrentBrightness,
  } = React.useContext(GlobalContext);

  const options = [
    { label: value ? value : "Not assigned" },
    ...Object.keys(bulbIdList).map((e) => {
      return { label: e, value: e };
    }),
  ];

  useEffect(() => {
    let temp = markers.filter((e) => {
      return e.id === currentLampId.toString();
    });

    if (temp[0]) {
      setValue(temp[0].bulbId);
      setCurrentBrightness(temp[0].brightness);
    }
  }, [currentLampId]);

  const handleBulbIdChange = (event) => {
    setCurrentBulbId(event.target.value);
    console.log("this", event.target.value);
    setValue(event.target.value);
    GraphQLHandler(
      props.id,
      "lat",
      "lng",
      "updateBulbId",
      activeMap,
      event.target.value
    );

    // await markers.forEach((element) => {
    //   if (element.id === props.id) {
    //     element.bulbId = event.target.value;
    //   }
    // });
  };

  let QrHandler = () => {
    setButtonPopup(true);
  };

  let brightnessHandler = (e) => {
    setCurrentBrightness(e.target.value);
  };

  let brightnessCommitHandler = (e) => {
    GraphQLHandler(
      props.id,
      "lat",
      "lng",
      "brightness",
      activeMap,
      "unrelated",
      currentBrightness
    );
    console.log(currentBrightness);
  };

  // TODO: from the markers list we need the bulbID from the array of objects identified with the props.id

  const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select
          key={Math.random()}
          value={value === null ? undefined : value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={Math.random()} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <Paper sx={{ width: 300, maxWidth: "100%" }}>
      <MenuList>
        <MenuItem>
          <ListItemText>Lamp {props.id}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>
            <div>
              <Dropdown
                label="BulbId:"
                options={options}
                value={value}
                onChange={handleBulbIdChange}
              />
            </div>
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            <button onClick={QrHandler}>Scan</button>
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>
            {currentBrightness !== 0
              ? `Brightness: ${currentBrightness}%`
              : "Lamp disabled"}
            <br />
            <Slider
              size="small"
              value={Number(currentBrightness)}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={brightnessHandler}
              onChangeCommitted={brightnessCommitHandler}
            />
          </ListItemText>
          <Typography variant="body2" color="text.secondary"></Typography>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
