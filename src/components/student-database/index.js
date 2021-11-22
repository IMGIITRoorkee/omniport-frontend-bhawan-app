import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Table, Container, Dropdown, Pagination, Segment, Button, Checkbox, Input } from 'semantic-ui-react'

import { Loading } from "formula_one";

import { residentUrl, residentDownloadUrl } from '../../urls'

import { getResidents, downloadResidents } from '../../actions/residents'

import './index.css'

const yearOptions = [
  { key: 1, text: '1st Year', value: 1 },
  { key: 2, text: '2nd Year', value: 2 },
  { key: 3, text: '3rd Year', value: 3 },
  { key: 4, text: '4rd Year', value: 4 },
  { key: 5, text: '5rd Year', value: 5 }
]

class StudentDatabase extends Component {
  state = {
    activePage: 1,
    filterYear: "",
    filterBranch: '',
    loading: true,
    currentResidentDownloadUrl: '',
    allResidents: false,
    residentSearch: "",
  };

  componentDidMount() {
    this.props.getResidents(
      `${residentUrl(this.props.activeHostel)}?is_student=true`,
      this.successCallBack,
      this.errCallBack
    )
    this.setState({
      currentResidentDownloadUrl: residentDownloadUrl(this.props.activeHostel)
    })
  }

  onChange = (event, { name, value }) => {
    let filter = '?is_student=true&'
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value }, () => {
        if (name == 'filterYear') {
          if (value != '') filter = `${filter}year=${value}&`
          if (this.state.filterBranch != '')
            filter = `${filter}branch=${this.state.filterBranch}&`
        } else if (name == 'filterBranch') {
          if (value != '') filter = `${filter}branch=${value}&`
          if (this.state.filterYear != '')
            filter = `${filter}year=${this.state.filterYear}&`
        }

        if (this.state.allResidents) {
          filter = `${filter}all=${true}&`
        }

        if (this.state.residentSearch.length >= 3) {
          filter = `${filter}search=${this.state.residentSearch}&`
        }

        this.setState({
          loading: true
        })

        this.props.getResidents(
          `${residentUrl(this.props.activeHostel)}${filter}`,
          this.successCallBack,
          this.errCallBack
        )

        this.setState({
          activePage: 1,
          currentResidentDownloadUrl: `${residentDownloadUrl(
            this.props.activeHostel
          )}${filter}`
        })
      })
    }
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, loading: false })
    this.props.getResidents(
      `${residentUrl(this.props.activeHostel)}?page=${activePage}`,
      this.successCallBack,
      this.errCallBack
    )
  }

  successCallBack = () => {
    this.setState({
      loading: false
    })
  }

  errCallBack = () => {
    this.setState({
      loading: false,
    })
  }

  render() {
    const {
      activePage,
      filterBranch,
      filterYear,
      loading,
      currentResidentDownloadUrl,
      allResidents,
      residentSearch
    } = this.state
    const { residents, constants } = this.props

    let branchOptions = [];
    for (var i in constants.branches) {
      branchOptions.push({
        key: i.toString(),
        value: i.toString(),
        text: constants.branches[i].toString(),
      });
    }

    return (
      <div>
        <Header as='h4'>Student Database </Header>
        <Container>
        <div styleName='filter-container'>
          <div styleName='filter-container'>
            <Dropdown
              name="filterYear"
              clearable
              options={yearOptions}
              onChange={this.onChange}
              placeholder="Filter by year"
              value={filterYear}
              selection
            />
            <Dropdown
              name="filterBranch"
              clearable
              search
              placeholder="Filter by branch"
              value={filterBranch}
              onChange={this.onChange}
              options={branchOptions}
              selection
            />
            <Input
              name="residentSearch"
              value={residentSearch}
              onChange={this.onChange}
              icon="search"
              placeholder="Enter 3 characters to search."
            />
            <Checkbox
              name="allResidents"
              checked={allResidents}
              label="All residents"
              onChange={(e, { name, checked }) =>
                this.onChange(e, { name: name, value: checked })
              }
            />
          </div>
          <a href={currentResidentDownloadUrl} download>
            <Button
            primary
            >
              Download list
            </Button>
          </a>
        </div>
        {!loading?
          (
            <React.Fragment>
              {(residents.results && residents.results.length > 0)
                ?
                (
                  <div styleName = "table-overflow">
                    <Table unstackable celled>
                    <Table.Header>
                      <Table.Row>
                      <Table.HeaderCell>Enrollment No</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Room No.</Table.HeaderCell>
                        <Table.HeaderCell>Contact No.</Table.HeaderCell>
                        <Table.HeaderCell>Email Address</Table.HeaderCell>
                        <Table.HeaderCell>Current Year</Table.HeaderCell>
                        <Table.HeaderCell>Department</Table.HeaderCell>
                        <Table.HeaderCell>Date Of Birth</Table.HeaderCell>
                        {allResidents && <Table.HeaderCell>Hostel</Table.HeaderCell>}
                        <Table.HeaderCell>Display Picture</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {residents.results && residents.results.length > 0
                        ? residents.results.map((resident, index) => {
                            return (
                              <Table.Row key={index}>
                                <Table.Cell>{resident.enrolmentNumber}</Table.Cell>
                                <Table.Cell>{resident.residentName}</Table.Cell>
                                <Table.Cell>{resident.roomNumber}</Table.Cell>
                                <Table.Cell>{resident.phoneNumber}</Table.Cell>
                                <Table.Cell>{resident.emailAddress}</Table.Cell>
                                <Table.Cell>{resident.currentYear}</Table.Cell>
                                <Table.Cell>{resident.department}</Table.Cell>
                                <Table.Cell>{resident.dateOfBirth}</Table.Cell>
                                {allResidents && <Table.Cell>{resident.hostelCode}</Table.Cell>}
                                <Table.Cell>
                                  {resident.displayPicture? (
                                    <a href={resident.displayPicture} download={resident.residentName}>
                                      Download
                                    </a>
                                    ):
                                    (
                                      <span>No Display Image</span>
                                    )
                                  }
                                </Table.Cell>
                              </Table.Row>
                            )
                          })
                        : null}
                    </Table.Body>
                  </Table>
                  {residents.count > 5 ? (
                    <Pagination
                      activePage={activePage}
                      onPageChange={this.handlePaginationChange}
                      totalPages={Math.ceil(residents.count / 5)}
                    />
                  ) : null}
                  </div>
                ):
                (
                  <Segment>No Student with applied filters found</Segment>
                )
              }
            </React.Fragment>
          ):
          (
            <Loading />
          )
        }
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    residents: state.residents,
    activeHostel: state.activeHostel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getResidents: (url, successCallBack, errCallBack) => {
      dispatch(getResidents(url, successCallBack, errCallBack))
    },
    downloadResidents: (url, successCallBack, errCallBack) => {
      dispatch(downloadResidents(url, successCallBack, errCallBack))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDatabase)

