import React from 'react';
import {Link} from "react-router-dom";
import Button from "@iso/components/uielements/button";

export const sponsorshipTabs = [
  {
    title: 'Pending Sponsorships',
    value: 'pending',
  },
  {
    title: 'Approved Sponsorships',
    value: 'approved',
  },
  {
    title: 'Denied Sponsorships',
    value: 'denied',
  },
]

export const sponsorshipColumns = [
  {
    columns: [
      {
        title: "Submission Date",
        key: "date",
        dataIndex: "date",
        sorter: true,
        width: "10%",
        render: data => <p>{data}</p>,
      },
      {
        title: "Org Name",
        key: "orgName",
        dataIndex: "orgName",
        sorter: true,
        render: text => <p>{text}</p>,
      },
      {
        title: "Primary Name",
        key: "primaryName",
        dataIndex: "primaryName",
        sorter: true,
        render: text => <p>{text}</p>,
      },
      {
        title: "Application Type",
        key: "appType",
        dataIndex: "appType",
        width: 220,
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
        ),
      }
    ]
  }
];

export const sponsorshipSingleViewColumns = [
  {
    title: "Questions",
    key: "question",
    dataIndex: "question",
    width: "50%",
    render: text => <p>{text}</p>,
  },
  {
    title: "Answers",
    key: "answer",
    dataIndex: "answer",
    width: "50%",
    render: text => <p>{text}</p>,
  }
];

export const filesSingleViewColumns = [
  {
    title: "Files",
    key: "files",
    dataIndex: "files",
    width: "50%",
    render: text => <p>{text}</p>,
  },
];

export const referralTabs = [
  {
    title: 'Pending Referrals',
    value: 'pending',
  },
  {
    title: 'Approved Referrals',
    value: 'approved',
  },
  {
    title: 'Denied Referrals',
    value: 'denied',
  },
]

export const grantTabs = [
  {
    title: 'Pending Grants',
    value: 'pending',
  },
  {
    title: 'Approved Grants',
    value: 'approved',
  },
  {
    title: 'Denied Grants',
    value: 'denied',
  },
]
