import * as React from 'react';
import SearchItemsProps  from './SearchItemsProps';
import styles from '../ByodSearch.module.scss';
import { Icon } from 'office-ui-fabric-react';
import { isFromTargetAudience } from '../../services/requests';

export default function SearchItems (props:SearchItemsProps) {

    const filteredItems = props.items ? props.items.filter((item: any) => item.fields.Title.toLowerCase().indexOf(props.searchTerm.toLowerCase()) >= 0) : [];

    return(
        <div className={styles.searchResultsBox}>  
            {filteredItems.map((item: any) => {
                if (!item.fields._ModernAudienceTargetUserField || 
                    props.memberOfGroups && item.fields._ModernAudienceTargetUserField && 
                    isFromTargetAudience(props.context, props.memberOfGroups, item.fields._ModernAudienceTargetUserField, 'LookupValue')){
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <a  title={item.fields.link ? item.fields.link.Description : ''} 
                            href={item.fields.link ? item.fields.link.Url: ''} 
                            rel="noreferrer" target={"_blank"} data-interception="off" className={styles.searchResult}>
                            <div>
                                <span className={styles.imgWrapper}><img width="100px" src={item.fields.Image? item.fields.Image.Url : require('../../assets/lib5.svg')} /></span>
                                <span>{item.fields.Title}</span>
                                <span className={styles.libraryTitle}>{item.libraryName}</span>
                            </div>
                            <Icon className={styles.searchArrow} iconName='ChevronRightMed' />
                        </a>
                    );
                }
            })}
        </div>
    );
}