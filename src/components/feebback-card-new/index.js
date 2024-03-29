import React, { Component } from 'react';
import { tailwindWrapper } from '../../../../../formula_one/src/utils/tailwindWrapper';

class FeedbackTable extends Component {
    render() {
        return (
            <div className={tailwindWrapper(" ml-4")}>
                <table className={tailwindWrapper("")}>
                    <thead className={tailwindWrapper("p-12 bg-[#6381EB] text-white")}>
                        <tr className={tailwindWrapper("grid grid-cols-5 px-6 py-4")}>
                            <td className={tailwindWrapper("px-4 py-2 col-span-2 ")}>Feedbacks</td>
                            <td className={tailwindWrapper("px-4 py-2 ")}>Attachments</td>
                            <td className={tailwindWrapper("px-4 py-2 ")}>Status</td>
                            <td className={tailwindWrapper("px-4 py-2 ")}>Date & time</td>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className={tailwindWrapper("grid grid-cols-5")}>
                            <td className={tailwindWrapper("border px-4 py-2 col-span-2")}>Some feedback text</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Attachment</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Pending</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>2024-03-29</td>
                        </tr>
                        <tr className={tailwindWrapper("grid grid-cols-5")}>
                            <td className={tailwindWrapper("border px-4 py-2 col-span-2")}>Some feedback text</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Attachment</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Pending</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>2024-03-29</td>
                        </tr>
                        <tr className={tailwindWrapper("grid grid-cols-5")}>
                            <td className={tailwindWrapper("border px-4 py-2 col-span-2")}>Some feedback text</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Attachment</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>Pending</td>
                            <td className={tailwindWrapper("border px-4 py-2")}>2024-03-29</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default FeedbackTable;
