import { withStyles, Theme, Button } from "@material-ui/core";

export const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "white",
    backgroundColor: "#841617",
    "&:hover": {
      backgroundColor: "rgba(132,22,23,0.8)",
    },
    marginTop: "20px",
  },
}))(Button);
