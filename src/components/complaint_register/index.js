import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  Button,
  Form,
  TextArea,
  Message,
  Segment,
  Icon,
  Header,
  Dropdown,
  Pagination,
  Table,
  Grid,
} from 'semantic-ui-react';

import { Loading } from "formula_one"

import './index.css';

import { getComplaints } from '../../actions/complaints';
import { addComplaint } from '../../actions/add_complaint';
import { complaintsUrl } from '../../urls';
import { entries } from '../constants';


class ComplaintRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complaint: '',
      category: '',
      loading: false,
      success: false,
      error: false,
      message: '',
      activePage: 1,
      complaintsLoading: true,
      entryNo: '5',
    };
  }

  componentDidMount() {
    this.props.setNavigation('Register a Complaint');

    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?me=True`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    );
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

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, complaintsLoading: true });
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?page=${activePage}`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    );
  };

  handleEntriesChange = (e, { value }) => {
    this.setState({ entryNo: value })
    this.setState({
      pendingLoading: true
    })
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?page=${this.state.activePage}&perPage=${value}`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    );
  }

  handleSubmit = (e) => {
    let data = {
      complaintType: this.state.category,
      description: this.state.complaint.trim(),
    };
    this.setState({
      loading: true,
    })
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
      message: res.statusText,
      loading: false,
      convenientTime: '',
      complaint: '',
      category: '',
      complaintsLoading: true,
    });
    this.props.getComplaints(
      `${complaintsUrl(this.props.activeHostel)}?me=True`,
      this.complaintsSuccessCallBack,
      this.complaintsErrCallBack
    );
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
      loading: false,
      activePage:1,
    });
  };
  render() {
    const { complaints, constants } = this.props;
    const { activePage, loading, complaintsLoading, complaint, category, entryNo } = this.state;
    let options = [];
    for (var i in constants.complaint_types) {
      options.push({
        key: i.toString(),
        text: constants.complaint_types[i].toString(),
        value: i.toString(),
      });
    }
    return (
      <Grid.Column width={12} floated='left'>
        {this.state.error && (
          <Message warning>
            <Icon name='warning' />
            Your complaint could not be made. Please try again
          </Message>
        )}
        {this.state.success && (
          <Message positive>Your complaint has been made succesfully</Message>
        )}
        <Form>
          <Form.Field required>
            <label>Category</label>
            <Dropdown
              name='category'
              selection
              options={options}
              value={category}
              onChange={this.handleChange}
              styleName='field-width'
              required
            />
          </Form.Field>
          <div styleName='info'>
            <div>3 attempts will be made to resolve your complaint</div>
            <div>
              The complaint will be deleted after 3 unsuccessful attempts
            </div>
          </div>
          <Form.Field
            name='complaint'
            value={complaint}
            onChange={this.handleChange}
            control={TextArea}
            label='Complaint Description / Feedback'
            placeholder='Type your complaint here ....'
            styleName='complaint'
            rows='5'
            required
          />
          <Button
            size='medium'
            styleName='button'
            onClick={this.handleSubmit}
            width={3}
            loading={loading}
            disabled={complaint.trim()=='' || category==''}
          >
            Submit
          </Button>
        </Form>
        <Header as='h3'>My Complaints and Feedback</Header>
        
        {!complaintsLoading?
          (
            <React.Fragment>
              {(complaints.results && complaints.results.length > 0)?
          (
            <React.Fragment>
          <div styleName="table-height">
          <Table unstackable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Complaint Description</Table.HeaderCell>
                <Table.HeaderCell>complaint Type</Table.HeaderCell>
                <Table.HeaderCell>complaint Status</Table.HeaderCell>
                <Table.HeaderCell>complaint Date and Time</Table.HeaderCell>
                <Table.HeaderCell>Applicant Room</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {complaints.results && complaints.results.length > 0
                ? complaints.results.map((complaint, index) => {
                    return (
                      <Table.Row>
                        <Table.Cell>
                          {entryNo * (activePage - 1) + index + 1}
                        </Table.Cell>
                        <Table.Cell>{complaint.description}</Table.Cell>
                        <Table.Cell>
                          {constants.complaint_types[complaint.complaintType]}
                        </Table.Cell>
                        <Table.Cell>
                          {constants.statues.COMPLAINT_STATUSES[complaint.status]}
                          {constants.statues.COMPLAINT_STATUSES[complaint.status]!='RESOLVED' && complaint.remark && 
                            <>
                              <br/> ( {complaint.remark} )
                            </>
                          }
                        </Table.Cell>
                        <Table.Cell>
                          {moment(
                            complaint.datetimeCreated
                          ).format('DD/MM/YY, hh:mm a')}
                        </Table.Cell>
                        <Table.Cell>{complaint.roomNo}</Table.Cell>
                      </Table.Row>
                    );
                  })
                : null}
            </Table.Body>
          </Table>
          </div>
          <div styleName='pagination-container'>
            <div>
              {complaints.count > entryNo ? (
                <Pagination
                  activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={Math.ceil(complaints.count / entryNo)}
                />
              ) : null}
            </div>
            <div>
              Entries per page : 
                <Dropdown
                  name='entries'
                  selection
                  options={entries}
                  onChange={this.handleEntriesChange}
                  value={entryNo}
                  compact
                />
            </div>
          </div>
        </React.Fragment>
          ):
          (
            <Segment>No Complaints or Feedback Yet</Segment>
          )
        }
            </React.Fragment>
          ):
          (
            <Loading />
          )
        }

      </Grid.Column>
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
    addComplaint: (data, residence, successCallBack, errCallBack) => {
      dispatch(addComplaint(data, residence, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintRegister);
