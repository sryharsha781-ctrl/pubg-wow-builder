export default function Home() {
  return (
    <div style={{padding: 20, fontFamily: "Arial"}}>
      <h1>PUBG WOW AI Map Builder</h1>
      <p>This is your deployed MVP.</p>

      <h2>How it works</h2>
      <ul>
        <li>Enter a map idea</li>
        <li>Generate blueprint</li>
        <li>Follow build steps in PUBG WOW</li>
      </ul>

      <h2>Example Output</h2>
      <pre>
Map Name: Iron Core Arena
Mode: TDM
Players: 4v4

Layout:
- Left flank
- Mid lane
- Right flank
- Center tower

Rules:
- Fast respawn
- No spawn kill
- Balanced cover
      </pre>
    </div>
  );
}
