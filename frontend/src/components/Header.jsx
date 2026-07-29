import "./Header.css";

function Header() {
  return (
    <section className="hero">
      <h1>
        Hi there, <span style={{ color: "var(--primary)" }}>Welcome</span>
      </h1>
      <p>What would you like to paste?</p>
    </section>
  );
}

export default Header;
