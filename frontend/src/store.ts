import { atom } from "jotai";

const token = localStorage.getItem("token");
export const userAuth = atom<boolean>(token !== null);
