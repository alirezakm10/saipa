'use client'
import { useState, MouseEvent, useEffect } from "react";
import {
  Button,
  Menu,
  FormGroup,
  Chip,
  Tooltip,
} from "@mui/material";
import { CheckboxMenuType, CheckboxMenuList } from "./typescope";

const CheckboxMenu: React.FC<CheckboxMenuType> = ({
  inputLabel,
  buttonIcon,
  allItems,
  attachedItems,
  setter,
  setIsModified,
  buttonGuid
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [specLists, setSpecLists] = useState<CheckboxMenuList[]>([]);

  const handleCheckboxChange = (item: CheckboxMenuList) => {
    setSpecLists((prevSpecLists) => {
      if (prevSpecLists.some((spec) => spec.id === item.id)) {
        // Item is already selected, remove it from the list
        return prevSpecLists.filter((spec) => spec.id !== item.id);
      } else {
    
        if(setter){
          const newItem = {...item, isModified:true}
          setter([...attachedItems, newItem]);
        }
        if(setIsModified){
        setIsModified(true)
        }
        return [...prevSpecLists, item];
      }
    });
  };


  




  const filteredItems = allItems?.filter((item => (
    !attachedItems?.some( (attachedItem: any) => item.id === attachedItem.id)
  )))


  return (
    <div>
          <Tooltip title={buttonGuid} >

      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={buttonIcon}
      >
        {inputLabel}
      </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
            <FormGroup
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          px: 1,
          maxWidth: "300px",
        }}
      >
        {filteredItems?.map((item, idx) => (

<Chip
key={idx}
label={item.title}
onClick={() => handleCheckboxChange(item)}
sx={{ margin: 1 }}
/>
        ))}
      </FormGroup>
      </Menu>
    </div>
  );
};

export default CheckboxMenu;
