import styles from './journey-list.module.css';

/* eslint-disable-next-line */
export interface JourneyListProps {}

export function JourneyList(props: JourneyListProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to JourneyList!</h1>
    </div>
  );
}

export default JourneyList;
