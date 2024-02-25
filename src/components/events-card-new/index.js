import React from 'react';
import { tailwindWrapper } from "../../../../../formula_one/src/utils/tailwindWrapper";

const EventCard = ({ eventName, eventLocation, onRegister, index }) => {
    const backgroundColorClass = index % 2 === 0 ? "bg-[#E5E9FF]" : "bg-white";
    return (
        <div className={tailwindWrapper(`flex justify-around items-center p-2 rounded-lg ${backgroundColorClass}`)}>
            <div>
                <h3 className={tailwindWrapper("text-xl font-semibold mb-2")}>{eventName}</h3>
            </div>
            <div className={tailwindWrapper("flex flex-col")}>
                <p className={tailwindWrapper("text-[#133BC5] mb-1 font-bold")}>{eventLocation}</p>
                <p className={tailwindWrapper("mb-1 font-bold")}>Date : 10/12/24</p>
                <p className={tailwindWrapper("mb-1 text-[#133BC5] font-bold")}>Time : 8:00PM</p>
            </div>
            <div className={tailwindWrapper("flex flex-col gap-2")}>
                <button
                    className={tailwindWrapper("text-[#133BC5] bg-white border border-[#133BC5] font-bold px-4 py-2 rounded-lg")}
                    onClick={onRegister}
                >
                    Register
                </button>
                <p className={tailwindWrapper("text-gray-700 mb-2")}>registration upto 10/12/24 8:00pm</p>
            </div>
        </div>
    );
}

export default EventCard;
