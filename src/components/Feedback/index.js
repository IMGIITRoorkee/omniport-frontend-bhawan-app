import React, { Component } from "react";
import { Link } from "react-router-dom";

import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";
import FeedbackTable from "../feebback-card-new";

class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: "",
      attachment: null,
    };
    this.fileInputRef = React.createRef();
  }

  handleFileInputChange = () => {
    const file = this.fileInputRef.current.files[0];
    this.setState({ attachment: file });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    alert("Feedback submitted");
  };
  render() {
    return (
      <div className={tailwindWrapper("w-2/3 ml-4 mb-8")}>
        <form onSubmit={this.handleSubmit} className={tailwindWrapper("mb-8")}>
          <div className={tailwindWrapper("mb-4")}>
            <Link
              to="/bhawan_app/complaint"
              className={tailwindWrapper("text-[#7D7777] ")}
            >
              Complaints
            </Link>
            <span className={tailwindWrapper("px-4")}>{"|"}</span>
            <Link
              to="/bhawan_app/feedback"
              className={tailwindWrapper("text-[#133BC5] font-bold text-xl")}
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
              htmlFor="feedback"
            >
              Feedback:
            </label>
            <textarea
              className={tailwindWrapper(
                " border rounded w-[550px] h-[125px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              )}
              name="feedback"
              placeholder="Write your feedback here"
              value={this.state.feedback}
              onChange={this.handleInputChange}
            ></textarea>
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

          <div className={tailwindWrapper("")}>
            <button
              type="submit"
              className={tailwindWrapper(
                "bg-[#133BC5] w-[200px] text-[#FFF2F2] font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
              )}
            >
              Submit Feedback
            </button>
          </div>
        </form>
        <FeedbackTable />
      </div>
    );
  }
}

export default FeedbackForm;
