function Modal({ show, close, desc }) {
  if (!show) return null;
  return (
    <div>
      <h2>{desc.position}</h2>
      <p>{desc.description}</p>
      <button onClick={close}>Close</button>
    </div>
  );
}
export default Modal;