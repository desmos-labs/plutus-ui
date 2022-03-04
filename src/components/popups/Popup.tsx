type PopupProps = {
  children: JSX.Element
  visible: boolean
}

/**
 * Represents a generic popup.
 */
function Popup({children, visible}: PopupProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
      <div className="bg-white p-4 rounded-md text-center w-2/3 md:w-3/5 lg:w-1/3">
        {children}
      </div>
    </div>
  );
}

export default Popup;