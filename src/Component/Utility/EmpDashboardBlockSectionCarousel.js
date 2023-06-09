import Carousel from "react-bootstrap/Carousel";
import "../../stylesheet/Utility/ReactBootstrapCarousel.css";

function EmpDashboardBlockSectionCarousel({
  completedProjectsCount,
  allProjectsCount,
  runningProjectsCount,
}) {
  return (
    <Carousel>
      <Carousel.Item>
        <h5 style={{ color: "#fff" }}>
          All <br></br> Projects
        </h5>
        <div className="count">{allProjectsCount}</div>
      </Carousel.Item>
      <Carousel.Item>
        <h5 style={{ color: "#fff" }}>
          Completed <br></br> Projects
        </h5>
        <div className="count">{completedProjectsCount}</div>
      </Carousel.Item>
      <Carousel.Item>
        <h5 style={{ color: "#fff" }}>
          Active <br></br> Projects
        </h5>
        <div className="count">{runningProjectsCount}</div>
      </Carousel.Item>
    </Carousel>
  );
}

export default EmpDashboardBlockSectionCarousel;
