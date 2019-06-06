import React from 'react';
import styled from 'styled-components';

import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';



const Tooltip = ({ arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement, renderContent, ...rest }) =>  {

    return (
        <div {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}>
            <div {...getArrowProps({ref: arrowRef, className: 'tooltip-arrow', 'data-placement': placement})} />
            {renderContent(rest)}
        </div>
    );
};


const TriggerWrapper = styled.div`
  display: inline-block;
`;


function Trigger({getTriggerProps, triggerRef, children}) {
    return (
        <TriggerWrapper {...getTriggerProps({ref: triggerRef, className: 'trigger'})}>
            {children}
        </TriggerWrapper>
    );
}


export { Tooltip };

export default function PopoverTrigger(props) {

    return (
        <TooltipTrigger placement={props.placement || "bottom"} trigger={props.trigger || "click"} tooltip={({
            arrowRef,
            tooltipRef,
            getArrowProps,
            getTooltipProps,
            placement
        }) => {
            return <Tooltip arrowRef={arrowRef} tooltipRef={tooltipRef} getArrowProps={getArrowProps}
                getTooltipProps={getTooltipProps} placement={placement} {...props} />;
        }}>
            {
                ({getTriggerProps, triggerRef}) => {
                    return <Trigger getTriggerProps={getTriggerProps} triggerRef={triggerRef} children={props.children} />;
                }
            }
        </TooltipTrigger>
    )

};