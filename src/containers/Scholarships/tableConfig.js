import React from 'react';
import {Link} from "react-router-dom";
import Button from "@iso/components/uielements/button";

const scholarshipTabs = [
    {
        title: 'DCC In Progress',
        value: 'pendingDcc',
    },
    {
        title: 'Higher EDU In Progress',
        value: 'pendingEdu',
    },
    {
        title: 'DCC Submitted',
        value: 'completedDcc',
    },
    {
        title: 'Higher EDU Submitted',
        value: 'completedEdu',
    },
    {
        title: 'Approved Scholarships ',
        value: 'approved',
    },
    {
        title: 'Denied Scholarships',
        value: 'denied',
    },
]
const scholarshipColumnsCompleted = [
    {
        columns: [
            {
                title: "Name",
                key: "name",
                dataIndex: "name",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "Email",
                key: "email",
                dataIndex: "email",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "City",
                key: "city",
                dataIndex: "city",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "Started",
                key: "started",
                dataIndex: "started",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "Finished",
                key: "finished",
                dataIndex: "finished",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "",
                key: "appLink",
                dataIndex: "appLink",
                width: "6%",
                render: url => (
                    <div className="">
                        <Link to={url}>
                            <Button className="applicationButton" color="primary">View</Button>
                        </Link>
                    </div>
                )
            }
        ]
    }
]

const scholarshipColumnsPending = [
    {
        columns: [
            {
                title: "Name",
                key: "name",
                dataIndex: "name",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "Email",
                key: "email",
                dataIndex: "email",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "City",
                key: "city",
                dataIndex: "city",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "Started",
                key: "started",
                dataIndex: "started",
                sorter: true,
                render: text => <p>{text}</p>,
            },
            {
                title: "",
                key: "appLink",
                dataIndex: "appLink",
                width: "6%",
                render: url => (
                    <div className="">
                        <Link to={url}>
                            <Button className="applicationButton" color="primary">View</Button>
                        </Link>
                    </div>
                )
            }
        ]
    }
]

export {scholarshipColumnsCompleted, scholarshipTabs, scholarshipColumnsPending};