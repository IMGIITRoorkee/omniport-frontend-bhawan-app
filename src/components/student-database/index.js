import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Header,
  Table,
  Container,
  Dropdown,
  Pagination,
  Segment,
  Button,
  Checkbox,
  Input,
  Modal,
  Image,
  Icon,
} from 'semantic-ui-react'

import moment from 'moment'

import { Loading } from "formula_one";

import { residentUrl, residentDownloadUrl, markInsideUrl, markOutUrl, updateBhawanDataUrl } from '../../urls'

import { getResidents, downloadResidents, fetchPreviousRecords } from '../../actions/residents'
import { updateBhawanData } from '../../actions/update_bhawan_data'

import './index.css'

const yearOptions = [
  { key: 1, text: '1st Year', value: 1 },
  { key: 2, text: '2nd Year', value: 2 },
  { key: 3, text: '3rd Year', value: 3 },
  { key: 4, text: '4th Year', value: 4 },
  { key: 5, text: '5th Year', value: 5 },
  { key: 6, text: '6th Year', value: 6 },
  { key: 7, text: '7th Year', value: 7 },
  { key: 8, text: '8th Year', value: 8 },
  { key: 9, text: '9th Year', value: 9 },
  { key: 10, text: '10th Year', value: 10 },
]

const semesterOptions = [
  { key: 1, text: '1st Semester', value: 1 },
  { key: 2, text: '2nd Semester', value: 2 },
  { key: 3, text: '3rd Semester', value: 3 },
  { key: 4, text: '4th Semester', value: 4 },
  { key: 5, text: '5th Semester', value: 5 },
  { key: 6, text: '6th Semester', value: 6 },
  { key: 7, text: '7th Semester', value: 7 },
  { key: 8, text: '8th Semester', value: 8 },
  { key: 9, text: '9th Semester', value: 9 },
  { key: 10, text: '10th Semester', value: 10 },
  { key: 11, text: '11th Semester', value: 11 },
  { key: 12, text: '12th Semester', value: 12 },
  { key: 13, text: '13th Semester', value: 13 },
  { key: 14, text: '14th Semester', value: 14 },
  { key: 15, text: '15th Semester', value: 15 },
  { key: 16, text: '16th Semester', value: 16 },
  { key: 17, text: '17th Semester', value: 17 },
  { key: 18, text: '18th Semester', value: 18 },
  { key: 19, text: '19th Semester', value: 19 },
  { key: 20, text: '20th Semester', value: 20 },
]

class StudentDatabase extends Component {
  state = {
    activePage: 1,
    open: false,
    filter: '',
    filterYear: [],
    filterSemester: [],
    filterBranch: [],
    filterDegree: [],
    loading: true,
    currentResidentDownloadUrl: '',
    allResidents: false,
    residentSearch: "",
    inCampus: "",
    activeResident: {},
    previousRecords: [],
    feeTypeFilter: "",
    file: null,
    fileReader: new FileReader(),
    is_maintainer: false,
    errMessage: "",
    fileName: "Choose csv file",
    csvData: "",
    checked: false,
    nonResident: false,
  };

  componentDidMount() {
    let url = `${residentUrl(this.props.activeHostel)}?is_student=true`

    this.setState({
      currentResidentDownloadUrl: residentDownloadUrl(this.props.activeHostel)
    })

    if (this.props.activeHostel == 'nor') {
      this.setState({ nonResident: true })
      url += `&is_resident=false`
      this.setState({
        currentResidentDownloadUrl: `${residentDownloadUrl(this.props.activeHostel)}?is_resident=false`
      })
    }
    this.props.getResidents(
      url,
      this.successCallBack,
      this.errCallBack
    )
    this.checkIfMaintainer()
  }

