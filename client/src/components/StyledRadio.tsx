import { withStyles, RadioProps, Radio } from "@material-ui/core";
import React from "react";

export const StyledRadio = withStyles({
  root: {
    color: "#841617",
    "&$checked": {
      color: "#841617",
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
