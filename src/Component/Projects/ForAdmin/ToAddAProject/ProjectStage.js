// libraries
import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

// styling
import "../../../../stylesheet/Projects/ProjectStage.css";

export const ProjectStage = ({ stage, status }) => {
  let variant = "";
  if (status === "Hold") {
    variant = "danger";
  } else if (stage === "20") {
    variant = "danger";
  } else if (stage === "40") {
    variant = "warning";
  } else if (stage === "60") {
    variant = "info";
  } else if (stage === "80") {
    variant = "";
  } else if (stage === "100" || status === "completed") {
    variant = "success";
  }

  return (
    <>
      <ProgressBar
        className="bsPrefixprogress-bar"
        variant={variant}
        animated={stage === "100" ? false : true}
        // striped
        now={stage}
        label={`${stage}%`}
      />
    </>
  );
};