  onChange = (event, { name, value }) => {
    let filter = 'is_student=true&'
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value }, () => {

        if (this.state.filterBranch != '') {
          filter = `${filter}branch=${this.state.filterBranch}&`
        }

        if (this.state.filterDegree != '') {
          filter = `${filter}degree=${this.state.filterDegree}&`
        }

        if (this.state.filterYear != '') {
          filter = `${filter}year=${this.state.filterYear}&`
        }
        if (this.state.filterSemester != '') {
          filter = `${filter}semester=${this.state.filterSemester}&`
        }
        if (this.state.inCampus !== "") {
          filter = `${filter}is_living_in_campus=${this.state.inCampus}&`
        }

        if (this.state.allResidents) {
          filter = `${filter}all=${true}&`
        }

        if (this.state.feeTypeFilter) [
          filter = `${filter}feeType=${this.state.feeTypeFilter}&`
        ]

        if (this.state.residentSearch.length >= 3) {
          filter = `${filter}search=${this.state.residentSearch}&`
        }

        if (this.state.nonResident) {
          filter = `${filter}is_resident=${!this.state.nonResident}&`
        }

        this.setState({
          loading: true,
          filter: filter
        })

        this.props.getResidents(
          `${residentUrl(this.props.activeHostel)}?${filter}`,
          this.successCallBack,
          this.errCallBack
        )

        this.setState({
          activePage: 1,
          currentResidentDownloadUrl: `${residentDownloadUrl(
            this.props.activeHostel
          )}?${filter}`
        })
      })
    }
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, loading: false })
    this.props.getResidents(
      `${residentUrl(this.props.activeHostel)}?page=${activePage}&${this.state.filter}`,
      this.successCallBack,
      this.errCallBack
    )
  }

  prevSuccessCallBack = (res) => {
    this.setState({
      previousRecords: res.data
    })

  }

  prevErrCallBack = (err) => {

  }

  showResidentDetails = (resident) => {
    this.props.fetchPreviousRecords(
      `${residentUrl(this.props.activeHostel)}${resident.enrolmentNumber}/previous_records/`,
      this.prevSuccessCallBack,
      this.prevErrCallBack
    )
    this.setState({
      open: true,
      activeResident: resident,
    })
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

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name,
    })
  };

  handleCheckboxChange = (e) => {
    this.setState({
      checked: !this.state.checked
    })
  }

  handleDataUpload = (e) => {
    e.preventDefault();
    if (this.state.file) {
      let formdata = new FormData();
      formdata.append('csv_file', this.state.file)
      formdata.append('complete_list', this.state.checked)
      this.props.updateBhawanData(
        updateBhawanDataUrl(this.props.activeHostel),
        formdata,
        this.uploadSuccessCallBack,
        this.uploadErrCallBack
      )
      this.setState({
        errMessage: "",
        loading: true,
      })
    } else {
      this.setState({
        errMessage: "Please upload file.",
      })
    }

  };

  uploadSuccessCallBack = (res) => {
    this.setState({
      csvData: res,
      loading: false,
      file: "",
      fileName: "Choose csv file",
    })
    this.props.getResidents(
      `${residentUrl(this.props.activeHostel)}?is_student=true`,
      this.successCallBack,
      this.errCallBack
    )
  }

  uploadErrCallBack = (message) => {
    this.setState({
      errMessage: message,
      loading: false,
      file: "",
      fileName: "Choose csv file",
    })
  }

  downloadFile = () => {
    const url = window.URL.createObjectURL(new Blob([this.state.csvData]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'logs')
    document.body.appendChild(link)
    link.click()
    this.setState({
      csvData: "",
    })
  }

  checkIfMaintainer = () => {
    this.setState({
      is_maintainer: this.props.who_am_i.isMaintainer,
    })
  }

  render() {
    const {
      activePage,
      filterBranch,
      filterDegree,
      filterYear,
      filterSemester,
      loading,
      feeTypeFilter,
      currentResidentDownloadUrl,
      allResidents,
      residentSearch,
      inCampus,
      open,
      activeResident,
      previousRecords,
      csvData,
      checked,
      nonResident
    } = this.state
    const { residents, constants, activePost, who_am_i } = this.props
    const LivingOptions = [
      {
        key: 0,
        value: 0,
        text: "Outside Campus",
      },
      {
        key: 1,
        value: 1,
        text: "Inside Campus",
      },
    ]
    let feeOptions = []
    for (const option in constants.statuses.FEE_TYPES) {
      feeOptions = [
        ...feeOptions,
        {
          key: option.toString(),
          value: option.toString(),
          text: constants.statuses.FEE_TYPES[option].toString(),
        }
      ]
    }
    let branchOptions = [];
    for (const i in constants.branches) {
      branchOptions.push({
        key: i.toString(),
        value: i.toString(),
        text: constants.branches[i].toString(),
      });
    }

    let degreeOptions = [];
    for (const i in constants.degrees) {
      degreeOptions.push({
        key: i,
        value: constants.degrees[i],
        text: constants.degrees[i],
      });
    }

    return (
      <div>
        <Modal
          closeIcon
          onClose={() => {
            this.setState({
              open: false,
              previousRecords: []
            })
          }}
          onOpen={() => {
            this.setState({
              open: true
            })
          }}
          open={open}
        >

          <Modal.Header>Student Details</Modal.Header>
          <Modal.Content image>
            <Image size='medium' src={activeResident.displayPicture} wrapped />
            <Modal.Description>
              <Header>{activeResident.residentName} - {activeResident.enrolmentNumber}</Header>
              <div>Current Hostel: {constants.hostels[activeResident.hostelCode]}</div>
              <div>Room Number: {activeResident.roomNumber}</div>
              <div>Contact Number: {activeResident.phoneNumber}</div>
              <div>Email Address: {activeResident.emailAddress}</div>
              <div>Current Year: {activeResident.currentYear}</div>
              <div>Current Semester: {activeResident.currentSemester}</div>
              <div>Program: {activeResident.program}</div>
              <div>Department: {activeResident.department}</div>
              <div>Date of Birth: {activeResident.dateOfBirth}</div>
              <div>Inside Campus: {activeResident.isLivingInCampus ? "Yes" : "No"}</div>
              <div>Fathers Name: {activeResident.fathersName}</div>
              <div>Fathers Contact: {activeResident.fathersContact}</div>
              <div>Mothers Name: {activeResident.mothersName}</div>
              <div>Mothers Contact: {activeResident.mothersContact}</div>
              <div>Fee Status: {constants.statuses.FEE_TYPES[activeResident.feeType]}</div>
              <div>Address: {activeResident.address}</div>
              <div>City: {activeResident.city}</div>
              <div>State: {activeResident.state}</div>
              <div>Reservation Category: {activeResident.reservationCategory}</div>
              <div>Admission Date: {activeResident.admissionDate && moment(activeResident.admissionDate).format('DD/MM/YY')}</div>
              <div>Contact Number as per Bhawan Records: {activeResident.contactNumberAsBhawan}</div>
              <div>Student Home Address as per Bhawan Records: {activeResident.addressBhawan}</div>
              <br></br>
              <div>
                <Header>Previous Records</Header>
                {previousRecords.map((record, ind) => {
                  return (
                    <div>
                      {constants.hostels[record.hostel]} :
                      {record.startDate && moment(record.startDate).format('DD/MM/YY')} -
                      {record.endDate && (moment(record.endDate).format('DD/MM/YY'))}
                    </div>
                  )
                })}
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Header as='h4'>Student Database </Header>
        <Container>
          <div>
            Total Count: {residents.count}
          </div>
          {([...constants['global_council']].includes(activePost)) && this.state.is_maintainer &&
            <div styleName='upload-data'>
              <Button as="label" htmlFor="file" type="button" basic>
                <Button.Content >{this.state.fileName}</Button.Content>
              </Button>
              <input
                type="file"
                id="file"
                accept={".csv"}
                hidden
                onChange={this.handleFileChange}
              />
              <Checkbox
                checked={checked}
                onChange={(e) => this.handleCheckboxChange(e)}
                label={{ children: 'Complete list' }} />
              <Button
                primary
                loading={loading}
                onClick={(e) => {
                  this.handleDataUpload(e);
                }}
              >
                Update student data
              </Button>
              {this.state.errMessage}
              {csvData &&
                <Button onClick={this.downloadFile}>Download log file</Button>
              }
            </div>

          }
          <div styleName='filter-container'>
            <Dropdown
              name="filterYear"
              multiple
              search
              clearable
              options={yearOptions}
              onChange={this.onChange}
              placeholder="Filter by year"
              value={filterYear}
              selection
            />
            <Dropdown
              name="filterSemester"
              multiple
              search
              clearable
              options={semesterOptions}
              onChange={this.onChange}
              placeholder="Filter by semester"
              value={filterSemester}
              selection
            />
            <Dropdown
              name="filterDegree"
              clearable
              multiple
              search
              placeholder="Filter by degree"
              value={filterDegree}
              onChange={this.onChange}
              options={degreeOptions}
              selection
            />
            <Dropdown
              name="filterBranch"
              clearable
              multiple
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
            <Dropdown
              name="inCampus"
              clearable
              placeholder="Filter by Living in the Campus"
              value={inCampus}
              onChange={this.onChange}
              options={LivingOptions}
              selection
            />
          </div>
          <div styleName='filter-container'>
            <Dropdown
              name="feeTypeFilter"
              clearable
              placeholder="Filter by fee status"
              value={feeTypeFilter}
              onChange={this.onChange}
              options={feeOptions}
              selection
            />
            {!nonResident &&
              <Checkbox
                name="allResidents"
                checked={allResidents}
                label="All residents"
                onChange={(e, { name, checked }) =>
                  this.onChange(e, { name: name, value: checked })
                }
              />
            }
            <a href={currentResidentDownloadUrl} download>
              <Button
                primary
              >
                Download list
              </Button>
            </a>
          </div>
          {!loading ?
            (
              <React.Fragment>
                {(residents.results && residents.results.length > 0)
                  ?
                  (
                    <div styleName="table-overflow">
                      <Table unstackable celled>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Enrollment No</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Room No.</Table.HeaderCell>
                            <Table.HeaderCell>Contact No.</Table.HeaderCell>
                            <Table.HeaderCell>Email Address</Table.HeaderCell>
                            <Table.HeaderCell>Current Year</Table.HeaderCell>
                            <Table.HeaderCell>Current Semester</Table.HeaderCell>
                            <Table.HeaderCell>Program</Table.HeaderCell>
                            <Table.HeaderCell>Department</Table.HeaderCell>
                            <Table.HeaderCell>Date of Joining in Bhawan</Table.HeaderCell>
                            <Table.HeaderCell>Inside Campus</Table.HeaderCell>
                            <Table.HeaderCell>Fee Status</Table.HeaderCell>
                            <Table.HeaderCell>Hostel</Table.HeaderCell>
                            <Table.HeaderCell>Details</Table.HeaderCell>
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
                                  <Table.Cell>{resident.currentSemester}</Table.Cell>
                                  <Table.Cell>{resident.program}</Table.Cell>
                                  <Table.Cell>{resident.department}</Table.Cell>
                                  <Table.Cell>{resident.startDate && moment(resident.startDate).format('DD/MM/YY')}</Table.Cell>
                                  <Table.Cell>{resident.isLivingInCampus ? "Yes" : "No"}</Table.Cell>
                                  <Table.Cell>{constants.statuses.FEE_TYPES[resident.feeType]}</Table.Cell>
                                  <Table.Cell>{constants.hostels[resident.hostelCode]}</Table.Cell>
                                  <Table.Cell >
                                    <Button onClick={() => { this.showResidentDetails(resident) }}>
                                      Show
                                    </Button>
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
                  ) :
                  (
                    <Segment>No Student with applied filters found</Segment>
                  )
                }
              </React.Fragment>
            ) :
            (
              <Loading />
            )
          }
        </Container>
      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    residents: state.residents,
    activeHostel: state.activeHostel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getResidents: (url, successCallBack, errCallBack) => {
      dispatch(getResidents(url, successCallBack, errCallBack))
    },
    downloadResidents: (url, successCallBack, errCallBack) => {
      dispatch(downloadResidents(url, successCallBack, errCallBack))
    },
    fetchPreviousRecords: (url, prevSuccessCallBack, prevErrCallBack) => {
      dispatch(fetchPreviousRecords(url, prevSuccessCallBack, prevErrCallBack))
    },
    updateBhawanData: (url, data, successCallBack, errCallBack) => {
      dispatch(updateBhawanData(url, data, successCallBack, errCallBack))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDatabase)

