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
            visitors: [{ title: '', firstName: '', lastName: '', mobile: '', proof: null, relation: "" }],
        };
    }

    componentDidMount() {
        this.props.setNavigation('Book a Room');
    }

    handleChange = (event, index) => {
        const { name, value } = event.target;
        if (name === 'fromDate' || name === 'endDate') {
            this.setState({
                [name]: value
            });
        } else {
            const visitors = [...this.state.visitors];
            visitors[index][name] = value;
            this.setState({ visitors });
        }
    };


    increaseVisitor = () => {
        this.setState((prevState) => ({
            visitors: [...prevState.visitors, { title: '', firstName: '', lastName: '', mobile: '', proof: null, relation: "" }],
        }));
    };

    removeVisitor = (index) => {
        const visitors = [...this.state.visitors];
        visitors.splice(index, 1);
        this.setState({ visitors });
    };

    handleFileInputChange = (event, index) => {
        const file = event.target.files[0];
        this.setState({ selectedFile: file });
    };

    handleSubmit = (e) => {
        console.log(this.state.fromDate, this.state.endDate, this.state.visitors);

        e.preventDefault();

        let formData = new FormData();

        formData.append(
            'requestedFrom',
            moment(this.state.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
        );
        formData.append(
            'requestedTill',
            moment(this.state.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
        );
        this.state.visitors.forEach((visitor, index) => {
            console.log(index)
            formData.append(
                `visitors[${index}][full_name]`,
                `${visitor.title} ${visitor.firstName} ${visitor.lastName}`
            );
            formData.append(
                `visitors[${index}][relation]`,
                visitor.relation
            );
            formData.append(
                `visitors[${index}][country_code]`,
                visitor.countryCode
            );
            formData.append(
                `visitors[${index}][mobile]`,
                visitor.mobile
            );
           
            if (this.state.proof && this.state.proof[index]) {
                formData.append(
                    `visitors[${index}][proof]`,
                    this.state.proof[index],
                    this.state.proof[index].name
                );
            }

        });

    
        this.setState({
            loading: true,
        });

    
        this.props.bookRoom(
            formData,
            this.props.activeHostel,
            this.successCallBack,
            this.errCallBack
        );
    };

    render() {
        const { loading, fromDate, endDate, visitors } = this.state;

        return (
            <div className={tailwindWrapper('w-2/3')}>
               
                <form onSubmit={this.handleSubmit} className={tailwindWrapper('px-8 pt-6 pb-8 mb-4')}>
                
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

                
                    {visitors.map((visitor, index) => (
                        <div key={index}>
                            <div className={tailwindWrapper('')}>
                                <div className={tailwindWrapper("flex gap-4 mt-4")}>
                                    <div className={tailwindWrapper("flex flex-col")}>
                                        <label htmlFor='title' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={visitor.title}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="Mr"
                                            className={tailwindWrapper('appearance-none border rounded py-4 text-center w-[70px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                        />
                                    </div>
                                    <div className={tailwindWrapper("flex flex-col")}>
                                        <label htmlFor='firstName' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={visitor.firstName}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="First Name"
                                            className={tailwindWrapper('appearance-none border rounded py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                        />
                                    </div>
                                    <div className={tailwindWrapper("flex flex-col")}>
                                        <label htmlFor='lastName' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={visitor.lastName}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="Last Name"
                                            className={tailwindWrapper('appearance-none border rounded py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                        />
                                    </div>
                                </div>
                                <div className={tailwindWrapper("flex gap-4 mt-4")}>
                                    <div className={tailwindWrapper("flex flex-col")}>
                                        <label htmlFor='relation' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Relation
                                        </label>
                                        <input
                                            type="text"
                                            name="relation"
                                            value={visitor.relation}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="Relation"
                                            className={tailwindWrapper('appearance-none border rounded py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                        />
                                    </div>
                                    <div className={tailwindWrapper("flex flex-col")}>
                                        <label htmlFor='proof' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Identiti Proof
                                        </label>
                                        <input
                                            type="file"
                                            name="proof"
                                            value={visitor.proof}
                                            onChange={(e) => this.handleFileInputChange(e, index)}
                                            className={tailwindWrapper('appearance-none border rounded py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline')}
                                        />
                                    </div>
                                </div>
                                <div className={tailwindWrapper('flex mt-4 gap-4')}>
                                    <div className={tailwindWrapper('mr-2')}>
                                        <label htmlFor='countryCode' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Country Code
                                        </label>
                                        <input
                                            type="text"
                                            name="countryCode"
                                            value={visitor.countryCode}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="Country Code"
                                            className={tailwindWrapper('appearance-none border rounded py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full')}
                                        />
                                    </div>
                                    <div className={tailwindWrapper('')}>
                                        <label htmlFor='mobile' className={tailwindWrapper('block text-[#0B2274] text-sm font-bold mb-2')}>
                                            Mobile
                                        </label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={visitor.mobile}
                                            onChange={(e) => this.handleChange(e, index)}
                                            placeholder="Mobile Number"
                                            className={tailwindWrapper('appearance-none border rounded py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full')}
                                        />
                                    </div>
                                </div>


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
                    <div className={tailwindWrapper("my-8")}>
                        <button type="button" onClick={this.increaseVisitor} className={tailwindWrapper('text-[#0B2274] text-xl font-bold')}>
                            + Add Visitor
                        </button>
                    </div>

        
                    <button
                        type="submit"
                        disabled={loading}
                        className={tailwindWrapper('bg-[#0B2274]  text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline')}
                    >
                        {loading ? 'Booking...' : 'Book'}
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
