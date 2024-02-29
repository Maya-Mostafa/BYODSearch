import * as React from 'react';
import styles from '../ByodSearch.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlagBtnProps } from './FlagBtnProps';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { Callout, DelayedRender,Text, TooltipHost } from 'office-ui-fabric-react';

export default function FlagBtn(props: FlagBtnProps) {

    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
    const buttonId = useId('callout-button');
    const tooltipId = useId('tooltip');
    
    const onClickHandler = () => {
        props.onClick();
        toggleIsCalloutVisible();
    };

    return (
        <span className={styles.flagItem}>
            <FontAwesomeIcon icon={props.icon} />
            <TooltipHost content={props.tooltipText} id={tooltipId}>
                <span id={buttonId} onClick={onClickHandler}>{props.children}</span>
            </TooltipHost>
            {isCalloutVisible && (
                <Callout className={styles.callout} target={`#${buttonId}`} onDismiss={toggleIsCalloutVisible} role="alert">
                    <DelayedRender>
                        <Text variant="small">{props.calloutText}</Text>
                    </DelayedRender>
                </Callout>
            )}
        </span>
    );
}
