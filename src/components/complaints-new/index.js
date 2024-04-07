import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addComplaint } from "../../actions/add_complaint";

import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

import ComplaintsRegisterNew from "../Complaints-register-new";

class ComplaintForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      startTime: "",
      endTime: "",
      category: "",
      loading: false,
      success: false,
      error: false,
      selectedFile: null,
    };
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    this.props.setNavigation("Register a Complaint");
  }

  handleFileInputChange = (event) => {
    const file = event.target.files[0];
    this.setState({ selectedFile: file });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      complaintType: this.state.category,
      description: this.state.description.trim(),
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    };
    this.setState({
      loading: true,
    });
    this.props.addComplaint(
      data,
      this.props.activeHostel,
      this.successCallBack,
      this.errCallBack
    );
  };

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      loading: false,
    });
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      loading: false,
    });
  };

  render() {
    return (
      <div className={tailwindWrapper("w-2/3 ml-16")}>
        <form
          onSubmit={this.handleSubmit}
          className={tailwindWrapper("  mb-8")}
        >
          <div className={tailwindWrapper("mb-4")}>
            <Link
              to="/bhawan_app/complaints"
              className={tailwindWrapper("text-[#133BC5] font-bold text-xl")}
            >
              Complaints
            </Link>
            <span className={tailwindWrapper("px-4")}>{"|"}</span>
            <Link
              to="/bhawan_app/feedback"
              className={tailwindWrapper("text-[#7D7777]")}
            >
              Feedbacks
            </Link>
          </div>
          <div className={tailwindWrapper("mb-4")}>
            <label
              className={tailwindWrapper(
                "block text-[#0B2274] text-sm font-bold mb-2"
              )}
              htmlFor="category"
            >
              Category:
            </label>
            <select
              className={tailwindWrapper(
                " w-[300px] border rounded px-4 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              )}
              name="category"
              value={this.state.category}
              onChange={this.handleInputChange}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Electrical">Electrical</option>
              <option value="Washroom">Washroom</option>
              <option value="Carpentry">Carpentry</option>
            </select>
          </div>

          <div className={tailwindWrapper("mb-4")}>
            <label
              className={tailwindWrapper(
                "block text-[#0B2274] text-sm font-bold mb-2"
              )}
              htmlFor="description"
            >
              Complaint Description:
            </label>
            <textarea
              className={tailwindWrapper(
                " border rounded w-[550px] h-[125px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              )}
              name="description"
              placeholder="write your complaint here"
              value={this.state.description}
              onChange={this.handleInputChange}
            ></textarea>
          </div>

          <div className={tailwindWrapper("mb-4")}>
            <label
              className={tailwindWrapper(
                "block text-[#0B2274] text-sm font-bold mb-2"
              )}
              htmlFor="startTime"
              defaultValue={"6:00"}
            >
              Preferred Time:
            </label>
            <div className={tailwindWrapper("flex items-center mb-4")}>
              <input
                className={tailwindWrapper(
                  " border rounded  px-12 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                )}
                type="time"
                name="startTime"
                value={this.state.startTime}
                onChange={this.handleInputChange}
              />
              <span className={tailwindWrapper("mx-2")}>___</span>
              <input
                className={tailwindWrapper(
                  "border rounded px-12 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                )}
                type="time"
                name="endTime"
                value={this.state.endTime}
                onChange={this.handleInputChange}
              />
            </div>
            <div className={tailwindWrapper("mb-4")}>
              <label
                className={tailwindWrapper(
                  "block text-[#0B2274] text-sm font-bold mb-2"
                )}
                htmlFor="file"
              >
                Attachment:
              </label>
              <input
                className={tailwindWrapper(
                  "border rounded w-[215px] text-center px-4 py-2 text-[#0B2274]"
                )}
                type="file"
                name="attachment"
                ref={this.fileInputRef}
                onChange={this.handleFileInputChange}
              />
            </div>
          </div>

          <div className={tailwindWrapper("")}>
            <button
              type="submit"
              className={tailwindWrapper(
                "bg-[#133BC5] w-[200px] text-[#FFF2F2] font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
              )}
            >
              Complaint
            </button>
          </div>
        </form>
        <ComplaintsRegisterNew />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    complaints: state.complaints,
    activeHostel: state.activeHostel,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addComplaint: (data, residence, successCallBack, errCallBack) => {
      dispatch(addComplaint(data, residence, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintForm);
