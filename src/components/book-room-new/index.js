import React from 'react';
import { connect } from 'react-redux';
import { bookRoom } from '../../actions/book-room';
import moment from 'moment';
import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper"

class BookRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromDate: '',
            fromTime: '',
            endDate: '',
            endTime: '',
            loading: false,
            visitors: [{ title: '', firstName: '', lastName: '', mobile: '', proof: null }],
        };
    }

    componentDidMount() {
        this.props.setNavigation('Book a Room');
    }

    handleChange = (event, index) => {
        const { name, value } = event.target;
        const visitors = [...this.state.visitors];
        visitors[index][name] = value;
        this.setState({ visitors });
    };

    increaseVisitor = () => {
        this.setState((prevState) => ({
            visitors: [...prevState.visitors, { title: '', firstName: '', lastName: '', mobile: '', proof: null }],
        }));
    };

    removeVisitor = (index) => {
        const visitors = [...this.state.visitors];
        visitors.splice(index, 1);
        this.setState({ visitors });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    render() {
        const { loading, fromDate, endDate, visitors } = this.state;

        return (
            <div className={tailwindWrapper('w-2/3')}>
                {/* Form */}
                <form onSubmit={this.handleSubmit} className={tailwindWrapper('px-8 pt-6 pb-8 mb-4')}>
                    {/* Date Inputs */}
                    <div className={tailwindWrapper('mb-4 w-full flex gap-3')}>
                        <div >
                            <label htmlFor='fromDate' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                From Date
                            </label>
                            <input
                                type='date'
                                id='fromDate'
                                name='fromDate'
                                value={fromDate}
                                onChange={this.handleChange}
                                className={tailwindWrapper('border rounded  py-4 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                            />
                        </div>
                        <div className={tailwindWrapper('mb-4')}>
                            <label htmlFor='endDate' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                End Date
                            </label>
                            <input
                                type='date'
                                id='endDate'
                                name='endDate'
                                value={endDate}
                                onChange={this.handleChange}
                                className={tailwindWrapper('border rounded  py-4 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                            />
                        </div>
                    </div>

                    {/* Visitors Section */}
                    {visitors.map((visitor, index) => (
                        <div key={index}>
                            <div className={tailwindWrapper('grid grid-cols-3 gap-4')}>
                                <input
                                    type="text"
                                    name="title"
                                    value={visitor.title}
                                    onChange={(e) => this.handleChange(e, index)}
                                    placeholder="Title (Mr., Mrs., etc.)"
                                    className={tailwindWrapper('appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={visitor.firstName}
                                    onChange={(e) => this.handleChange(e, index)}
                                    placeholder="First Name"
                                    className={tailwindWrapper('appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={visitor.lastName}
                                    onChange={(e) => this.handleChange(e, index)}
                                    placeholder="Last Name"
                                    className={tailwindWrapper('appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                />
                                <input
                                    type="text"
                                    name="mobile"
                                    value={visitor.mobile}
                                    onChange={(e) => this.handleChange(e, index)}
                                    placeholder="Mobile Number"
                                    className={tailwindWrapper('appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                />
                                {/* Add file input for proof */}
                                <input
                                    type="file"
                                    name="proof"
                                    onChange={(e) => this.handleFileChange(e, index)}
                                    className={tailwindWrapper('appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                />
                            </div>
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => this.removeVisitor(index)}
                                    className={tailwindWrapper('text-red-500')}
                                >
                                    Remove Visitor
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={this.increaseVisitor} className={tailwindWrapper('text-blue-500')}>
                        Add Visitor
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={tailwindWrapper('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline')}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeHostel: state.activeHostel,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        bookRoom: (data, residence, successCallBack, errCallBack) => {
            dispatch(bookRoom(data, residence, successCallBack, errCallBack));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookRoom);
