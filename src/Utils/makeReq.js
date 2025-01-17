import axios from "axios";

export const makeReq = async ({ method, endpoint, data }) => {
  try {
    const res = await axios({
      method,
      url: `http://localhost:3000/${endpoint}`,
      data,
    });
    console.log(res)
    return { data: res.data, statusText: res.statusText };
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
