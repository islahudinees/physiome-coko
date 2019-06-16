import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

import Card from './card';

import SelectInput from './select-input';
import { SmallTextInput } from './text-input';

import { FaTimes } from 'react-icons/fa';
import humanFormatByteCount from "../helpers/humanFormatByteCount";
import mimeTypeToIcon from "../helpers/mimeTypeToIcon";


function _FileDownloadLink({ className, file, children }) {

    // FIXME: need to generate proper download links for files from the GraphQL endpoint
    // return <a href={generateDownloadLinkForSubmissionFile(submission, file)} target="_blank" rel="noopener noreferrer">{children}</a>;
    return <a className={className} href={""} target="_blank" rel="noopener noreferrer">{children}</a>;
}

const FileDownloadLink = styled(_FileDownloadLink)`
    color: initial;
    text-decoration: none;

    &:visited {
        color: initial;
    }
`;



function _FileListingRow({className, file, ref, fileLabels, fileTypeOptions, linkForFile, removeFile, changeFileType, changeFileLabel, fileDownloadLinkComponent}) {

    const [label, setLabel] = useState(file.label || "");
    const [type, setType] = useState(file.type || "");
    const DownloadLink = fileDownloadLinkComponent;

    const handleFileTypeChanged = (file, event) => {
        if(changeFileType) {
            setType(changeFileType(file, event.target.value));
        }
    };

    const handleFileLabelChanged = (file, event) => {
        if(changeFileLabel) {
            setLabel(changeFileLabel(file, event.target.value));
        }
    };

    const FileIcon = useMemo(() => mimeTypeToIcon(file.fileMimeType), [file.fileMimeType]);

    return (
        <Card className={className} reorderingGrabber={true} >
            <div className="file-index" />
            <div className="file-icon"><FileIcon /></div>
            <div className="file-name">
                <DownloadLink file={file} linkForFile={linkForFile}>
                    {file.fileDisplayName}
                </DownloadLink>
                <span className="file-size">{humanFormatByteCount(file.fileByteSize)}</span>
            </div>

            { fileLabels ?
                <div className="file-label">
                    {(changeFileLabel ? <SmallTextInput type="text" value={label} onChange={(e) => handleFileLabelChanged(file, e)} /> : <span>{file.label}</span>)}
                </div> : null
            }

            { fileTypeOptions ?
                <div className="file-type">
                    <SelectInput options={fileTypeOptions} value={type} onChange={(e) => handleFileTypeChanged(file, e)} />
                </div> : null }

            {removeFile ?
                <div className="file-remove">
                    <FaTimes onClick={() => { return removeFile(file); }} />
                </div> : null}
        </Card>
    );
}

const FileListingRow = styled(_FileListingRow)`

    padding: 5px 2px;
    height: 2em;
    
    & .content {
      display: flex;
      flex-direction: row;
    }
    
    svg {
        height: 100%;
    }
    
    & .file-index {
        display: none;
        background: #a0a0a0;
        text-align: center;
        line-height: 2.222em;
        margin-right: 10px;
        margin-left: 8px;
        color: white;
        font-size: 0.9em;
        flex-basis: 30px;
    }
    
    & .file-icon {
        /*margin-left: 8px;*/
    }
    
    & .file-name {
        margin-left: 5px;
        margin-right: 5px;
        line-height: 2em;
        flex: auto;
        text-decoration: none;
        max-height: 2em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    & .file-size {
        color: #6d6d6d;
        font-size: 0.9em;
        line-height: 2em;
    }
    
    & .file-size:before {
        content: " ("
    }
    & .file-size:after {
        content: ")"
    }
    
    
    & .file-remove {
        display: inline-block;
        margin-right: 10px;
        color: darkgrey;
        cursor: pointer;
    }
    
    & .file-remove:hover {
        color: black;
    }
    
    & .file-type {
        min-width: 120px;
        margin-right: 15px;
        padding-left: 15px;
        padding-right: 15px;
    }
    
    & .file-type > select {
      margin-top: 3px;
      font-size: 90%;
    }
    
    & .file-label {
        min-width: 200px;
    }
`;


function _FileUploadFileListing({ className, files, reorderFile, removeFile, changeFileType, changeFileLabel,
                                  fileLabels, fileTypeOptions, linkForFile, fileDownloadLinkComponent }) {

    const listingProps = {
        removeFile,
        changeFileType,
        changeFileLabel,
        fileLabels,
        fileTypeOptions,
        linkForFile,
        fileDownloadLinkComponent: (fileDownloadLinkComponent || FileDownloadLink)
    };


    const listing = (files || []).map((file, index) => {

        return (
            <Draggable draggableId={file.id} key={file.id} data-id={file.id} index={index}>
                {(provided, snapshot)=>
                    <li key={file.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <FileListingRow file={file} {...listingProps}  />
                    </li>
                }
            </Draggable>
        );
    });

    const onDragEnd = function({source, destination}) {

        if (!destination || !reorderFile) {
            return;
        }

        const sourceIndex = source.index;
        const destinationIndex = destination.index;
        const file = files[sourceIndex];

        reorderFile(file, destinationIndex, sourceIndex);
    };

    return (
        <div className={`${className || ''} ${listing ? 'has-listing' : ''}`}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="file-listing">
                    {(provided, snapshot) => (
                        <ol style={{listStyle:"none", padding:0}} ref={provided.innerRef}>
                            {listing}
                            {provided.placeholder}
                        </ol>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default styled(_FileUploadFileListing)`

    font-family: ProximaNovaLight, sans-serif;
    font-size: 15px;

    ol {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    ol li {
        margin-bottom: 12px;
    }
    
    &.has-listing {
        margin-top: 15px;
    }
`;