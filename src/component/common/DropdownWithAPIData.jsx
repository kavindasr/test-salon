// import { Select } from "@mantine/core";
import { useState, useEffect } from "react";
import axiosPrivate from "../../api/BaseURL";
import { MenuItem, TextField } from "@mui/material";

const DropdownWithAPI = ({ endpoint, label, value, setValue, required, disabled, variant }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axiosPrivate.get(`api/resource/${endpoint}`);
                setOptions(response.data.data);
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };

        fetchOptions();
    }, [endpoint]);

    return (
        <>
            {/* <Select
        withAsterisk={required}
        label={label}
        searchable
        nothingFound="No options"
        data={options}
        value={value}
        onChange={(val) => setValue(val)}
      /> */}
            <TextField fullWidth label={label} select variant={variant} value={value} required={required} disabled={disabled} onChange={(e) => setValue(e.target.value)}>
                <MenuItem disabled defaultChecked>
                    {label}
                </MenuItem>
                {options?.map((group, index) => (
                    <MenuItem key={index} value={group.name}>
                        {group.name}
                    </MenuItem>
                ))}
            </TextField>
            {/* <select>
        <option disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select> */}
        </>
    );
};

export default DropdownWithAPI;
