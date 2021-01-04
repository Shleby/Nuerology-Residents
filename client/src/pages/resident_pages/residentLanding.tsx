import React from "react";
import { useUserContext } from "../../context/userContext";

export default function ResidentLanding() {
  const { displayName } = useUserContext()!;
  return <h1>Resident Landing Page, Hello, {displayName} </h1>;
}
