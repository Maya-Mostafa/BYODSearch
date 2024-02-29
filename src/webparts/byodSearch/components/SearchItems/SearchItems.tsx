import * as React from 'react';
import SearchItemsProps  from './SearchItemsProps';
import styles from '../ByodSearch.module.scss';
import { Icon, TeachingBubble } from 'office-ui-fabric-react';
import { isFromTargetAudience } from '../../services/requests';
import FlagBtn from '../FlagBtn/FlagBtn';
import { copyTextToClipboard } from '../../services/requests';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { faUser, faLock, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchItems (props:SearchItemsProps) {

    const filteredItems = props.items ? props.items.filter((item: any) => item.fields.Title.toLowerCase().indexOf(props.searchTerm.toLowerCase()) >= 0) : [];
    const buttonId = useId('targetButton');
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);

    return(
        <div className={styles.searchResultsBox}>  
            {filteredItems.map((item: any) => {
                if (!item.fields._ModernAudienceTargetUserField || 
                    props.memberOfGroups && item.fields._ModernAudienceTargetUserField && 
                    isFromTargetAudience(props.context, props.memberOfGroups, item.fields._ModernAudienceTargetUserField, 'LookupValue')){
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <div className={styles.searchResult}>
                            <a className={styles.headlerLink} href={item.fields.link ? item.fields.link.Url: ''} rel="noreferrer" target={"_blank"} data-interception="off" title={item.fields.link ? item.fields.link.Description : ''}>
                                <span className={styles.imgWrapper}><img width="100px" src={item.fields.Image? item.fields.Image.Url : require('../../assets/lib5.svg')} /></span>
                                <span>{item.fields.Title}</span>
                                <span className={styles.libraryTitle}>{item.libraryName}</span>
                            </a>
                            <div className={styles.descpHover}>{item.fields.Short_x0020_Description}</div>
                            <div>
                                {item.fields.login && item.fields.pwd &&
                                    <div className={styles.cardFlag}>
                                        <FlagBtn 
                                            icon={faUser} 
                                            tooltipText='Click to copy username'
                                            calloutText='Copied'
                                            onClick={()=>copyTextToClipboard(item.fields.login)}>
                                            {item.fields.login}
                                            </FlagBtn>
                                        <FlagBtn 
                                            icon={faLock} 
                                            tooltipText='Click to copy password'
                                            calloutText='Copied'
                                            onClick={()=>copyTextToClipboard(item.fields.pwd)}>
                                            {item.fields.pwd}
                                        </FlagBtn>
                                    </div>
                                }
                                {item.fields.LoginDisclaimer &&
                                    <>
                                        <div className={styles.cardFlag}>
                                            <span className={styles.flagItem} id={buttonId} onClick={toggleTeachingBubbleVisible}>
                                            <FontAwesomeIcon icon={faCircleInfo} />Login Info
                                            </span>
                                        </div>

                                        {teachingBubbleVisible && (
                                            <TeachingBubble
                                                illustrationImage={{src: require('../../assets/login_info_8.png'), alt: '', height: '110px', style:{paddingLeft: '7px'}}}
                                                isWide={true}
                                                hasSmallHeadline={true}
                                                hasCloseButton={true}
                                                closeButtonAriaLabel="Close"
                                                target={`#${buttonId}`}
                                                onDismiss={toggleTeachingBubbleVisible}
                                                headline="Login Information">
                                                {item.fields.LoginDisclaimer}
                                            </TeachingBubble>
                                        )}

                                    </>
                                }
                                <a  title={item.fields.link ? item.fields.link.Description : ''} className={styles.arrowLink}
                                    href={item.fields.link ? item.fields.link.Url: ''} rel="noreferrer" target={"_blank"} data-interception="off">
                                    <Icon className={styles.searchArrow} iconName='ChevronRightMed' />
                                </a>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}