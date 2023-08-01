import { useState } from "react";
import { Divider, Typography } from "@mui/material";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import Titlebar from "../../component/common/Titlebar";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/Functions";

const AddTanningPlan = () => {
  const [tanningPlan, setTanningPlan] = useState({
    planName: "",
    itemCode: "",
    itemName: "",
    itemGroup: "",
  });

  const navigate = useNavigate();
  const itemGroup = ["Consumable", "Drug", "Laboratory", "Products"];

  const itemDetails = [
    {
      id: "itemCode",
      label: "Item Code",
      type: "text",
    },
    {
      id: "itemName",
      label: "Item Name",
      type: "text",
    },
    {
      id: "itemDescription",
      label: "Item Description",
      type: "textarea",
    },
    {
      id: "itemGroup",
      label: "Item Group",
      type: "select",
      data: itemGroup,
    },
  ];

  const handleSubmit = () => {
    axiosPrivate
      .post("api/resource/Therapy Plan/HLC-THP-2023-00055", "", {
        params: {
          plan_name: tanningPlan.planName,
          item: tanningPlan.itemCode,
          item_name: tanningPlan.itemName,
          item_group: tanningPlan.itemGroup,
        },
      })
      .then(() => {
        toast.success("Data Addedd Successfully");
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
      });
  };

  return (
    <div className="my-6">
      <Titlebar
        text="New Tanning Plan Template"
        handleClick={() => {
          handleSubmit();
        }}
        buttonText="Save"
      />
      <div className="grid gap-6 card">
        <Input
          label="Plan Name"
          value={tanningPlan.planName}
          setValue={(val) =>
            setTanningPlan((prev) => ({ ...prev, planName: val }))
          }
        />
      </div>
      <Divider className="!border-white !my-6" />
      <div className="w-full">
        <div className="my-4 text-white">
          <Typography>Linked Item Details</Typography>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {itemDetails.map((ele) => (
            <Input
              className="col-span-1"
              key={ele.id}
              label={ele.label}
              type={ele.type}
              value={tanningPlan[ele.id]}
              data={ele.data}
              setValue={(val) =>
                setTanningPlan((prev) => ({ ...prev, [ele.id]: val }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTanningPlan;
