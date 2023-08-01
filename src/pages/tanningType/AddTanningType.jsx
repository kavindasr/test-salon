import { useState } from "react";
import { Divider, Typography } from "@mui/material";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import Titlebar from "../../component/common/Titlebar";

const AddTanningType = () => {
  const [tanningType, setTanningType] = useState({
    therapyType: "",
    duration: "",
    itemCode: "",
    rate: "",
    itemName: "",
    itemGroup: "",
  });

  const tanningTypeForm = [
    {
      id: "therapyType",
      label: "Tanning Type",
      type: "text",
    },
    {
      id: "duration",
      label: "Default duration (In Minutes)",
      type: "text",
    },
  ];

  const itemGroup = ["Consumable", "Drug", "Laboratory", "Products"];

  const itemDetails = [
    {
      id: "itemCode",
      label: "Item Code",
      type: "text",
    },
    {
      id: "rate",
      label: "Rate",
      type: "text",
    },
    {
      id: "itemName",
      label: "Item Name",
      type: "text",
    },
    {
      id: "itemGroup",
      label: "Select blood group",
      type: "select",
      data: itemGroup,
    },
  ];

  const handleSubmit = () => {
    axiosPrivate.post("api/resource/Therapy Type", "", {
      params: {
        therapy_type: tanningType.therapyType,
        item: tanningType.itemCode,
        item_name: tanningType.itemName,
        item_group: tanningType.itemGroup,
        rate: tanningType.rate,
        duration: tanningType.duration,
      },
    });
  };

  return (
    <div>
      <Titlebar
        text="Add Tanning Type"
        buttonText="Save"
        handleClick={handleSubmit}
        showActionButton
        showGoBack
        showRefresh
      />
      <div>
        <div className="grid grid-cols-2 gap-4 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
          {tanningTypeForm.map((ele) => (
            <Input
              className="col-span-1"
              key={ele.id}
              label={ele.label}
              type={ele.type}
              value={tanningType[ele.id]}
              data={ele.data}
              setValue={(val) =>
                setTanningType((prev) => ({ ...prev, [ele.id]: val }))
              }
            />
          ))}
        </div>
        <Divider className="!my-6 !border-white" />
        <div className="my-4">
          <Typography className="text-white">Item Details</Typography>
        </div>
        <div className="grid grid-cols-2 gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
          {itemDetails.map((ele) => (
            <Input
              className="col-span-1"
              key={ele.id}
              label={ele.label}
              type={ele.type}
              value={tanningType[ele.id]}
              data={ele.data}
              setValue={(val) =>
                setTanningType((prev) => ({ ...prev, [ele.id]: val }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTanningType;
