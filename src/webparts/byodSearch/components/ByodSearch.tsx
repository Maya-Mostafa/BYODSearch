import * as React from 'react';
import styles from './ByodSearch.module.scss';
import { IByodSearchProps } from './IByodSearchProps';

export default function ByodSearch(props: IByodSearchProps) {

  return (
    <section className={`${styles.byodSearch} ${props.hasTeamsContext ? styles.teams : ''}`}>
      Test
    </section>
  );

}


