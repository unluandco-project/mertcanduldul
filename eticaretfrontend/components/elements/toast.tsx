import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
    FaInfo,
    FaCheck,
    FaExclamationTriangle,
    FaBug,
    FaExclamationCircle
} from "react-icons/fa";

interface ToastProps {
    type: "info" | "success" | "warning" | "error"
}

interface ToastMessageProps {
    message: string;
    type: "info" | "success" | "warning" | "error"
}

export const displayIcon = (type: ToastProps["type"]) => {
    switch (type) {
        case "success":
            return <FaCheck />;
        case "info":
            return <FaInfo />;
        case "error":
            return <FaExclamationCircle />;
        case "warning":
            return <FaExclamationTriangle />;
        default:
            return <FaBug />;
    }
};



const ToastMessage = ({ type, message }: ToastMessageProps) => toast[type](
    <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
            {message}
        </div>
    </div>
);

ToastMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;
