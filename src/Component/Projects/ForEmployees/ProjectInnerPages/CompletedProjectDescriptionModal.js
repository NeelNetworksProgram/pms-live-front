// libraries
import React, { useState } from "react";
import { Button } from "react-bootstrap";

// styling
import "../../../../stylesheet/Projects/ProjectDescriptionModal.css";

// component
import { projectCategoryOptions } from "../../../Utility/ProjectCategoryOptions";

const CompletedProjectDescriptionModal = ({ projectDescriptionData }) => {
  // states
  const [description, setDescription] = useState(
    projectDescriptionData.description
  );

  // helper function for getting label of Project category
  const getCategory = (categoryValue) => {
    const categoryLabel = projectCategoryOptions.filter(
      (ele) => ele.value === categoryValue
    );
    return categoryLabel;
  };

  const category = getCategory(projectDescriptionData.project_category); // [{value , label}]
  const getLabel = () => (category.length > 0 ? category[0].label : "N/A");

  const handleEdit = (data) => {
    // console.log("hi", data);
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit(projectDescriptionData)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal3-${projectDescriptionData.Project_id}`}
      >
        <i className="fa-solid fa-comment-dots"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal3-${projectDescriptionData.Project_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
                Project Description
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="project-description-modal-body text-dark">
              <div className="project-description-modal-body__header">
                Project Name: {projectDescriptionData.Project_name}
              </div>
              <div className="project-description-modal-body__content text-dark">
                <div className="description-field">
                  <p className="description-field__label">Project Type:</p>
                  <p className="description-field__p">{getLabel()}</p>
                </div>
                <div className="description-field">
                  <p className="description-field__label">Job Role:</p>
                  <p className="description-field__p">
                    {projectDescriptionData.user_category !== ""
                      ? projectDescriptionData.user_category
                      : "N/A"}
                  </p>
                </div>
                <div className="description-field">
                  <p className="description-field__label">Completion Time:</p>
                  <p className="description-field__p">
                    {projectDescriptionData.completion_time !== ""
                      ? `${projectDescriptionData.completion_time} hours`
                      : "N/A"}
                  </p>
                </div>
                <div className="description-field__for-description">
                  <p className="description-field__label__for-description">
                    Description:{" "}
                    {description === "" ? "No Description available" : ""}
                  </p>
                  {description !== "" ? (
                    <div
                      className="description-field__p__for-description"
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectDescriptionModal;
