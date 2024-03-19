import React, { Component } from 'react';

import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

class ComplaintForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            description: '',
            startTime: '',
            startTime: '06:00',
            endTime: '06:00',
            attachment: null,
        };
        this.fileInputRef = React.createRef();
    }

    handleFileInputChange = () => {
        const file = this.fileInputRef.current.files[0];
        console.log(file)
        this.setState({ attachment: file });
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        alert("complain registered")
        console.log(this.state)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className={tailwindWrapper("w-2/3 ml-16 mb-8")}>
                <div className={tailwindWrapper("mb-4")}>
                    <label className={tailwindWrapper("block text-[#0B2274] text-sm font-bold mb-2")} htmlFor="category">
                        Category:
                    </label>
                    <select
                        className={tailwindWrapper(" w-[300px] border rounded px-4 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")}
                        name="category"
                        value={this.state.category}
                        onChange={this.handleInputChange}
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Washroom">Washroom</option>
                        <option value="Carpentry">Carpentry</option>
                    </select>
                </div>

                <div className={tailwindWrapper("mb-4")}>
                    <label className={tailwindWrapper("block text-[#0B2274] text-sm font-bold mb-2")} htmlFor="description">
                        Complaint Description:
                    </label>
                    <textarea
                        className={tailwindWrapper(" border rounded w-[550px] h-[125px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")}
                        name="description"
                        placeholder='write you complaint here'
                        value={this.state.description}
                        onChange={this.handleInputChange}
                    ></textarea>
                </div>

                <div className={tailwindWrapper("mb-4")}>
                    <label className={tailwindWrapper("block text-[#0B2274] text-sm font-bold mb-2")} htmlFor="startTime" defaultValue={"6:00"}>
                        Preferred Time:
                    </label>
                    <div className={tailwindWrapper("flex items-center mb-4")}>
                        <input
                            className={tailwindWrapper(" border rounded  px-12 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")}
                            type="time"
                            name="startTime"

                            value={this.state.startTime}
                            onChange={this.handleInputChange}
                        />
                        <span className={tailwindWrapper("mx-2")}>___</span>
                        <input
                            className={tailwindWrapper("border rounded px-12 py-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline")}
                            type="time"
                            name="endTime"
                            value={this.state.endTime}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className={tailwindWrapper("mb-4")}>
                        <label className={tailwindWrapper("block text-[#0B2274] text-sm font-bold mb-2")} htmlFor="file">
                            Attachment:
                        </label>
                        <input
                            className={tailwindWrapper("border rounded w-[215px] text-center px-4 py-2 text-[#0B2274]")}
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
                        className={tailwindWrapper("bg-[#133BC5] w-[200px] text-[#FFF2F2] font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline")}

                    >
                        Complaint
                    </button>
                </div>
            </form>
        );
    }
}

export default ComplaintForm;
