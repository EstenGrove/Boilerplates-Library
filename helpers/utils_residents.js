import { residents } from "./utils_endpoints";
import { test } from "./utils_env";
import { isEmptyVal } from "./utils_types";

const getResidentsByUserEmail = async (token, email) => {
  let url = test.base + residents.byUserEmail;
  url += "?" + new URLSearchParams({ userEmail: email }); // params: { userEmail: "someEmail@example.com" }

  try {
    const request = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(test.user + ":" + test.password),
        SecurityToken: token
      }
    });
    const response = await request.json();
    return response;
  } catch (err) {
    console.log("An error occurred " + err);
    return err.message;
  }
};

const getResidentsByFacility = async (token, facilityID) => {
  let url = test.base + residents.byFacility;
  url += "?facilityId=" + facilityID;

  try {
    const request = await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Basic " + btoa(test.user + ":" + test.password),
        SecurityToken: token
      })
    });
    const response = await request.json();
    return response;
  } catch (err) {
    console.log("An error occured: " + err);
    return err.message;
  }
};

const parseResidentBySeparator = (resident, separator = ":") => {
  if (isEmptyVal(resident)) return;
  const first = resident.split(" ")[0].trim();
  const last = resident.split(" ")[1].trim();
  const id = resident.split(separator)[1].trim();

  return {
    first: first,
    last: last,
    id: id
  };
};

// get selected resident from input value
// find resident from array of residents
// set local state
const handleResidentSelection = (value, residents, stateSetter) => {
  const { id } = parseResidentBySeparator(value, ":");
  const [activeResident] = residents.filter(
    res => res.ResidentID === Number(id)
  );

  return stateSetter({ ...activeResident });
};

// format resident name
const formatResidentNameOnly = resident => {
  const { FirstName, LastName } = resident;
  return `${FirstName} ${LastName}`;
};

const formatResidentName = resident => {
  const { FirstName, LastName, ResidentID } = resident;
  return `${FirstName} ${LastName} ~ ResidentID: ${ResidentID}`;
};

export {
  getResidentsByFacility,
  getResidentsByUserEmail,
  handleResidentSelection,
  parseResidentBySeparator,
  formatResidentNameOnly,
  formatResidentName
};
