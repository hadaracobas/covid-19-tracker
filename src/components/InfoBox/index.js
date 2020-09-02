import React from "react";
import "./index.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, total }) {
  return (
    <Card className="infoBox">
      <CardContent>
        {/* title */}
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>
        <h2 className="infoBox__cases">{cases}</h2>
        <Typography color="textSecondary" className="infoBox__total">
          {total}
        </Typography>
        {/* num of cases */}

        {/* total */}
      </CardContent>
    </Card>
  );
}

export default InfoBox;
