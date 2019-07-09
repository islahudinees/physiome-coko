import React, { useState } from 'react';
import styled from 'styled-components';

import SubmissionListing from './submission-listing';
import SubmissionListingHeader, { HeaderHolder } from './submission-listing-header';

const PublishedPhases = [
    "Publish",
    "Published"
];

const _DashboardPublishedSubmissions = ({className, history, children}) => {

    const [searchText, setSearchText] = useState("");

    const searchTextDidChange = (text) => {
        setSearchText(text);
    };

    const renderHeading = ({header}) => {
        return (
            <HeaderHolder>
                {header}
                <SubmissionListingHeader showFilter={false} searchTextDidChange={searchTextDidChange} />
            </HeaderHolder>
        );
    };

    return (
        <div className={className}>
            <SubmissionListing heading="Published Submissions" children={children} phases={PublishedPhases}
                renderHeading={renderHeading} searchText={searchText} />
        </div>
    );
};

const DashboardPublishedSubmissions = styled(_DashboardPublishedSubmissions)`
  padding: 32px;
`;

export default DashboardPublishedSubmissions;