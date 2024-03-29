import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { tailwindWrapper } from '../../../../../formula_one/src/utils/tailwindWrapper';
import { Loading } from "formula_one"

import { getComplaints } from '../../actions/complaints';
import { complaintsUrl } from '../../urls';
import { entries } from '../constants';

class ComplaintsRegisterNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            success: false,
            error: false,
            message: '',
            complaintsLoading: true,
        };
    }

    componentDidMount() {
        this.props.getComplaints(
            `${complaintsUrl(this.props.activeHostel)}?me=True`,
            this.complaintsSuccessCallBack,
            this.complaintsErrCallBack
        );
    }

    componentWillUnmount() {
        console.log("yeooo")
    }

    complaintsSuccessCallBack = (res) => {
        this.setState({
            complaintsLoading: false,
        })
    }

    complaintsErrCallBack = (err) => {
        this.setState({
            complaintsLoading: false,
        })
    }

    render() {
        const { complaints, constants } = this.props;
        const { complaintsLoading } = this.state;

        return (
            <div className={tailwindWrapper("w-full")}>
                {this.state.error && (
                    <div className={tailwindWrapper("bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative")} role="alert">
                        <strong className={tailwindWrapper("font-bold")}>Error!</strong>
                        <span className={tailwindWrapper("block sm:inline")}>{this.state.message}</span>
                    </div>
                )}
                {this.state.success && (
                    <div className={tailwindWrapper("bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative")} role="alert">
                        <strong className={tailwindWrapper("font-bold")}>Success!</strong>
                        <span className={tailwindWrapper("block sm:inline")}>{this.state.message}</span>
                    </div>
                )}

                <h3 className={tailwindWrapper("text-xl text-[#133BC5] font-bold mt-4")}>My Complaints</h3>

                {!complaintsLoading && complaints.results && complaints.results.length > 0 ? (
                    <div className={tailwindWrapper("overflow-x-auto my-8")}>
                        <table className={tailwindWrapper("min-w-full divide-y divide-gray-200")}>
                            <thead className={tailwindWrapper("bg-[#6381EB]")}>
                                <tr className={tailwindWrapper("")}>
                                    <th scope="col" className={tailwindWrapper("px-6 py-6 text-left text-xs font-medium text-white uppercase tracking-wider")}>
                                        ID
                                    </th>
                                    <th scope="col" className={tailwindWrapper("px-6 py-6 text-left text-xs font-medium text-white uppercase tracking-wider")}>
                                        Description
                                    </th>
                                    <th scope="col" className={tailwindWrapper("px-6 py-6 text-left text-xs font-medium text-white uppercase tracking-wider")}>
                                        Type
                                    </th>
                                    <th scope="col" className={tailwindWrapper("px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider")}>
                                        Status
                                    </th>
                                    <th scope="col" className={tailwindWrapper("px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider")}>
                                        Date and Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={tailwindWrapper("bg-white divide-y divide-gray-200")}>
                                {complaints.results.map((complaint, index) => (
                                    <tr key={index} className={tailwindWrapper(index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                                        <td className={tailwindWrapper("px-6 py-4 whitespace-nowrap")}>{index + 1}</td>
                                        <td className={tailwindWrapper("px-6 py-4 whitespace-nowrap")}>{complaint.description}</td>
                                        <td className={tailwindWrapper("px-6 py-4 whitespace-nowrap")}>{complaint.complaintType}</td>
                                        <td className={tailwindWrapper("px-6 py-4 whitespace-nowrap")}>{complaint.status}</td>
                                        <td className={tailwindWrapper("px-6 py-4 whitespace-nowrap")}>{moment(complaint.datetimeCreated).format('DD/MM/YY, hh:mm a')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={tailwindWrapper("mt-4")}>No Complaints Yet</div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        complaints: state.complaints,
        activeHostel: state.activeHostel
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getComplaints: (url, successCallBack, errCallBack) => {
            dispatch(getComplaints(url, successCallBack, errCallBack));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsRegisterNew);
