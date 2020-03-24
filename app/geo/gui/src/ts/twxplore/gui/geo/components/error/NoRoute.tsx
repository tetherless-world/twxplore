import * as React from 'react';
import {RouteComponentProps} from 'react-router';

export const NoRoute: React.FunctionComponent<RouteComponentProps> = ({location}) => (
    <div>
        <h3>Not Found</h3>
    </div>
);
