import {useEffect, useRef} from 'react';

interface Props {
  onClickOutside: () => void;
}

function OutsideClickHandler({onClickOutside, children}: Props & JSX.ElementChildrenAttribute) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        event.stopPropagation();
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className='info-box'>
      {children}
    </div>
  );
}

export default OutsideClickHandler;