import classNames from 'classnames';

export default function Badge(props) {
  return (
    <span className={classNames("inline-block bg-black white rounded ml1 small", props.className)}
          style={{ padding: '2px 4px' }}>
      {props.children}
    </span>
  );
}
