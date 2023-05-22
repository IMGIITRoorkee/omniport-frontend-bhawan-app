import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Loading } from "formula_one";

import locals from "./index.css";
import styles from "core/index.css";

import { complaintsUrl, urlStaticBase } from "../../urls";
import { getComplaints } from "../../actions/complaints";
import { addComplaint } from "../../actions/add_complaint";
import ComplaintCard from "../complaint_card/index";

class HomeComplaints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complaints: {},
      max_length: 6,
      loading: true,
    };
  }

  componentDidMount() {
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?me=True`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    );
  }

  complaintsSuccessCallBack = (res) => {
    this.setState({
      loading: false,
      complaints: res.data,
    });
  };

  complaintsErrCallBack = (err) => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const { complaints, constants } = this.props;
    const { loading } = this.state;

    return (
      <div className={`${styles["my-12"]} ${styles["w-full"]}`}>
        <div
          className={`${styles["flex"]} ${styles["flex-row"]} ${locals["gap-16"]}`}
        >
          <img
            src={`${urlStaticBase()}/complaints.png`}
            height="25px"
            width="31px"
          />
          <span
            className={`${styles["text-blue-700"]} ${styles["not-italic"]} ${styles["font-bold"]} ${styles["text-xl"]} ${styles["leading-7"]}`}
          >
            Complaints
          </span>
        </div>
        {!loading ? (
          <React.Fragment>
            <div
              className={`${styles["flex"]} ${styles["flex-col"]} ${styles["flex-grow"]}`}
            >
              <div
                className={`${styles["font-bold"]} ${styles["leading-4"]} ${styles["mt-10"]}`}
              >
                My complaints and Feedback
              </div>
              <table
                className={`${styles["mt-6"]} ${styles["table-fixed"]} ${styles["w-full"]}`}
              >
                <thead className={`${styles["text-left"]}`}>
                  <tr>
                    <th> </th>
                    <th
                      className={`${locals["color-primary"]} ${styles["w-1/2"]} ${styles["p-2"]}`}
                    >
                      Complaint details
                    </th>
                    <th
                      className={`${locals["color-primary"]} ${styles["w-1/4"]} ${styles["p-2"]}`}
                    >
                      Complaint date &amp; time
                    </th>
                    <th
                      className={`${locals["color-primary"]} ${styles["w-1/4"]} ${styles["p-2"]}`}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.results && complaints.results.length > 0 ? (
                    complaints.results.map((complaint, index) => {
                      return (
                        <ComplaintCard
                          index={index}
                          key={index}
                          complaint={complaint}
                          constants={constants}
                        />
                      );
                    })
                  ) : (
                    <div
                      className={`${styles["text-center"]} ${styles["w-full"]}`}
                    >
                      No Complaints made yet
                    </div>
                  )}
                </tbody>
              </table>
              <div
                className={`${locals["max-width-350"]} ${styles["mt-6"]} ${styles["w-full"]} ${styles["non-italic"]} ${styles["font-bold"]} ${styles["leading-4"]}`}
              >
                Having problem regarding rooms,washrooms or mess?
              </div>
              <Link to="/bhawan_app/complaint">
                <button
                  className={`${locals["color-light"]} ${styles["rounded-md"]} ${styles["p-2"]} ${styles["w-48"]} ${styles["text-white"]} ${styles["mt-6"]}`}
                >
                  Register a complaint
                </button>
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    complaints: state.complaints,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComplaints: (url, successCallBack, errCallBack) => {
      dispatch(getComplaints(url, successCallBack, errCallBack));
    },
    addComplaint: () => {
      dispatch(addComplaint());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeComplaints);
