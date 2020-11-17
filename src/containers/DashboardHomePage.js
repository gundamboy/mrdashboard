import React, { Component } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import basicStyle from '@iso/assets/styles/constants';
import {Col, Row} from "antd";
import LayoutWrapper from "@iso/components/utility/layoutWrapper";
import Box from "@iso/components/utility/box";

export default function() {
    const { rowStyle, colStyle } = basicStyle;

    return (
        <LayoutWrapper>
            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <Box style={{ padding: 20 }}>
                        <h1>Choose an area on the left to begin.</h1>
                    </Box>
                </Col>
            </Row>
        </LayoutWrapper>
    )
}
