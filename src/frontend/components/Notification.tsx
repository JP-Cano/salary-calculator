import React, { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "warning";

type NotificationProps = {
    message: string;
    type: NotificationType;
    onDismiss: () => void;
};

export function Notification({ message, type, onDismiss }: NotificationProps) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onDismiss, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`notification notification-${type} ${exiting ? "notification-exit" : ""}`}>
            {message}
        </div>
    );
}
