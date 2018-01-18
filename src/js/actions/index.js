import { CONVERT } from "../constants/action-types";
export const convertCurrency = input => ({ type: CONVERT, payload: input });