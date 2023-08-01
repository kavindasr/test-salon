import { MenuItem, TextField } from "@mui/material";
// import { TextInput, Select } from "@mantine/core";
import DropdownWithAPI from "./DropdownWithAPIData";

const Input = ({
  id,
  children,
  required,
  label,
  type,
  disabled,
  value,
  setValue,
  props,
  data,
  customClass,
  endpoint,
  variant = "outlined",
}) => {
  return (
    <>
      {type === "select" ? (
        <>
          {endpoint ? (
            <DropdownWithAPI
              label={label}
              endpoint={endpoint}
              value={value}
              setValue={setValue}
              required={required}
              disabled={disabled}
              variant={variant}
            />
          ) : (
            <TextField
              fullWidth
              label={label}
              select
              variant={variant}
              value={value}
              required={required}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              {...props}
            >
              <MenuItem disabled defaultChecked>
                {label}
              </MenuItem>
              {data?.map((group, index) => (
                <MenuItem key={index} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
          )}
        </>
      ) : (
        <TextField
          id={id}
          required={required}
          variant={variant}
          disabled={disabled}
          type={type}
          multiline={type === "textarea"}
          rows={type === "textarea" ? 4 : 1}
          label={label}
          value={value}
          onChange={(e) => {
            const selectionStart = e.target.selectionStart;
            const selectionEnd = e.target.selectionEnd;
            setValue(
              id === "qty" || id === "rate"
                ? Number(e.currentTarget.value).toFixed(3)
                : e.currentTarget.value
            );
            setTimeout(() => {
              e.target.setSelectionRange(selectionStart, selectionEnd);
            }, [0]);
          }}
          className={`${customClass}`}
          inputProps={{
            sx: {
              textAlign: isNaN(value) ? "left" : "right",
            },
          }}
          {...props}
        >
          {children}
        </TextField>
      )}
      {/* {type === "select" ? (
        <>
          {endpoint ? (
            <DropdownWithAPI
              label={label}
              endpoint={endpoint}
              value={value}
              setValue={setValue}
              required={required}
            />
          ) : (
            <Select
              withAsterisk={required}
              label={label}
              searchable
              nothingFound="No options"
              data={data}
              value={value}
              onChange={(val) => setValue(val)}
            />
          )}
        </>
      ) : (
        <TextInput
          withAsterisk={required}
          variant="default"
          disabled={disabled}
          type={type}
          label={label}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          className={`${customClass}`}
          {...props}
        >
          {children}
        </TextInput>
      )} */}
    </>
  );
};

export default Input;
