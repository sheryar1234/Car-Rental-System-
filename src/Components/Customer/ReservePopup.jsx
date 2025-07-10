import React, { useState } from "react";

const ReservePopup = ({ vehicle, onClose, onSubmit, formData, setFormData, totalCost, setTotalCost }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash"); // State to track payment method

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };

            if (updatedFormData.fromDate && updatedFormData.toDate) {
                const fromDate = new Date(updatedFormData.fromDate);
                const toDate = new Date(updatedFormData.toDate);

                if (toDate > fromDate) {
                    const diffTime = toDate - fromDate;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include the last day
                    setTotalCost(diffDays * vehicle.rentPrice);
                } else {
                    alert("To Date must be after From Date.");
                    updatedFormData.toDate = ""; // Reset invalid date
                }
            }

            return updatedFormData;
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value); // Update payment method state
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.paymentReceipt && paymentMethod === "online") {
            alert("Please upload the payment receipt.");
            return;
        }
        if (!formData.accountNumber && paymentMethod === "online") {
            alert("Please enter your account number.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="sticky top-0 right-0 ml-auto text-gray-500 text-2xl hover:text-black z-10"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reserve {vehicle.name}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">From Date:</label>
                        <input
                            type="date"
                            name="fromDate"
                            value={formData.fromDate}
                            onChange={handleDateChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">To Date:</label>
                        <input
                            type="date"
                            name="toDate"
                            value={formData.toDate}
                            onChange={handleDateChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">License Image:</label>
                        <input
                            type="file"
                            name="licenseImage"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">ID Card Image:</label>
                        <input
                            type="file"
                            name="idCardImage"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium">Total Cost:  <span className="text-cyan-500">Rs {totalCost}</span></p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Payment Method:</label>
                        <select
                            name="paymentMethod"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="cash">Payment by Cash</option>
                            <option value="online">Pay Online</option>
                        </select>
                    </div>
                    {paymentMethod === "online" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Payment QR Code:</label>
                                <img src="/PaymentQRcode.jpeg" alt="Payment QR Code" className="w-full h-auto mb-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Account Number:</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Enter your account number"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Payment Receipt:</label>
                                <input
                                    type="file"
                                    name="paymentReceipt"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                        Confirm Reservation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservePopup;