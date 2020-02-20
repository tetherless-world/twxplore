import './Frame.scss';

import * as classnames from 'classnames';
import {ActiveNavbarItem} from 'twxplore/gui/geo/components/navbar/ActiveNavbarItem';
import Navbar from 'twxplore/gui/geo/components/navbar/Navbar';
import * as React from 'react';
import {useEffect} from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row} from "reactstrap";

export const Frame: React.FunctionComponent<{
    activeNavItem?: ActiveNavbarItem;
    breadcrumbItems?: React.ReactNode;
    cardTitle?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    documentTitle: string;
}> = ({activeNavItem, breadcrumbItems, cardTitle, className, children, documentTitle}) => {
    useEffect(() => {
        document.title = "twxplore - " + documentTitle;
    });
    return (
        <div className={classnames(["frame", className])}>
            <Navbar activeNavItem={activeNavItem}/>
            <div className="mb-2 mt-2">
                <Container fluid>
                    <Row>
                        <Col className="px-0" xs="12">
                            <Card>
                                <CardHeader>
                                    <CardTitle><h2>{cardTitle ? cardTitle : documentTitle}</h2></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {children}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/*{Environment.development ? <DevTools /> : null}*/}
        </div>
    );
}
