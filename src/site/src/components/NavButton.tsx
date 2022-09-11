const root = document.querySelector('#root');

export default function NavButton() {
  function onClick() {
    root.classList.toggle('nav');
  }

  return <div className="nav-button" onClick={onClick} >
    <div /><div /><div />
  </div>;
}
