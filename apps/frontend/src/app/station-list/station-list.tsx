import styles from './station-list.module.css';

/* eslint-disable-next-line */
export interface StationListProps {}

export function StationList(props: StationListProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to StationList!</h1>
    </div>
  );
}

export default StationList;
