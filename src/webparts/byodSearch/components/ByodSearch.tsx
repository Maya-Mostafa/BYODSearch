import * as React from 'react';
import styles from './ByodSearch.module.scss';
import { IByodSearchProps } from './IByodSearchProps';
import { SearchBox } from 'office-ui-fabric-react';
import { getGraphMemberOf, readAllListsGraph } from '../services/requests';
import SearchItems from './SearchItems/SearchItems';

export default function ByodSearch(props: IByodSearchProps) {

  const [listsItems, setListsItems] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [memberOfGroups, setMemberofGroups] = React.useState(null);

  const onSearchChangedHandler = (_: any, text: string): void => {
    setSearchTerm(text);
  };

  React.useEffect(()=>{
    readAllListsGraph(props.context, props.siteUrl, props.listName, 500).then((res: any) => {
      console.log("readAllListsGraph", res.flat());
      setListsItems(res.flat());
    });
    getGraphMemberOf(props.context).then((memberOfGroupsRes: any) => {
      console.log("graphMemberOf", memberOfGroupsRes);
      setMemberofGroups(memberOfGroupsRes);
    });
  }, []);


  return (
    <section className={`${styles.byodSearch} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <SearchBox 
          placeholder={props.searchPlaceholder} 
          onChange={onSearchChangedHandler}
      />
      {searchTerm &&
        <SearchItems 
          context={props.context}
          items={listsItems}
          searchTerm = {searchTerm}
          memberOfGroups = {memberOfGroups}
        />
      }
    </section>
  );

}


