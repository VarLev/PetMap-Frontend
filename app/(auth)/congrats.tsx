import CongratulationsScreen from "@/components/auth/CongratulationsScreen";
import { StatusBar } from "expo-status-bar";
import React from "react";

function Congratulations() {
  return (
    <>
      <StatusBar  style="light" />
      <CongratulationsScreen />
    </>
  );
}

export default Congratulations;
