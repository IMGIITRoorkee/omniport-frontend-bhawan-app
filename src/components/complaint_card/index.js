import React from "react";

import styles from "core/index.css";
import locals from "./index.css";

import moment from "moment";

class ComplaintCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { complaint, index, constants } = this.props;

    const bgColorClass = index % 2 == 0 ? "bg-indigo-100" : "bg-white";

    return (
      <tr className={`${styles[bgColorClass]}`}>
        <td className={`${styles["p-2"]} ${styles["rounded-l-md"]}`}>
          <span className={locals["dot"]}></span>
        </td>
        <td className={styles["p-2"]}>{complaint.description}</td>
        <td className={styles["p-2"]}>
          {moment(complaint.datetimeCreated).format("DD/MM/YY, hh:mm a")}
        </td>
        <td className={`${styles["p-2"]} ${styles["rounded-r-md"]}`}>
          {constants.statuses.COMPLAINT_STATUSES[complaint.status]}
        </td>
      </tr>
    );
  }
}

export default ComplaintCard;
